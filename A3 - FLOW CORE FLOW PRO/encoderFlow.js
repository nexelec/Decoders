/**
 * Payload Encoder LoRa Alliance for FLOW CORE & FLOW PRO (downlink)
 * Copyright 2026 Nexelec
 * Version : 1.0.0
 *
 * LoRaWAN downlink encoder / decoder (TS013 "Payload Codec API": encodeDownlink / decodeDownlink)
 *
 * Reference: D1183C_FLOW_Guide_Technique - public (rev. C)
 *   - frame structure and downlink command list: README-Frames_FLOW.md, section 7
 *
 * Frame format : 0x55 | CmdID | DATA | CmdID | DATA | ...
 *   - byte 0 is always the header 0x55
 *   - several commands can be chained in one frame
 *   - NEXELEC recommends sending command IDs in ASCENDING order
 *     (this encoder sorts them automatically)
 *   - application port: 56 (uplink and downlink)
 *
 * After applying a downlink the device spontaneously sends back its
 * updated configuration frame (0x04).
 */

var FLOW_FPORT = 56;
var FLOW_HEADER = 0x55;

/* -------------------------------------------------------------------------
 * Command table: id -> payload length in bytes (used by the decoder)
 * ---------------------------------------------------------------------- */
var FLOW_COMMANDS = {
  0x01: { len: 0, name: "getConfiguration" },
  0x0a: { len: 1, name: "setNfcEnabled" },
  0x1c: { len: 2, name: "setDelayedNetworkJoin" },
  0x4a: { len: 1, name: "deviceReset" },
  0x4b: { len: 1, name: "factoryReset" },
  0x63: { len: 1, name: "setTimeZone" },
  0x72: { len: 1, name: "setTemperatureOffset" },
  0x73: { len: 1, name: "setOpenWindowDetection" },
  0x74: { len: 1, name: "setOpenWindowDelta" },
  0x75: { len: 1, name: "setOpenWindowPauseDuration" },
  0x76: { len: 1, name: "setChildLock" },
  0x77: { len: 1, name: "setMinTemperature" },
  0x78: { len: 1, name: "setMaxTemperature" },
  0x79: { len: 1, name: "setRegulation" },
  0x7a: { len: 1, name: "setFrostProtection" },
  0x7b: { len: 1, name: "setFrostProtectionTemperature" },
  0x7c: { len: 1, name: "setComfortTemperature" },
  0x7d: { len: 1, name: "setEcoTemperature" },
  0x7e: { len: 1, name: "setAwayTemperature" },
  0x7f: { len: 1, name: "setHeatingSeason" },
  0x80: { len: 2, name: "setHeatingSeasonStart" },
  0x81: { len: 2, name: "setHeatingSeasonEnd" },
  0x82: { len: 2, name: "setWeeklySchedule" },
  0x83: { len: 12, name: "setDailyProfile1" },
  0x84: { len: 12, name: "setDailyProfile2" },
  0x85: { len: 12, name: "setDailyProfile3" },
  0x86: { len: 1, name: "setUplinkPeriodRegulationOn" },
  0x87: { len: 1, name: "setUplinkPeriodRegulationOff" },
  0x8a: { len: 1, name: "setTargetTemperature" },
  0x8b: { len: 1, name: "setLowBatteryValvePosition" },
  0x8c: { len: 0, name: "recalibrateMotor" },
  0x90: { len: 1, name: "setBoost" },
  0x91: { len: 1, name: "setBoostDuration" },
  0x93: { len: 1, name: "setChildLockOnNetworkLoss" },
  0x94: { len: 1, name: "setTemperatureHysteresis" },
  0x95: { len: 1, name: "setSchedules" },
  0x97: { len: 1, name: "setFuotaMode" },
  0x98: { len: 1, name: "setValvePositionWhenRegulationOff" },
  0x9a: { len: 1, name: "setSetpointDisplayOrientation" },
};

/* -------------------------------------------------------------------------
 * Validation helpers - every out-of-range value is a hard error,
 * never a silently truncated byte.
 * ---------------------------------------------------------------------- */

function flowNum(errors, key, value) {
  var n = typeof value === "string" ? Number(value) : value;
  if (typeof n !== "number" || !isFinite(n)) {
    errors.push(key + ": numeric value expected, got " + JSON.stringify(value));
    return null;
  }
  return n;
}

/** raw integer, must already be in [min,max] */
function flowInt(errors, key, value, min, max) {
  var n = flowNum(errors, key, value);
  if (n === null) return null;
  var r = Math.round(n);
  if (r !== n) errors.push(key + ": integer expected, got " + n);
  if (r < min || r > max) {
    errors.push(key + ": out of range (" + min + ".." + max + "), got " + n);
    return null;
  }
  return r;
}

/** boolean -> 0/1 (accepts true/false, 0/1, "true"/"false") */
function flowBool(errors, key, value) {
  if (value === true || value === 1 || value === "true" || value === "1") return 1;
  if (value === false || value === 0 || value === "false" || value === "0") return 0;
  errors.push(key + ": boolean expected, got " + JSON.stringify(value));
  return null;
}

/** physical value -> raw = round(value * factor + offset), checked against [min,max] */
function flowScaled(errors, warnings, key, value, factor, offset, min, max, unit, step) {
  var n = flowNum(errors, key, value);
  if (n === null) return null;
  var exact = n * factor + offset;
  var raw = Math.round(exact);
  if (Math.abs(exact - raw) > 1e-6) {
    warnings.push(
      key + ": " + n + unit + " is not a multiple of " + step + unit +
      ", rounded to " + ((raw - offset) / factor) + unit
    );
  }
  if (raw < min || raw > max) {
    errors.push(
      key + ": out of range (" + ((min - offset) / factor) + unit + ".." +
      ((max - offset) / factor) + unit + "), got " + n + unit
    );
    return null;
  }
  return raw;
}

/** setpoint 0..31 C, 0.5 C step -> raw 0..62 */
function flowSetpoint(errors, warnings, key, value) {
  return flowScaled(errors, warnings, key, value, 2, 0, 0, 62, "C", 0.5);
}

/** "horizontal"|"vertical" or 0/1 -> 0/1 */
var FLOW_ORIENTATIONS = { horizontal: 0, vertical: 1 };
function flowOrientation(errors, key, value) {
  if (typeof value === "string" && value.toLowerCase() in FLOW_ORIENTATIONS) {
    return FLOW_ORIENTATIONS[value.toLowerCase()];
  }
  if (value === 0 || value === 1) return value;
  errors.push(key + ': expected "horizontal"|"vertical" or 0/1, got ' + JSON.stringify(value));
  return null;
}

/** "frost"|"comfort"|"eco"|"away" or 0..3 -> 0..3 */
var FLOW_SLOT_MODES = { frost: 0, comfort: 1, eco: 2, away: 3 };
function flowSlotMode(errors, key, value) {
  if (typeof value === "string") {
    var k = value.toLowerCase();
    if (k in FLOW_SLOT_MODES) return FLOW_SLOT_MODES[k];
    errors.push(key + ': expected "frost"|"comfort"|"eco"|"away" or 0..3, got "' + value + '"');
    return null;
  }
  return flowInt(errors, key, value, 0, 3);
}

/**
 * Daily profile: 48 half-hour slots (00:00-00:30 ... 23:30-24:00),
 * 2 bits per slot, 4 slots per byte, first slot in bits [7..6] -> 12 bytes.
 */
function flowDailyProfile(errors, key, value) {
  if (!Array.isArray(value) || value.length !== 48) {
    errors.push(key + ": array of exactly 48 half-hour slots expected, got " +
      (Array.isArray(value) ? value.length + " entries" : typeof value));
    return null;
  }
  var out = [];
  for (var b = 0; b < 12; b++) {
    var byte = 0;
    for (var s = 0; s < 4; s++) {
      var idx = b * 4 + s;
      var m = flowSlotMode(errors, key + "[" + idx + "]", value[idx]);
      if (m === null) return null;
      byte |= m << (6 - 2 * s);
    }
    out.push(byte);
  }
  return out;
}

/** Weekly schedule: profile 1..3 per day, 2 bits per day, 2 bytes */
var FLOW_WEEK_DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
function flowWeeklySchedule(errors, key, value) {
  if (!value || typeof value !== "object") {
    errors.push(key + ": object with monday..sunday expected");
    return null;
  }
  var p = [];
  for (var i = 0; i < 7; i++) {
    var day = FLOW_WEEK_DAYS[i];
    if (!(day in value)) {
      errors.push(key + ": missing day " + day);
      return null;
    }
    var v = flowInt(errors, key + "." + day, value[day], 1, 3);
    if (v === null) return null;
    p.push(v - 1); // profile 1..3 -> 0..2
  }
  return [
    (p[0] << 6) | (p[1] << 4) | (p[2] << 2) | p[3], // mon tue wed thu
    (p[4] << 6) | (p[5] << 4) | (p[6] << 2),        // fri sat sun + 2 unused bits
  ];
}

/** {month:1-12, day:1-31} -> 2 bytes */
function flowDate(errors, key, value) {
  if (!value || typeof value !== "object") {
    errors.push(key + ": object {month, day} expected");
    return null;
  }
  var m = flowInt(errors, key + ".month", value.month, 1, 12);
  var d = flowInt(errors, key + ".day", value.day, 1, 31);
  if (m === null || d === null) return null;
  return [m, d];
}

/* -------------------------------------------------------------------------
 * Encoder
 * ---------------------------------------------------------------------- */
function encodeDownlink(input) {
  var errors = [];
  var warnings = [];
  var commands = []; // { id: <number>, data: [<bytes>] }
  var trailing = []; // raw bytes appended after the sorted commands
  var i, j;

  var data = (input && input.data) || {};

  function add(id, dataBytes) {
    // null anywhere means a validation error was already recorded: skip the command
    if (dataBytes === null) return;
    for (var k = 0; k < dataBytes.length; k++) {
      if (dataBytes[k] === null || dataBytes[k] === undefined) return;
    }
    commands.push({ id: id, data: dataBytes });
  }

  var keys = Object.keys(data);
  for (i = 0; i < keys.length; i++) {
    var key = keys[i];
    var v = data[key];
    switch (key) {
      /* --- maintenance / network ------------------------------------- */
      case "getConfiguration": // 0x01 - force a configuration uplink
        add(0x01, []);
        break;

      case "setNfcEnabled": // 0x0A
        add(0x0a, [flowBool(errors, key, v)]);
        break;

      case "setDelayedNetworkJoin": { // 0x1C - 10..10080 min, step 10, 2 bytes
        var raw = flowScaled(errors, warnings, key, v, 0.1, 0, 1, 1008, " min", 10);
        add(0x1c, raw === null ? null : [(raw >> 8) & 0xff, raw & 0xff]);
        break;
      }

      case "deviceReset": // 0x4A
        add(0x4a, [0x01]);
        break;

      case "factoryReset": // 0x4B
        add(0x4b, [0x01]);
        break;

      case "recalibrateMotor": // 0x8C
        add(0x8c, []);
        break;

      case "setFuotaMode": // 0x97
        add(0x97, [flowBool(errors, key, v)]);
        break;

      /* --- measurement / regulation ---------------------------------- */
      case "setTimeZone": // 0x63 - UTC-12..UTC+14
        add(0x63, [flowScaled(errors, warnings, key, v, 1, 12, 0, 26, " h", 1)]);
        break;

      case "setTemperatureOffset": // 0x72 - -5.0..+5.0 C, step 0.1
        add(0x72, [flowScaled(errors, warnings, key, v, 10, 50, 0, 100, "C", 0.1)]);
        break;

      case "setOpenWindowDetection": // 0x73
        add(0x73, [flowBool(errors, key, v)]);
        break;

      case "setOpenWindowDelta": // 0x74 - 0.1..3.0 C
        add(0x74, [flowScaled(errors, warnings, key, v, 10, 0, 1, 30, "C", 0.1)]);
        break;

      case "setOpenWindowPauseDuration": // 0x75 - 1..60 min
        add(0x75, [flowInt(errors, key, v, 1, 60)]);
        break;

      case "setTemperatureHysteresis": // 0x94 - 0.1..9.9 C
        add(0x94, [flowScaled(errors, warnings, key, v, 10, 0, 1, 99, "C", 0.1)]);
        break;

      case "setRegulation": // 0x79
        add(0x79, [flowBool(errors, key, v)]);
        break;

      case "setValvePositionWhenRegulationOff": // 0x98 - 0..100 %
        add(0x98, [flowInt(errors, key, v, 0, 100)]);
        break;

      case "setLowBatteryValvePosition": // 0x8B - 0..99 %
        add(0x8b, [flowInt(errors, key, v, 0, 99)]);
        break;

      /* --- manual setpoint ------------------------------------------- */
      case "setTargetTemperature": // 0x8A
        add(0x8a, [flowSetpoint(errors, warnings, key, v)]);
        break;

      case "setMinTemperature": // 0x77
        add(0x77, [flowSetpoint(errors, warnings, key, v)]);
        break;

      case "setMaxTemperature": // 0x78
        add(0x78, [flowSetpoint(errors, warnings, key, v)]);
        break;

      case "setChildLock": // 0x76
        add(0x76, [flowBool(errors, key, v)]);
        break;

      case "setChildLockOnNetworkLoss": // 0x93
        add(0x93, [flowBool(errors, key, v)]);
        break;

      case "setBoost": // 0x90
        add(0x90, [flowBool(errors, key, v)]);
        break;

      case "setBoostDuration": { // 0x91 - 10..120 min, step 10 (raw = minutes)
        var boost = flowScaled(errors, warnings, key, v, 0.1, 0, 1, 12, " min", 10);
        add(0x91, boost === null ? null : [boost * 10]);
        break;
      }

      case "setSetpointDisplayOrientation": // 0x9A - "horizontal" | "vertical"
        add(0x9a, [flowOrientation(errors, key, v)]);
        break;

      /* --- automatic setpoint / schedules ----------------------------- */
      case "setFrostProtection": // 0x7A
        add(0x7a, [flowBool(errors, key, v)]);
        break;

      case "setFrostProtectionTemperature": // 0x7B
        add(0x7b, [flowSetpoint(errors, warnings, key, v)]);
        break;

      case "setComfortTemperature": // 0x7C
        add(0x7c, [flowSetpoint(errors, warnings, key, v)]);
        break;

      case "setEcoTemperature": // 0x7D
        add(0x7d, [flowSetpoint(errors, warnings, key, v)]);
        break;

      case "setAwayTemperature": // 0x7E - "absence prolongee"
        add(0x7e, [flowSetpoint(errors, warnings, key, v)]);
        break;

      case "setHeatingSeason": // 0x7F
        add(0x7f, [flowBool(errors, key, v)]);
        break;

      case "setHeatingSeasonStart": // 0x80 - {month, day}
        add(0x80, flowDate(errors, key, v));
        break;

      case "setHeatingSeasonEnd": // 0x81 - {month, day}
        add(0x81, flowDate(errors, key, v));
        break;

      case "setSchedules": // 0x95
        add(0x95, [flowBool(errors, key, v)]);
        break;

      case "setWeeklySchedule": // 0x82 - {monday:1..3, ...}
        add(0x82, flowWeeklySchedule(errors, key, v));
        break;

      case "setDailyProfile1": // 0x83 - 48 slots
        add(0x83, flowDailyProfile(errors, key, v));
        break;

      case "setDailyProfile2": // 0x84
        add(0x84, flowDailyProfile(errors, key, v));
        break;

      case "setDailyProfile3": // 0x85
        add(0x85, flowDailyProfile(errors, key, v));
        break;

      /* --- transmission periods --------------------------------------- */
      case "setUplinkPeriodRegulationOn": // 0x86 - 10..60 min, step 10
        add(0x86, [flowScaled(errors, warnings, key, v, 0.1, 0, 1, 6, " min", 10)]);
        break;

      case "setUplinkPeriodRegulationOff": // 0x87 - 10..1440 min, step 10
        add(0x87, [flowScaled(errors, warnings, key, v, 0.1, 0, 1, 144, " min", 10)]);
        break;

      /* --- escape hatch ------------------------------------------------
       * Raw "CmdID + DATA" hex string, appended AFTER the encoded commands
       * (the 0x55 header is added by the encoder, do not include it).
       */
      case "sendCustomHexCommand": {
        var hex = String(v).replace(/[\s:]/g, "");
        if (!/^[0-9a-fA-F]*$/.test(hex) || hex.length % 2 !== 0) {
          errors.push(key + ": even-length hexadecimal string expected, got " + JSON.stringify(v));
          break;
        }
        for (j = 0; j < hex.length; j += 2) {
          trailing.push(parseInt(hex.substring(j, j + 2), 16));
        }
        break;
      }

      default:
        errors.push('unknown command "' + key + '"');
        break;
    }
  }

  if (commands.length === 0 && trailing.length === 0 && errors.length === 0) {
    errors.push("empty downlink: no command provided");
  }

  // NEXELEC recommends ascending command IDs for forward compatibility.
  commands.sort(function (a, b) {
    return a.id - b.id;
  });

  var bytes = [FLOW_HEADER];
  for (i = 0; i < commands.length; i++) {
    bytes.push(commands[i].id);
    for (j = 0; j < commands[i].data.length; j++) bytes.push(commands[i].data[j]);
  }
  for (i = 0; i < trailing.length; i++) bytes.push(trailing[i]);

  if (bytes.length > 51) {
    warnings.push(
      "frame is " + bytes.length + " bytes: it may exceed the max payload size " +
      "of the current data rate (51 bytes at DR0-DR2 in EU868). Split it."
    );
  }

  if (errors.length > 0) {
    return { bytes: [], fPort: FLOW_FPORT, warnings: warnings, errors: errors };
  }

  return { bytes: bytes, fPort: FLOW_FPORT, warnings: warnings, errors: errors };
}

/* -------------------------------------------------------------------------
 * Decoder (used by the network server to display a downlink it is about to
 * send). Parses the frame back into the same JSON structure.
 * ---------------------------------------------------------------------- */
function decodeDownlink(input) {
  var bytes = input.bytes || [];
  var errors = [];
  var warnings = [];
  var data = {};

  function hex(arr) {
    return arr.map(function (b) { return ("0" + b.toString(16)).slice(-2).toUpperCase(); }).join("");
  }
  function setpoint(b) { return b / 2; }
  function slots(arr) {
    var names = ["frost", "comfort", "eco", "away"];
    var out = [];
    for (var k = 0; k < arr.length; k++) {
      for (var s = 0; s < 4; s++) out.push(names[(arr[k] >> (6 - 2 * s)) & 0x03]);
    }
    return out;
  }

  if (bytes.length === 0) {
    errors.push("empty payload");
    return { data: {}, warnings: warnings, errors: errors };
  }
  if (bytes[0] !== FLOW_HEADER) {
    errors.push("bad header: expected 0x55, got 0x" + hex([bytes[0]]));
    return { data: { raw: hex(bytes) }, warnings: warnings, errors: errors };
  }

  var i = 1;
  while (i < bytes.length) {
    var id = bytes[i++];
    var def = FLOW_COMMANDS[id];
    if (!def) {
      errors.push("unknown command ID 0x" + hex([id]) + " at offset " + (i - 1));
      data.raw = hex(bytes);
      break;
    }
    if (i + def.len > bytes.length) {
      errors.push("truncated payload for command " + def.name);
      break;
    }
    var p = bytes.slice(i, i + def.len);
    i += def.len;

    switch (id) {
      case 0x01: data.getConfiguration = ""; break;
      case 0x0a: data.setNfcEnabled = p[0] === 1; break;
      case 0x1c: data.setDelayedNetworkJoin = ((p[0] << 8) | p[1]) * 10; break;
      case 0x4a: data.deviceReset = ""; break;
      case 0x4b: data.factoryReset = ""; break;
      case 0x63: data.setTimeZone = p[0] - 12; break;
      case 0x72: data.setTemperatureOffset = (p[0] - 50) / 10; break;
      case 0x73: data.setOpenWindowDetection = p[0] === 1; break;
      case 0x74: data.setOpenWindowDelta = p[0] / 10; break;
      case 0x75: data.setOpenWindowPauseDuration = p[0]; break;
      case 0x76: data.setChildLock = p[0] === 1; break;
      case 0x77: data.setMinTemperature = setpoint(p[0]); break;
      case 0x78: data.setMaxTemperature = setpoint(p[0]); break;
      case 0x79: data.setRegulation = p[0] === 1; break;
      case 0x7a: data.setFrostProtection = p[0] === 1; break;
      case 0x7b: data.setFrostProtectionTemperature = setpoint(p[0]); break;
      case 0x7c: data.setComfortTemperature = setpoint(p[0]); break;
      case 0x7d: data.setEcoTemperature = setpoint(p[0]); break;
      case 0x7e: data.setAwayTemperature = setpoint(p[0]); break;
      case 0x7f: data.setHeatingSeason = p[0] === 1; break;
      case 0x80: data.setHeatingSeasonStart = { month: p[0], day: p[1] }; break;
      case 0x81: data.setHeatingSeasonEnd = { month: p[0], day: p[1] }; break;
      case 0x82: {
        var w = {};
        for (var d = 0; d < 7; d++) {
          var byte = p[d < 4 ? 0 : 1];
          var shift = 6 - 2 * (d % 4);
          w[FLOW_WEEK_DAYS[d]] = ((byte >> shift) & 0x03) + 1;
        }
        data.setWeeklySchedule = w;
        break;
      }
      case 0x83: data.setDailyProfile1 = slots(p); break;
      case 0x84: data.setDailyProfile2 = slots(p); break;
      case 0x85: data.setDailyProfile3 = slots(p); break;
      case 0x86: data.setUplinkPeriodRegulationOn = p[0] * 10; break;
      case 0x87: data.setUplinkPeriodRegulationOff = p[0] * 10; break;
      case 0x8a: data.setTargetTemperature = setpoint(p[0]); break;
      case 0x8b: data.setLowBatteryValvePosition = p[0]; break;
      case 0x8c: data.recalibrateMotor = ""; break;
      case 0x90: data.setBoost = p[0] === 1; break;
      case 0x91: data.setBoostDuration = p[0]; break;
      case 0x93: data.setChildLockOnNetworkLoss = p[0] === 1; break;
      case 0x94: data.setTemperatureHysteresis = p[0] / 10; break;
      case 0x95: data.setSchedules = p[0] === 1; break;
      case 0x97: data.setFuotaMode = p[0] === 1; break;
      case 0x98: data.setValvePositionWhenRegulationOff = p[0]; break;
      case 0x9a: data.setSetpointDisplayOrientation = p[0] === 1 ? "vertical" : "horizontal"; break;
      default: break;
    }
  }

  return { data: data, warnings: warnings, errors: errors };
}

/* -------------------------------------------------------------------------
 * Examples (port 56)
 *
 * {"setChildLock": true}                         --> 55 76 01   (doc, ex. 1)
 * {"setTargetTemperature": 20}                   --> 55 8A 28
 * {"setTargetTemperature": 19.5}                 --> 55 8A 27
 * {"setMinTemperature": 16, "setMaxTemperature": 24}
 *                                                --> 55 77 20 78 30
 * {"setTemperatureOffset": -1.5}                 --> 55 72 23
 * {"setOpenWindowDetection": true, "setOpenWindowDelta": 1.5,
 *  "setOpenWindowPauseDuration": 15}             --> 55 73 01 74 0F 75 0F
 * {"setUplinkPeriodRegulationOn": 30}            --> 55 86 03
 * {"setDelayedNetworkJoin": 1440}                --> 55 1C 00 90
 * {"recalibrateMotor": ""}                       --> 55 8C
 * {"factoryReset": ""}                           --> 55 4B 01
 * {"setTimeZone": 1}                             --> 55 63 0D
 * {"setWeeklySchedule": {"monday":1,"tuesday":1,"wednesday":2,"thursday":1,
 *                        "friday":1,"saturday":3,"sunday":3}}
 *                                                --> 55 82 04 28
 * {"setFuotaMode": true}                         --> 55 97 01
 * {"setSetpointDisplayOrientation": "vertical"}  --> 55 9A 01
 * {"sendCustomHexCommand": "7601"}               --> 55 76 01
 * ---------------------------------------------------------------------- */

if (typeof module !== "undefined") {
  module.exports = { encodeDownlink: encodeDownlink, decodeDownlink: decodeDownlink };
}
