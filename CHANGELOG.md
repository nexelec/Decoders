# Changelog

All notable changes to the Nexelec decoders are recorded here, per product family.

## Versioning and output changes

Each decoder carries its own version in its header (`Version : X.Y.Z`).

| Change | Version bump | Announced |
|---|---|---|
| Bug fix that does not change the name, type or meaning of an output field | patch (`1.0.x`) | in this changelog |
| New output field, new frame type or new frame version | minor (`1.x.0`) | in this changelog |
| **Output field renamed or removed, value or type changed** (e.g. a label replaced, an error code turned into a string) | **major (`x.0.0`)** | in this changelog, **before publication** |

Changes that alter the output of a decoder are marked **⚠ Output change** below. Integrators should read those entries before updating a decoder.

> The entries up to 29/09/2026 below were released under patch versions although some of them change the output; they are flagged so that integrators can check them. From now on, output changes follow the rule above.

---

## A3 — FLOW CORE / FLOW PRO

### Examples — 2026-10-20
- `examples_FLOW.json` replaced by `examples.json` in the LoRa Alliance format (TS013-1.0.0 §6.2.1 "Payload Examples"): each entry is `{ "type": "uplink", "description", "input": { "bytes", "fPort", "recvTime" }, "output" }`, the payload given as a byte array and `output` being the exact `decodeUplink` result. Same 21 frames, no decoder change.
- New downlink examples for `encoderFlow.js` in the same file: 19 `downlink-encode` (`input.data` → `output.bytes`, `fPort`, `warnings`, `errors`) and 10 `downlink-decode` (`input.bytes` → `output.data`), including rounding warnings and error cases. No encoder change.
- `README-Examples_FLOW.md` shows each example as its `examples.json` entry (hex payload kept for convenience); every `output` is the exact codec result, so the file can be run as a test suite.

### `decoderFlow.js` 1.1.0 — 2026-10-08
- New field `bootloaderVersion` in the product status frame, version 1 (bits 108–115). Technical guide D1183C draft of October 2026.
- New field `isFuotaPending` in the product configuration frame, version 3 (bit 200: deferred FUOTA activation scheduled by downlink `0x9B`). Only output when the frame carries it; the first version 3 frames (25 bytes) are decoded as before.
- New examples S4 (status v1) and C4 (configuration v3 with bit 200) in `README-Examples_FLOW.md` / `examples_FLOW.json`.

### `encoderFlow.js` 1.1.0 — 2026-10-08
- New command `0x9B` (`scheduleFuotaMode`): deferred FUOTA mode activation at a Unix epoch UTC date (seconds, or ISO 8601 string), `0` cancels the pending request. Technical guide D1183C draft of October 2026.
- New legacy entry points `Encode(fPort, obj)` (ChirpStack v3, Milesight gateways) and `Encoder(obj, port)` (TTN v2), same signatures as the Milesight codecs. They return the byte array and throw on invalid input. `encodeDownlink` / `decodeDownlink` are unchanged.

### `decoderFlow.js` 1.0.9 — 2026-09-29
- ⚠ **Output change:** error codes are returned as strings instead of raw numbers:
  - temperatures (1023), setpoints (63), motor position and motor stroke (8191), activation time (1023): `"Error"`;
  - battery voltages: `"No battery"` (1021), `"Reserved"` (1022), `"Error"` (1023). These codes were previously returned multiplied by 5 (e.g. `5115`), and 1022 as a 5110 mV reading.
- Fix: configuration version 0, `lowBatteryValveOpeningPercent` is read on bits 91–97 (it was read on the `temperatureModeAbsent` bits).

### `decoderFlow.js` 1.0.8 — 2026-09-29
- ⚠ **Output change:** `typeOfProduct` returns `"FLOW CORE"` for 0xD2 (was `"FLOW"`) and `"FLOW PRO"` for 0xD6 (was `"FLOW+"`).

### `encoderFlow.js` 1.0.0 — 2026-09-29
- New downlink encoder (`encodeDownlink` / `decodeDownlink`) covering the full revision C command set, including `0x97` (FUOTA mode) and `0x9A` (setpoint display orientation).

### Documentation — 2026-09-29
- RX2 default data rate: SF9. MAC commands documented: LinkCheckReq, DeviceTimeReq.
- New `README-Examples_FLOW.md` / `examples_FLOW.json`: example uplinks for every frame type and version.

---

## X2 — FEEL+ / RISE+ / WAVE+ / MOVE+ / SIGN+ / SENSE+ / ATMO+

### `decoderX2.js` 1.0.1 and `decoderX2Milesight.js` 1.0.1 — 2026-09-29
- ⚠ **Output change (fix):** `periodWithoutMotion` is read on 6 bits from bit 155. It was read on bits 154–159, shifted by one bit and including the Presence Alert flag (e.g. 30 min decoded as 15 min, or 47 min with the alert on).
- Fix: `decoderX2.js` no longer starts with a Node-RED test wrapper. Since 2026-04-27 the file failed to load on network servers (`SyntaxError: Illegal return statement`).

### 2025-11-17
- ⚠ **Output change:** output fields renamed (e.g. `productStatus` → `statusProduct`, `activationTime` → `timeActivation`), together with X5.

---

## X4 — VISTA SPACE / FEEL / MOVE / WAVE / RISE

### Examples — 2026-11-13
- New `examples.json` (LoRa Alliance TS013 format) and `README-Examples_VISTA.md`: 22 synthetic uplinks built from `README-Frames_VISTA.md` (guide D1196A), covering every frame type for each product that sends it, sensor error codes and a reserved message type, plus 4 frames captured on a VISTA MOVE (periodic data, presence alert, configuration, status). No decoder change.

### `decoderVista.js` 1.0.0 — 2026-10-23
- First decoder, technical guide D1196A (21/10/2026), port 56: periodic data, CO2 / temperature / humidity historical data, product status, product configuration (one layout per product) and presence alert.
- Output field names follow the FLOW and X2 decoders (`statusProduct`, `timeActivation`, `downlinkFcnt`, `enableFuota`, `isFuotaPending`, `bootloaderVersion`…).
- New documentation `README-General_VISTA.md` and `README-Frames_VISTA.md` (bit-level structure of every frame, downlink command list).

---

## X5 — SIGN / WAVE / MOVE / RISE / FEEL / ECHO / VIEW

### 2025-11-17
- ⚠ **Output change:** output fields renamed (e.g. `AirDrive` → `airDrive`, `hardwareStatus` → `statusProduct`), together with X2.

---

## X8 — AIR+ / AIR

### `decoderAir+.js` 1.0.2 and `BMS/decoderAir+_BMS.js` 1.0.2 — 2026-09-29
- The BMS decoder moves to `BMS/decoderAir+_BMS.js`, with its own documentation `BMS/README-BMS_AIR.md`.
- ⚠ **Output change (standard decoder):** measurement errors return strings again, as in 1.0.0 and in the technical guide (`"Error"`, `"Sensor not present"`).
- ⚠ **Output change (both):** `remainingProductLifetime` uses `"value"` instead of `"Value"`.
- ⚠ **Output change (standard decoder):** `swRevision` label is `"V"` + code × 0.1 for every code (e.g. 25 = `V2.5`).
- ⚠ **Output change (BMS decoder):** temperature above 1000 and humidity above 200 (outside the documented range) are returned as raw codes instead of converted values.
- A payload shorter than 2 bytes returns `"Payload too short"` instead of `"Unknown message type"`.

### `decoderAir+.js` 1.0.1 and `decoderAir+_BMS.js` 1.0.0 — 2026-09-28
- New BMS decoder (one numeric type per field).
- ⚠ **Output change:** measurement errors returned the raw error code as `{"value", "unit"}` (reverted in 1.0.2 for the standard decoder).
- ⚠ **Output change (fix):** `downlinkCounter` was halved by a wrong 1-bit shift; `hushStatus` returned hardware-fault labels.
- Fix: unmapped codes, unknown message types and truncated payloads no longer return `undefined`; frame 0x04 is decoded.

### 2026-09-17
- ⚠ **Output change:** `batteryVoltage`, `batteryResistanceThreshold` and `batteryLowVoltageThreshold` removed from the Product Status frame (the header version stayed 1.0.0); `magnetDetection` added.

---

## X8 — ORIGIN+ / ORIGIN / GUARD+ / GUARD

### `decoderOrigin+.js` 2.0.0 — 2026-11-10
Decoder rewritten on the model of the FLOW and VISTA decoders, technical guide D1035C (05/12/2023). Every field keeps its bit position (checked against 1.0.1 on random frames); only the output format changes.

- ⚠ **Output change:** output fields renamed after the FLOW and VISTA decoders:

  | Frame | 1.0.1 | 2.0.0 |
  |---|---|---|
  | 0x00 | `hwVersion` | `hardwareVersion` |
  | 0x00 | `swVersion` (code × 0.1, e.g. `1.2000000000000002`) | `softwareVersion` (raw code, 12 = V01.2) |
  | 0x00 | `rmgLifetime` | `remainingProductLifetime` |
  | 0x00 | `smokeSensorStatus` | `statusSmokeSensor` |
  | 0x00 | `tempHumSensorStatus` | `statusTemperatureHumiditySensor` |
  | 0x00 | `antiTearDetectionStatus` | `statusAntiTear` |
  | 0x01 | `datalogEnable` | `enableDatalogTemperature` |
  | 0x01 | `dailyAirEnable` | `enableDailyAirQuality` |
  | 0x01 | `nfcStatus` | `enableNfcDiscover` |
  | 0x01 | `datalogMeasure` | `datalogNewValues` |
  | 0x01 | `datalogMeasureRepetition` | `datalogRepeatValues` |
  | 0x01 | `transmissionIntervalDatalog` | `periodDatalogTransmission` |
  | 0x01 | `d2dNetworkID` | `d2dNetworkId` |
  | 0x02 | `smokeLocalProductTest` | `productTest` |
  | 0x02 | `digitalMaintenanceCertificate` | `isMaintenanceDone` (`"false"` / `"true"`) |
  | 0x05 | `datalogNewMeasure` | `newMeasure` |
  | 0x05 | `transmissionIntervalDatalog` (number) | `periodBetweenMeasure` (`{"value", "unit": "minutes"}`) |
  | 0x05 | `datalogMeasureRepetition` | `redundancy` |
  | 0x05 | `temperature` (array) | `temperature` (`{"value": [...], "unit": "°C"}`) |

- ⚠ **Output change:** labels in lower case as in the FLOW and VISTA decoders, typos fixed (e.g. `"Smoke sensor ok"` → `"ok"`, `"Magnetic base detected"` → `"detected"`, `"Partial Succes"` → `"partial success"`, `" No Discoverable"` → `"no discoverable"`, `"Smoke Alarm non-activated"` → `"no smoke detected"`). The full list of values is in `README-Frames_ORIGIN-GUARD.md`.
- ⚠ **Output change:** `typeOfProduct` returns the names of the technical guide: `"ORIGIN+"` (0xBD and 0xB1), `"ORIGIN"`, `"GUARD+"`, `"GUARD"` (was `"Origin+ LoRa/Sigfox"`, `"Origin+ LoRa"`, `"Origin LoRa"`…); an unknown code returns `"Reserved"`. Message type 0x02 is `"Alarm Status"` (was `"Smoke Alarm"`), 0x03 `"Daily Air Quality"` (was `"Air Quality"`).
- ⚠ **Output change:** `batteryVoltage` and `timeSince…` use `"unit"` instead of `"units"`; temperatures are rounded to 0.1 °C (e.g. `21.3` instead of `21.300000000000004`).
- ⚠ **Output change:** temperature 1022 returns `"Sensor not present"`, as in the guide (was `"Deconnected Sensor"`). In historical data, a measure at 1023 returns `"Error"` (was `0`).
- ⚠ **Output change:** `loraRegion` removed from the product configuration: bits 27–30 are reserved in the guide.
- New field `downlinkFcnt` in the product configuration (bits 72–87), output when the frame is 11 bytes long.
- A payload shorter than 2 bytes, an unknown message type or a truncated frame returns `errors` (LoRa Alliance TS013) instead of a partial or `undefined` result; a truncated historical frame returns the measures present and a `warning`.
- Fix: the decoder failed in strict mode (implicit globals `outputTypeMessage` and `offset_binaire`), so it did not load on ChirpStack v4. Only the frame matching the message type is decoded.
- New legacy entry points `Decode(fPort, bytes, variables)` (ChirpStack v3) and `Decoder(bytes, port)` (TTN v2).
- New `examples.json` (LoRa Alliance TS013 format) and `README-Examples_ORIGIN-GUARD.md`: 19 examples covering every frame and the error cases. `README-Frames_ORIGIN-GUARD.md` aligned on the guide (reserved bits, error codes, Downlink FCnt) with the decoder field of each value.

---

## All families

### 2026-09-28
- MIT `LICENSE` added in each product family folder.
