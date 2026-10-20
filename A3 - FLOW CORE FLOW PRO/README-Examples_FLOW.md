# FLOW CORE / FLOW PRO — Payload Examples

Examples for the codec of FLOW CORE / FLOW PRO, in the format of the LoRa Alliance *Payload Codec API* specification (TS013-1.0.0, §6.2.1 "Payload Examples"):

- **uplink**: frames decoded by `decodeUplink` (`decoderFlow.js` **1.1.0**), every frame type and version;
- **downlink-encode**: commands encoded by `encodeDownlink` (`encoderFlow.js` **1.1.0**);
- **downlink-decode**: downlink frames read back by `decodeDownlink` (`encoderFlow.js` **1.1.0**).

> **Synthetic frames.** The uplink payloads are built bit by bit from the layout of [README-Frames_FLOW.md](README-Frames_FLOW.md) with realistic values, then decoded with `decoderFlow.js`. They are meant to validate a decoder integration; they are not captures from devices in the field.

All frames use **FPort 56**. The machine-readable list is [`examples.json`](examples.json); each example below is the corresponding entry of that file, and `output` is always the exact object returned by the codec function, so the file can be run as a test suite (TS013, Appendix 2 B).

| Property | uplink / downlink-decode | downlink-encode |
|----------|--------------------------|-----------------|
| `type` | `"uplink"` or `"downlink-decode"` | `"downlink-encode"` |
| `description` | Example ID and scenario | Example ID and scenario |
| `input` | `bytes` (payload as an array of numbers), `fPort`, `recvTime` (ISO 8601, not used by the codec) | `data`: the commands to encode |
| `output` | `data` (decoded object), plus `errors` / `warnings` for `decodeDownlink` | `bytes`, `fPort`, `errors`, `warnings` (on error, `bytes` is empty) |

## Summary — uplink

| ID | Frame | Version | Product | Payload (hex) | Scenario |
|----|-------|---------|---------|---------------|----------|
| P1 | 0x01 | 1 | FLOW CORE | `D211806A2032992464` | FLOW CORE, comfort mode on schedule, 21.3 °C for a 21 °C setpoint |
| P2 | 0x01 | 1 | FLOW PRO | `D6117CA65F844B0246` | FLOW PRO, regulating on a NODE One probe, eco mode, setpoint changed with the wheel |
| P3 | 0x01 | 1 | FLOW CORE | `D21173AA1CC200000E` | FLOW CORE, open window detected (regulation paused, valve closed) |
| P4 | 0x01 | 1 | FLOW PRO | `D611796A1E59450C8C` | FLOW PRO, BOOST triggered by downlink (valve fully open) |
| P5 | 0x01 | 1 | FLOW CORE | `D2117AE71EBA834382` | FLOW CORE, clock not set: degraded mode, setpoint forced to 19.5 °C |
| P6 | 0x01 | 1 | FLOW CORE | `D211FFE83FF0000000` | FLOW CORE, temperature sensor error (1023), regulation off |
| P7 | 0x01 | 0 | FLOW CORE | `D2107D681F522EE150` | FLOW CORE, older firmware, normal regulation |
| P8 | 0x01 | 0 | FLOW PRO | `D61071AA1C63000000` | FLOW PRO, older firmware, open window flag set |
| S1 | 0x02 | 0 | FLOW CORE | `D220030C9DA7408A8C00E0BECBD0` | FLOW CORE, batteries OK, head on its base, calibrated, NODE One paired |
| S2 | 0x02 | 0 | FLOW PRO | `D620030C93A4C93A8C01C0E001A0` | FLOW PRO, low battery, head just removed from its base (calibration cleared) |
| S3 | 0x02 | 0 | FLOW CORE | `D220030C9C3FD08A8C00402A7380` | FLOW CORE, no battery in slot 2 (1021) |
| S4 | 0x02 | 1 | FLOW CORE | `D221030C9DA7408A8C00E0BECBD0A0` | FLOW CORE, status version 1 with the bootloader version (10) |
| N1 | 0x03 | 0 | FLOW CORE | `D23001E24044B11C9C` | FLOW CORE with a paired NODE One probe, good radio link |
| C0 | 0x04 | 0 | FLOW CORE | `D24041062F693AA79955140C85A0000D053D00140000` | FLOW CORE, older firmware, sent at start-up |
| C1 | 0x04 | 1 | FLOW PRO | `D64121062F693AA79905AA28190B40001A0A7A00280072` | FLOW PRO, after an application downlink (FCnt 57) |
| C2 | 0x04 | 2 | FLOW CORE | `D242A1062F693AA79905AA28190B40001A0A7A002800013C00` | FLOW CORE, weekly periodic resend, BOOST 30 min |
| C3 | 0x04 | 3 | FLOW PRO | `D64341062F693AA79905AA28190B40001A0A7A002800013C01` | FLOW PRO, start-up, vertical setpoint display, FUOTA off |
| C4 | 0x04 | 3 | FLOW PRO | `D64321062F693AA79905AA28190B40001A0A7A002800013C0180` | FLOW PRO, after downlink 0x9B: deferred FUOTA activation pending |
| D1 | 0x05 | 0 | FLOW CORE | `D25045555554AB555555552AAAAB50` | weekday: comfort 06:30-08:30 and 17:00-22:30, eco otherwise |
| D2 | 0x06 | 0 | FLOW CORE | `D2604555555552AAAAAAAAAAAAAAD0` | weekend: comfort 08:00-23:00, eco otherwise |
| D3 | 0x07 | 0 | FLOW CORE | `D27027FFFFFFFFFFFFFFFFFFFFFFF8` | extended absence all day |

## Summary — downlink

| ID | Type | Payload (hex) | Scenario |
|----|------|---------------|----------|
| DE1 | downlink-encode | `55 76 01` | Child lock on |
| DE2 | downlink-encode | `55 8A 27` | Manual setpoint 19.5 °C |
| DE3 | downlink-encode | `55 77 20 78 30` | Setpoint limits 16-24 °C |
| DE4 | downlink-encode | `55 73 01 74 0F 75 0F` | Open window detection on, delta 1.5 °C, pause 15 min |
| DE5 | downlink-encode | `55 72 23` | Temperature offset -1.5 °C |
| DE6 | downlink-encode | `55 01 63 0D 86 03` | Commands given in any order are sent in ascending ID order (period 30 min, UTC+1, configuration request) |
| DE7 | downlink-encode | `55 7F 01 80 0A 0F 81 04 0F` | Heating season on, from October 15 to April 15 |
| DE8 | downlink-encode | `55 82 04 28` | Weekly schedule: profile 1 on weekdays except Wednesday (profile 2), profile 3 on weekends |
| DE9 | downlink-encode | `55 83 AA AA AA 95 6A AA AA AA A5 55 55 6A` | Daily profile 1: comfort 06:30-08:30 and 17:00-22:30, eco otherwise |
| DE10 | downlink-encode | `55 90 01 91 1E` | BOOST for 30 min |
| DE11 | downlink-encode | `55 1C 00 90` | Delayed network join in 24 h (1440 min) |
| DE12 | downlink-encode | `55 8C` | Motor recalibration |
| DE13 | downlink-encode | `55 9A 01` | Vertical setpoint display |
| DE14 | downlink-encode | `55 76 01` | Raw command (escape hatch): child lock on |
| DE15 | downlink-encode | `55 8A 29` | Warning: setpoint 20.3 °C rounded to the 0.5 °C step (20.5 °C) |
| DE16 | downlink-encode | — | Error: setpoint out of range (35 °C, max 31 °C) |
| DE17 | downlink-encode | — | Error: unknown command |
| DE18 | downlink-encode | — | Error: no command |
| DD1 | downlink-decode | `55 76 01` | Child lock on |
| DD2 | downlink-decode | `55 01 63 0D 86 03` | Configuration request, UTC+1, period 30 min |
| DD3 | downlink-decode | `55 7F 01 80 0A 0F 81 04 0F` | Heating season on, from October 15 to April 15 |
| DD4 | downlink-decode | `55 82 04 28` | Weekly schedule |
| DD5 | downlink-decode | `55 83 AA AA AA 95 6A AA AA AA A5 55 55 6A` | Daily profile 1: comfort 06:30-08:30 and 17:00-22:30, eco otherwise |
| DD6 | downlink-decode | `55 4B 01` | Factory reset |
| DD7 | downlink-decode | `56 76 01` | Error: bad header (0x56 instead of 0x55) |
| DD8 | downlink-decode | `55 76 01 FF 01` | Error: unknown command ID 0xFF |
| DD9 | downlink-decode | `55 80 0A` | Error: truncated command (0x80 needs 2 bytes) |

---

# Uplink (`decodeUplink`)

## Frame 0x01 — Periodic Data

### P1 — Periodic v1 — FLOW CORE, comfort mode on schedule, 21.3 °C for a 21 °C setpoint

Payload (hex): `D211806A2032992464`

```json
{
  "type": "uplink",
  "description": "P1 — Periodic v1 — FLOW CORE, comfort mode on schedule, 21.3 °C for a 21 °C setpoint",
  "input": {
    "bytes": [210, 17, 128, 106, 32, 50, 153, 36, 100],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "FLOW CORE",
      "typeOfMessage": "Periodic",
      "versionOfMessage": 1,
      "temperature": {
        "value": 21.3,
        "unit": "°C"
      },
      "regulationTemperature": {
        "value": 21,
        "unit": "°C"
      },
      "sourceRegulationTemperature": "internal",
      "internalTemperature": {
        "value": 21.5,
        "unit": "°C"
      },
      "sourceTemperatureSetPointChange": "planning",
      "motorDistance": {
        "value": 2450,
        "unit": "µm"
      },
      "valveOpeningPercentage": {
        "value": 35,
        "unit": "%"
      },
      "regulationMode": "confort"
    }
  }
}
```

### P2 — Periodic v1 — FLOW PRO, regulating on a NODE One probe, eco mode, setpoint changed with the wheel

Payload (hex): `D6117CA65F844B0246`

```json
{
  "type": "uplink",
  "description": "P2 — Periodic v1 — FLOW PRO, regulating on a NODE One probe, eco mode, setpoint changed with the wheel",
  "input": {
    "bytes": [214, 17, 124, 166, 95, 132, 75, 2, 70],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "FLOW PRO",
      "typeOfMessage": "Periodic",
      "versionOfMessage": 1,
      "temperature": {
        "value": 19.8,
        "unit": "°C"
      },
      "regulationTemperature": {
        "value": 19,
        "unit": "°C"
      },
      "sourceRegulationTemperature": "external node",
      "internalTemperature": {
        "value": 20.4,
        "unit": "°C"
      },
      "sourceTemperatureSetPointChange": "scroll wheel",
      "motorDistance": {
        "value": 1200,
        "unit": "µm"
      },
      "valveOpeningPercentage": {
        "value": 18,
        "unit": "%"
      },
      "regulationMode": "eco"
    }
  }
}
```

### P3 — Periodic v1 — FLOW CORE, open window detected (regulation paused, valve closed)

Payload (hex): `D21173AA1CC200000E`

```json
{
  "type": "uplink",
  "description": "P3 — Periodic v1 — FLOW CORE, open window detected (regulation paused, valve closed)",
  "input": {
    "bytes": [210, 17, 115, 170, 28, 194, 0, 0, 14],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "FLOW CORE",
      "typeOfMessage": "Periodic",
      "versionOfMessage": 1,
      "temperature": {
        "value": 16.2,
        "unit": "°C"
      },
      "regulationTemperature": {
        "value": 21,
        "unit": "°C"
      },
      "sourceRegulationTemperature": "internal",
      "internalTemperature": {
        "value": 16,
        "unit": "°C"
      },
      "sourceTemperatureSetPointChange": "planning",
      "motorDistance": {
        "value": 0,
        "unit": "µm"
      },
      "valveOpeningPercentage": {
        "value": 0,
        "unit": "%"
      },
      "regulationMode": "open window"
    }
  }
}
```

### P4 — Periodic v1 — FLOW PRO, BOOST triggered by downlink (valve fully open)

Payload (hex): `D611796A1E59450C8C`

```json
{
  "type": "uplink",
  "description": "P4 — Periodic v1 — FLOW PRO, BOOST triggered by downlink (valve fully open)",
  "input": {
    "bytes": [214, 17, 121, 106, 30, 89, 69, 12, 140],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "FLOW PRO",
      "typeOfMessage": "Periodic",
      "versionOfMessage": 1,
      "temperature": {
        "value": 18.5,
        "unit": "°C"
      },
      "regulationTemperature": {
        "value": 21,
        "unit": "°C"
      },
      "sourceRegulationTemperature": "internal",
      "internalTemperature": {
        "value": 18.5,
        "unit": "°C"
      },
      "sourceTemperatureSetPointChange": "downlink",
      "motorDistance": {
        "value": 5200,
        "unit": "µm"
      },
      "valveOpeningPercentage": {
        "value": 100,
        "unit": "%"
      },
      "regulationMode": "boost"
    }
  }
}
```

### P5 — Periodic v1 — FLOW CORE, clock not set: degraded mode, setpoint forced to 19.5 °C

Payload (hex): `D2117AE71EBA834382`

```json
{
  "type": "uplink",
  "description": "P5 — Periodic v1 — FLOW CORE, clock not set: degraded mode, setpoint forced to 19.5 °C",
  "input": {
    "bytes": [210, 17, 122, 231, 30, 186, 131, 67, 130],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "FLOW CORE",
      "typeOfMessage": "Periodic",
      "versionOfMessage": 1,
      "temperature": {
        "value": 19.1,
        "unit": "°C"
      },
      "regulationTemperature": {
        "value": 19.5,
        "unit": "°C"
      },
      "sourceRegulationTemperature": "internal",
      "internalTemperature": {
        "value": 19.1,
        "unit": "°C"
      },
      "sourceTemperatureSetPointChange": "product time not up to date, degraded mode",
      "motorDistance": {
        "value": 2100,
        "unit": "µm"
      },
      "valveOpeningPercentage": {
        "value": 28,
        "unit": "%"
      },
      "regulationMode": "regulation on"
    }
  }
}
```

### P6 — Periodic v1 — FLOW CORE, temperature sensor error (1023), regulation off

Payload (hex): `D211FFE83FF0000000`

```json
{
  "type": "uplink",
  "description": "P6 — Periodic v1 — FLOW CORE, temperature sensor error (1023), regulation off",
  "input": {
    "bytes": [210, 17, 255, 232, 63, 240, 0, 0, 0],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "FLOW CORE",
      "typeOfMessage": "Periodic",
      "versionOfMessage": 1,
      "temperature": "Error",
      "regulationTemperature": {
        "value": 20,
        "unit": "°C"
      },
      "sourceRegulationTemperature": "internal",
      "internalTemperature": "Error",
      "sourceTemperatureSetPointChange": "none",
      "motorDistance": {
        "value": 0,
        "unit": "µm"
      },
      "valveOpeningPercentage": {
        "value": 0,
        "unit": "%"
      },
      "regulationMode": "regulation off"
    }
  }
}
```

### P7 — Periodic v0 — FLOW CORE, older firmware, normal regulation

Payload (hex): `D2107D681F522EE150`

```json
{
  "type": "uplink",
  "description": "P7 — Periodic v0 — FLOW CORE, older firmware, normal regulation",
  "input": {
    "bytes": [210, 16, 125, 104, 31, 82, 46, 225, 80],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "FLOW CORE",
      "typeOfMessage": "Periodic",
      "versionOfMessage": 0,
      "temperature": {
        "value": 20.1,
        "unit": "°C"
      },
      "regulationTemperature": {
        "value": 20,
        "unit": "°C"
      },
      "sourceRegulationTemperature": "internal",
      "internalTemperature": {
        "value": 20.1,
        "unit": "°C"
      },
      "sourceTemperatureSetPointChange": "planning",
      "isWindowOpenActive": "false",
      "isFrostProtectActive": "false",
      "motorDistance": {
        "value": 3000,
        "unit": "µm"
      },
      "valveOpeningPercentage": {
        "value": 42,
        "unit": "%"
      }
    }
  }
}
```

### P8 — Periodic v0 — FLOW PRO, older firmware, open window flag set

Payload (hex): `D61071AA1C63000000`

```json
{
  "type": "uplink",
  "description": "P8 — Periodic v0 — FLOW PRO, older firmware, open window flag set",
  "input": {
    "bytes": [214, 16, 113, 170, 28, 99, 0, 0, 0],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "FLOW PRO",
      "typeOfMessage": "Periodic",
      "versionOfMessage": 0,
      "temperature": {
        "value": 15.4,
        "unit": "°C"
      },
      "regulationTemperature": {
        "value": 21,
        "unit": "°C"
      },
      "sourceRegulationTemperature": "internal",
      "internalTemperature": {
        "value": 15.4,
        "unit": "°C"
      },
      "sourceTemperatureSetPointChange": "planning",
      "isWindowOpenActive": "true",
      "isFrostProtectActive": "false",
      "motorDistance": {
        "value": 0,
        "unit": "µm"
      },
      "valveOpeningPercentage": {
        "value": 0,
        "unit": "%"
      }
    }
  }
}
```

## Frame 0x02 — Product Status

### S1 — Product status — FLOW CORE, batteries OK, head on its base, calibrated, NODE One paired

Payload (hex): `D220030C9DA7408A8C00E0BECBD0`

```json
{
  "type": "uplink",
  "description": "S1 — Product status — FLOW CORE, batteries OK, head on its base, calibrated, NODE One paired",
  "input": {
    "bytes": [210, 32, 3, 12, 157, 167, 64, 138, 140, 0, 224, 190, 203, 208],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "FLOW CORE",
      "typeOfMessage": "Product Status",
      "versionOfMessage": 0,
      "hardwareVersion": 3,
      "softwareVersion": 12,
      "batteryVoltageSlot1": {
        "value": 3150,
        "unit": "mV"
      },
      "batteryVoltageSlot2": {
        "value": 3140,
        "unit": "mV"
      },
      "batteryLevel": "high",
      "statusProduct": "ok",
      "statusAntiTear": "detected",
      "statusMotorCalibration": "calibration done",
      "motorStrokeDistance": {
        "value": 5400,
        "unit": "µm"
      },
      "timeActivation": {
        "value": 7,
        "unit": "month"
      },
      "productDate": "29/09/2026 08:30",
      "isD2Dactive": 1
    }
  }
}
```

### S2 — Product status — FLOW PRO, low battery, head just removed from its base (calibration cleared)

Payload (hex): `D620030C93A4C93A8C01C0E001A0`

```json
{
  "type": "uplink",
  "description": "S2 — Product status — FLOW PRO, low battery, head just removed from its base (calibration cleared)",
  "input": {
    "bytes": [214, 32, 3, 12, 147, 164, 201, 58, 140, 1, 192, 224, 1, 160],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "FLOW PRO",
      "typeOfMessage": "Product Status",
      "versionOfMessage": 0,
      "hardwareVersion": 3,
      "softwareVersion": 12,
      "batteryVoltageSlot1": {
        "value": 2950,
        "unit": "mV"
      },
      "batteryVoltageSlot2": {
        "value": 2940,
        "unit": "mV"
      },
      "batteryLevel": "low",
      "statusProduct": "ok",
      "statusAntiTear": "just removed from the base",
      "statusMotorCalibration": "calibration erase, product remove from the base",
      "motorStrokeDistance": {
        "value": 5400,
        "unit": "µm"
      },
      "timeActivation": {
        "value": 14,
        "unit": "month"
      },
      "productDate": "15/11/2026 14:05",
      "isD2Dactive": 0
    }
  }
}
```

### S3 — Product status — FLOW CORE, no battery in slot 2 (1021)

Payload (hex): `D220030C9C3FD08A8C00402A7380`

```json
{
  "type": "uplink",
  "description": "S3 — Product status — FLOW CORE, no battery in slot 2 (1021)",
  "input": {
    "bytes": [210, 32, 3, 12, 156, 63, 208, 138, 140, 0, 64, 42, 115, 128],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "FLOW CORE",
      "typeOfMessage": "Product Status",
      "versionOfMessage": 0,
      "hardwareVersion": 3,
      "softwareVersion": 12,
      "batteryVoltageSlot1": {
        "value": 3120,
        "unit": "mV"
      },
      "batteryVoltageSlot2": "No battery",
      "batteryLevel": "high",
      "statusProduct": "ok",
      "statusAntiTear": "detected",
      "statusMotorCalibration": "calibration done",
      "motorStrokeDistance": {
        "value": 5400,
        "unit": "µm"
      },
      "timeActivation": {
        "value": 2,
        "unit": "month"
      },
      "productDate": "02/03/2026 09:00",
      "isD2Dactive": 0
    }
  }
}
```

### S4 — Product status — FLOW CORE, status version 1 with the bootloader version (10)

Payload (hex): `D221030C9DA7408A8C00E0BECBD0A0`

```json
{
  "type": "uplink",
  "description": "S4 — Product status — FLOW CORE, status version 1 with the bootloader version (10)",
  "input": {
    "bytes": [210, 33, 3, 12, 157, 167, 64, 138, 140, 0, 224, 190, 203, 208, 160],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "FLOW CORE",
      "typeOfMessage": "Product Status",
      "versionOfMessage": 1,
      "hardwareVersion": 3,
      "softwareVersion": 12,
      "batteryVoltageSlot1": {
        "value": 3150,
        "unit": "mV"
      },
      "batteryVoltageSlot2": {
        "value": 3140,
        "unit": "mV"
      },
      "batteryLevel": "high",
      "statusProduct": "ok",
      "statusAntiTear": "detected",
      "statusMotorCalibration": "calibration done",
      "motorStrokeDistance": {
        "value": 5400,
        "unit": "µm"
      },
      "timeActivation": {
        "value": 7,
        "unit": "month"
      },
      "productDate": "29/09/2026 08:30",
      "isD2Dactive": 1,
      "bootloaderVersion": 10
    }
  }
}
```

## Frame 0x03 — NODE One Status

### N1 — NODE One status — FLOW CORE with a paired NODE One probe, good radio link

Payload (hex): `D23001E24044B11C9C`

```json
{
  "type": "uplink",
  "description": "N1 — NODE One status — FLOW CORE with a paired NODE One probe, good radio link",
  "input": {
    "bytes": [210, 48, 1, 226, 64, 68, 177, 28, 156],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "FLOW CORE",
      "typeOfMessage": "External Probe Status",
      "versionOfMessage": 0,
      "euiExternalProbe": 123456,
      "statusExternalProbeAntiTear": "detected",
      "statusExternalProbeTemperature": "ok",
      "statusExternalProbeBatteryLevel": "high",
      "statusExternalProbeBatteryVoltage": {
        "value": 3000,
        "unit": "mV"
      },
      "ExternalProbeMessageReceived": 142,
      "ExternalProbeNetworkLevel": {
        "value": -78,
        "unit": "dBm"
      }
    }
  }
}
```

## Frame 0x04 — Product Configuration

### C0 — Configuration v0 — FLOW CORE, older firmware, sent at start-up

Payload (hex): `D24041062F693AA79955140C85A0000D053D00140000`

```json
{
  "type": "uplink",
  "description": "C0 — Configuration v0 — FLOW CORE, older firmware, sent at start-up",
  "input": {
    "bytes": [210, 64, 65, 6, 47, 105, 58, 167, 153, 85, 20, 12, 133, 160, 0, 13, 5, 61, 0, 20, 0, 0],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "FLOW CORE",
      "typeOfMessage": "Product Configuration",
      "versionOfMessage": 0,
      "sourceReconfiguration": "start-up",
      "statusReconfiguration": "total success",
      "periodPeriodicTransmissionRegulationOn": {
        "value": 10,
        "unit": "min"
      },
      "periodPeriodicTransmissionRegulationOff": {
        "value": 60,
        "unit": "min"
      },
      "enableChildLock": "off",
      "childLockOfflineBehavior": "unchanged when offline",
      "enableRegulation": "on",
      "minimumRegulationTemperature": {
        "value": 15,
        "unit": "°C"
      },
      "maximumRegulationTemperature": {
        "value": 26,
        "unit": "°C"
      },
      "enableFrostProtect": "on",
      "frostProtectActivationThreshold": {
        "value": 7,
        "unit": "°C"
      },
      "enableOpenWindowDetection": "on",
      "openWindowDetectionTemperatureDrop": {
        "value": 1,
        "unit": "°C/min"
      },
      "openWindowDetectionPauseDuration": 30,
      "temperatureInternalOffset": {
        "value": 0,
        "unit": "°C"
      },
      "temperatureModeConfort": {
        "value": 21,
        "unit": "°C"
      },
      "temperatureModeEco": {
        "value": 17,
        "unit": "°C"
      },
      "temperatureModeAbsent": {
        "value": 16,
        "unit": "°C"
      },
      "lowBatteryValveOpeningPercent": {
        "value": 50,
        "unit": "%"
      },
      "protocolAndRegion": "LR-EU868",
      "timeZone": "UTC +1",
      "isJoinPending": "false",
      "enableNfcDiscover": "on",
      "kp": 0,
      "ki": 0,
      "enableHeatingPeriod": "on",
      "heatingStartMonth": 10,
      "heatingStartDay": 1,
      "heatingEndMonth": 4,
      "heatingEndDay": 30,
      "enablePlanningMode": "on",
      "dailyPlanning": {
        "monday": "profil 1",
        "tuesday": "profil 1",
        "wednesday": "profil 1",
        "thursday": "profil 1",
        "friday": "profil 1",
        "saturday": "profil 2",
        "sunday": "profil 2"
      },
      "downlinkFcnt": 0
    }
  }
}
```

### C1 — Configuration v1 — FLOW PRO, after an application downlink (FCnt 57)

Payload (hex): `D64121062F693AA79905AA28190B40001A0A7A00280072`

```json
{
  "type": "uplink",
  "description": "C1 — Configuration v1 — FLOW PRO, after an application downlink (FCnt 57)",
  "input": {
    "bytes": [214, 65, 33, 6, 47, 105, 58, 167, 153, 5, 170, 40, 25, 11, 64, 0, 26, 10, 122, 0, 40, 0, 114],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "FLOW PRO",
      "typeOfMessage": "Product Configuration",
      "versionOfMessage": 1,
      "sourceReconfiguration": "downlink",
      "statusReconfiguration": "total success",
      "periodPeriodicTransmissionRegulationOn": {
        "value": 10,
        "unit": "min"
      },
      "periodPeriodicTransmissionRegulationOff": {
        "value": 60,
        "unit": "min"
      },
      "enableChildLock": "off",
      "childLockOfflineBehavior": "unchanged when offline",
      "enableRegulation": "on",
      "minimumRegulationTemperature": {
        "value": 15,
        "unit": "°C"
      },
      "maximumRegulationTemperature": {
        "value": 26,
        "unit": "°C"
      },
      "enableFrostProtect": "on",
      "frostProtectActivationThreshold": {
        "value": 7,
        "unit": "°C"
      },
      "enableOpenWindowDetection": "on",
      "openWindowDetectionTemperatureDrop": {
        "value": 1,
        "unit": "°C/min"
      },
      "openWindowDetectionPauseDuration": 30,
      "temperatureInternalOffset": {
        "value": 0,
        "unit": "°C"
      },
      "regulationTolerance": {
        "value": 0.5,
        "unit": "°C/min"
      },
      "temperatureModeConfort": {
        "value": 21,
        "unit": "°C"
      },
      "temperatureModeEco": {
        "value": 17,
        "unit": "°C"
      },
      "temperatureModeAbsent": {
        "value": 16,
        "unit": "°C"
      },
      "lowBatteryValveOpeningPercent": {
        "value": 50,
        "unit": "%"
      },
      "protocolAndRegion": "LR-EU868",
      "timeZone": "UTC +1",
      "isJoinPending": "false",
      "enableNfcDiscover": "off",
      "kp": 0,
      "ki": 0,
      "enableHeatingPeriod": "on",
      "heatingStartMonth": 10,
      "heatingStartDay": 0,
      "heatingEndMonth": 4,
      "heatingEndDay": 30,
      "enablePlanningMode": "on",
      "dailyPlanning": {
        "monday": "profil 2",
        "tuesday": "profil 1",
        "wednesday": "profil 1",
        "thursday": "profil 1",
        "friday": "profil 1",
        "saturday": "profil 2",
        "sunday": "profil 2"
      },
      "downlinkFcnt": 57
    }
  }
}
```

### C2 — Configuration v2 — FLOW CORE, weekly periodic resend, BOOST 30 min

Payload (hex): `D242A1062F693AA79905AA28190B40001A0A7A002800013C00`

```json
{
  "type": "uplink",
  "description": "C2 — Configuration v2 — FLOW CORE, weekly periodic resend, BOOST 30 min",
  "input": {
    "bytes": [210, 66, 161, 6, 47, 105, 58, 167, 153, 5, 170, 40, 25, 11, 64, 0, 26, 10, 122, 0, 40, 0, 1, 60, 0],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "FLOW CORE",
      "typeOfMessage": "Product Configuration",
      "versionOfMessage": 2,
      "sourceReconfiguration": "local",
      "statusReconfiguration": "total success",
      "periodPeriodicTransmissionRegulationOn": {
        "value": 10,
        "unit": "min"
      },
      "periodPeriodicTransmissionRegulationOff": {
        "value": 60,
        "unit": "min"
      },
      "enableChildLock": "off",
      "childLockOfflineBehavior": "unchanged when offline",
      "enableRegulation": "on",
      "minimumRegulationTemperature": {
        "value": 15,
        "unit": "°C"
      },
      "maximumRegulationTemperature": {
        "value": 26,
        "unit": "°C"
      },
      "enableFrostProtect": "on",
      "frostProtectActivationThreshold": {
        "value": 7,
        "unit": "°C"
      },
      "enableOpenWindowDetection": "on",
      "openWindowDetectionTemperatureDrop": {
        "value": 1,
        "unit": "°C/min"
      },
      "openWindowDetectionPauseDuration": {
        "value": 30,
        "unit": "min"
      },
      "temperatureInternalOffset": {
        "value": 0,
        "unit": "°C"
      },
      "regulationTolerance": {
        "value": 0.5,
        "unit": "°C/min"
      },
      "temperatureModeConfort": {
        "value": 21,
        "unit": "°C"
      },
      "temperatureModeEco": {
        "value": 17,
        "unit": "°C"
      },
      "temperatureModeAbsent": {
        "value": 16,
        "unit": "°C"
      },
      "lowBatteryValveOpeningPercent": {
        "value": 50,
        "unit": "%"
      },
      "protocolAndRegion": "LR-EU868",
      "timeZone": "UTC +1",
      "isJoinPending": "false",
      "enableNfcDiscover": "off",
      "kp": 0,
      "ki": 0,
      "enableHeatingPeriod": "on",
      "heatingStartMonth": {
        "value": 10,
        "unit": "month"
      },
      "heatingStartDay": {
        "value": 1,
        "unit": "day"
      },
      "heatingEndMonth": {
        "value": 4,
        "unit": "month"
      },
      "heatingEndDay": {
        "value": 30,
        "unit": "day"
      },
      "enablePlanningMode": "on",
      "dailyPlanning": {
        "monday": "profil 1",
        "tuesday": "profil 1",
        "wednesday": "profil 1",
        "thursday": "profil 1",
        "friday": "profil 1",
        "saturday": "profil 2",
        "sunday": "profil 2"
      },
      "downlinkFcnt": 0,
      "enableBoost": "on",
      "boostActivationDuration": {
        "value": 30,
        "unit": "min"
      },
      "valveOpeningPercentControlDisabled": {
        "value": 0,
        "unit": "%"
      }
    }
  }
}
```

### C3 — Configuration v3 — FLOW PRO, start-up, vertical setpoint display, FUOTA off

Payload (hex): `D64341062F693AA79905AA28190B40001A0A7A002800013C01`

```json
{
  "type": "uplink",
  "description": "C3 — Configuration v3 — FLOW PRO, start-up, vertical setpoint display, FUOTA off",
  "input": {
    "bytes": [214, 67, 65, 6, 47, 105, 58, 167, 153, 5, 170, 40, 25, 11, 64, 0, 26, 10, 122, 0, 40, 0, 1, 60, 1],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "FLOW PRO",
      "typeOfMessage": "Product Configuration",
      "versionOfMessage": 3,
      "sourceReconfiguration": "start-up",
      "statusReconfiguration": "total success",
      "periodPeriodicTransmissionRegulationOn": {
        "value": 10,
        "unit": "min"
      },
      "periodPeriodicTransmissionRegulationOff": {
        "value": 60,
        "unit": "min"
      },
      "enableChildLock": "off",
      "childLockOfflineBehavior": "unchanged when offline",
      "enableRegulation": "on",
      "minimumRegulationTemperature": {
        "value": 15,
        "unit": "°C"
      },
      "maximumRegulationTemperature": {
        "value": 26,
        "unit": "°C"
      },
      "enableFrostProtect": "on",
      "frostProtectActivationThreshold": {
        "value": 7,
        "unit": "°C"
      },
      "enableOpenWindowDetection": "on",
      "openWindowDetectionTemperatureDrop": {
        "value": 1,
        "unit": "°C/min"
      },
      "openWindowDetectionPauseDuration": {
        "value": 30,
        "unit": "min"
      },
      "temperatureInternalOffset": {
        "value": 0,
        "unit": "°C"
      },
      "regulationTolerance": {
        "value": 0.5,
        "unit": "°C/min"
      },
      "temperatureModeConfort": {
        "value": 21,
        "unit": "°C"
      },
      "temperatureModeEco": {
        "value": 17,
        "unit": "°C"
      },
      "temperatureModeAbsent": {
        "value": 16,
        "unit": "°C"
      },
      "lowBatteryValveOpeningPercent": {
        "value": 50,
        "unit": "%"
      },
      "protocolAndRegion": "LR-EU868",
      "timeZone": "UTC +1",
      "isJoinPending": "false",
      "enableNfcDiscover": "off",
      "kp": 0,
      "ki": 0,
      "enableHeatingPeriod": "on",
      "heatingStartMonth": {
        "value": 10,
        "unit": "month"
      },
      "heatingStartDay": {
        "value": 1,
        "unit": "day"
      },
      "heatingEndMonth": {
        "value": 4,
        "unit": "month"
      },
      "heatingEndDay": {
        "value": 30,
        "unit": "day"
      },
      "enablePlanningMode": "on",
      "dailyPlanning": {
        "monday": "profil 1",
        "tuesday": "profil 1",
        "wednesday": "profil 1",
        "thursday": "profil 1",
        "friday": "profil 1",
        "saturday": "profil 2",
        "sunday": "profil 2"
      },
      "downlinkFcnt": 0,
      "enableBoost": "on",
      "boostActivationDuration": {
        "value": 30,
        "unit": "min"
      },
      "valveOpeningPercentControlDisabled": {
        "value": 0,
        "unit": "%"
      },
      "enableFuota": "off",
      "setpointDisplayOrientation": "vertical"
    }
  }
}
```

### C4 — Configuration v3 — FLOW PRO, after downlink 0x9B: deferred FUOTA activation pending

Payload (hex): `D64321062F693AA79905AA28190B40001A0A7A002800013C0180`

```json
{
  "type": "uplink",
  "description": "C4 — Configuration v3 — FLOW PRO, after downlink 0x9B: deferred FUOTA activation pending",
  "input": {
    "bytes": [214, 67, 33, 6, 47, 105, 58, 167, 153, 5, 170, 40, 25, 11, 64, 0, 26, 10, 122, 0, 40, 0, 1, 60, 1, 128],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "FLOW PRO",
      "typeOfMessage": "Product Configuration",
      "versionOfMessage": 3,
      "sourceReconfiguration": "downlink",
      "statusReconfiguration": "total success",
      "periodPeriodicTransmissionRegulationOn": {
        "value": 10,
        "unit": "min"
      },
      "periodPeriodicTransmissionRegulationOff": {
        "value": 60,
        "unit": "min"
      },
      "enableChildLock": "off",
      "childLockOfflineBehavior": "unchanged when offline",
      "enableRegulation": "on",
      "minimumRegulationTemperature": {
        "value": 15,
        "unit": "°C"
      },
      "maximumRegulationTemperature": {
        "value": 26,
        "unit": "°C"
      },
      "enableFrostProtect": "on",
      "frostProtectActivationThreshold": {
        "value": 7,
        "unit": "°C"
      },
      "enableOpenWindowDetection": "on",
      "openWindowDetectionTemperatureDrop": {
        "value": 1,
        "unit": "°C/min"
      },
      "openWindowDetectionPauseDuration": {
        "value": 30,
        "unit": "min"
      },
      "temperatureInternalOffset": {
        "value": 0,
        "unit": "°C"
      },
      "regulationTolerance": {
        "value": 0.5,
        "unit": "°C/min"
      },
      "temperatureModeConfort": {
        "value": 21,
        "unit": "°C"
      },
      "temperatureModeEco": {
        "value": 17,
        "unit": "°C"
      },
      "temperatureModeAbsent": {
        "value": 16,
        "unit": "°C"
      },
      "lowBatteryValveOpeningPercent": {
        "value": 50,
        "unit": "%"
      },
      "protocolAndRegion": "LR-EU868",
      "timeZone": "UTC +1",
      "isJoinPending": "false",
      "enableNfcDiscover": "off",
      "kp": 0,
      "ki": 0,
      "enableHeatingPeriod": "on",
      "heatingStartMonth": {
        "value": 10,
        "unit": "month"
      },
      "heatingStartDay": {
        "value": 1,
        "unit": "day"
      },
      "heatingEndMonth": {
        "value": 4,
        "unit": "month"
      },
      "heatingEndDay": {
        "value": 30,
        "unit": "day"
      },
      "enablePlanningMode": "on",
      "dailyPlanning": {
        "monday": "profil 1",
        "tuesday": "profil 1",
        "wednesday": "profil 1",
        "thursday": "profil 1",
        "friday": "profil 1",
        "saturday": "profil 2",
        "sunday": "profil 2"
      },
      "downlinkFcnt": 0,
      "enableBoost": "on",
      "boostActivationDuration": {
        "value": 30,
        "unit": "min"
      },
      "valveOpeningPercentControlDisabled": {
        "value": 0,
        "unit": "%"
      },
      "enableFuota": "off",
      "setpointDisplayOrientation": "vertical",
      "isFuotaPending": "true"
    }
  }
}
```

## Frames 0x05 / 0x06 / 0x07 — Daily Profiles

### D1 — Daily profile 1 — weekday: comfort 06:30-08:30 and 17:00-22:30, eco otherwise

Payload (hex): `D25045555554AB555555552AAAAB50`

```json
{
  "type": "uplink",
  "description": "D1 — Daily profile 1 — weekday: comfort 06:30-08:30 and 17:00-22:30, eco otherwise",
  "input": {
    "bytes": [210, 80, 69, 85, 85, 84, 171, 85, 85, 85, 85, 42, 170, 171, 80],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "FLOW CORE",
      "typeOfMessage": "Daily profil n°1",
      "versionOfMessage": 0,
      "sourceReconfiguration": "start-up",
      "statusReconfiguration": "total success",
      "temperatureSlot00h00_00h30": "eco temperature",
      "temperatureSlot00h30_01h00": "eco temperature",
      "temperatureSlot01h00_01h30": "eco temperature",
      "temperatureSlot01h30_02h00": "eco temperature",
      "temperatureSlot02h00_02h30": "eco temperature",
      "temperatureSlot02h30_03h00": "eco temperature",
      "temperatureSlot03h00_03h30": "eco temperature",
      "temperatureSlot03h30_04h00": "eco temperature",
      "temperatureSlot04h00_04h30": "eco temperature",
      "temperatureSlot04h30_05h00": "eco temperature",
      "temperatureSlot05h00_05h30": "eco temperature",
      "temperatureSlot05h30_06h00": "eco temperature",
      "temperatureSlot06h00_06h30": "eco temperature",
      "temperatureSlot06h30_07h00": "confort temperature",
      "temperatureSlot07h00_07h30": "confort temperature",
      "temperatureSlot07h30_08h00": "confort temperature",
      "temperatureSlot08h00_08h30": "confort temperature",
      "temperatureSlot08h30_09h00": "eco temperature",
      "temperatureSlot09h00_09h30": "eco temperature",
      "temperatureSlot09h30_10h00": "eco temperature",
      "temperatureSlot10h00_10h30": "eco temperature",
      "temperatureSlot10h30_11h00": "eco temperature",
      "temperatureSlot11h00_11h30": "eco temperature",
      "temperatureSlot11h30_12h00": "eco temperature",
      "temperatureSlot12h00_12h30": "eco temperature",
      "temperatureSlot12h30_13h00": "eco temperature",
      "temperatureSlot13h00_13h30": "eco temperature",
      "temperatureSlot13h30_14h00": "eco temperature",
      "temperatureSlot14h00_14h30": "eco temperature",
      "temperatureSlot14h30_15h00": "eco temperature",
      "temperatureSlot15h00_15h30": "eco temperature",
      "temperatureSlot15h30_16h00": "eco temperature",
      "temperatureSlot16h00_16h30": "eco temperature",
      "temperatureSlot16h30_17h00": "eco temperature",
      "temperatureSlot17h00_17h30": "confort temperature",
      "temperatureSlot17h30_18h00": "confort temperature",
      "temperatureSlot18h00_18h30": "confort temperature",
      "temperatureSlot18h30_19h00": "confort temperature",
      "temperatureSlot19h00_19h30": "confort temperature",
      "temperatureSlot19h30_20h00": "confort temperature",
      "temperatureSlot20h00_20h30": "confort temperature",
      "temperatureSlot20h30_21h00": "confort temperature",
      "temperatureSlot21h00_21h30": "confort temperature",
      "temperatureSlot21h30_22h00": "confort temperature",
      "temperatureSlot22h00_22h30": "confort temperature",
      "temperatureSlot22h30_23h00": "eco temperature",
      "temperatureSlot23h00_23h30": "eco temperature",
      "temperatureSlot23h30_00h00": "eco temperature"
    }
  }
}
```

### D2 — Daily profile 2 — weekend: comfort 08:00-23:00, eco otherwise

Payload (hex): `D2604555555552AAAAAAAAAAAAAAD0`

```json
{
  "type": "uplink",
  "description": "D2 — Daily profile 2 — weekend: comfort 08:00-23:00, eco otherwise",
  "input": {
    "bytes": [210, 96, 69, 85, 85, 85, 82, 170, 170, 170, 170, 170, 170, 170, 208],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "FLOW CORE",
      "typeOfMessage": "Daily profil n°2",
      "versionOfMessage": 0,
      "sourceReconfiguration": "start-up",
      "statusReconfiguration": "total success",
      "temperatureSlot00h00_00h30": "eco temperature",
      "temperatureSlot00h30_01h00": "eco temperature",
      "temperatureSlot01h00_01h30": "eco temperature",
      "temperatureSlot01h30_02h00": "eco temperature",
      "temperatureSlot02h00_02h30": "eco temperature",
      "temperatureSlot02h30_03h00": "eco temperature",
      "temperatureSlot03h00_03h30": "eco temperature",
      "temperatureSlot03h30_04h00": "eco temperature",
      "temperatureSlot04h00_04h30": "eco temperature",
      "temperatureSlot04h30_05h00": "eco temperature",
      "temperatureSlot05h00_05h30": "eco temperature",
      "temperatureSlot05h30_06h00": "eco temperature",
      "temperatureSlot06h00_06h30": "eco temperature",
      "temperatureSlot06h30_07h00": "eco temperature",
      "temperatureSlot07h00_07h30": "eco temperature",
      "temperatureSlot07h30_08h00": "eco temperature",
      "temperatureSlot08h00_08h30": "confort temperature",
      "temperatureSlot08h30_09h00": "confort temperature",
      "temperatureSlot09h00_09h30": "confort temperature",
      "temperatureSlot09h30_10h00": "confort temperature",
      "temperatureSlot10h00_10h30": "confort temperature",
      "temperatureSlot10h30_11h00": "confort temperature",
      "temperatureSlot11h00_11h30": "confort temperature",
      "temperatureSlot11h30_12h00": "confort temperature",
      "temperatureSlot12h00_12h30": "confort temperature",
      "temperatureSlot12h30_13h00": "confort temperature",
      "temperatureSlot13h00_13h30": "confort temperature",
      "temperatureSlot13h30_14h00": "confort temperature",
      "temperatureSlot14h00_14h30": "confort temperature",
      "temperatureSlot14h30_15h00": "confort temperature",
      "temperatureSlot15h00_15h30": "confort temperature",
      "temperatureSlot15h30_16h00": "confort temperature",
      "temperatureSlot16h00_16h30": "confort temperature",
      "temperatureSlot16h30_17h00": "confort temperature",
      "temperatureSlot17h00_17h30": "confort temperature",
      "temperatureSlot17h30_18h00": "confort temperature",
      "temperatureSlot18h00_18h30": "confort temperature",
      "temperatureSlot18h30_19h00": "confort temperature",
      "temperatureSlot19h00_19h30": "confort temperature",
      "temperatureSlot19h30_20h00": "confort temperature",
      "temperatureSlot20h00_20h30": "confort temperature",
      "temperatureSlot20h30_21h00": "confort temperature",
      "temperatureSlot21h00_21h30": "confort temperature",
      "temperatureSlot21h30_22h00": "confort temperature",
      "temperatureSlot22h00_22h30": "confort temperature",
      "temperatureSlot22h30_23h00": "confort temperature",
      "temperatureSlot23h00_23h30": "eco temperature",
      "temperatureSlot23h30_00h00": "eco temperature"
    }
  }
}
```

### D3 — Daily profile 3 — extended absence all day

Payload (hex): `D27027FFFFFFFFFFFFFFFFFFFFFFF8`

```json
{
  "type": "uplink",
  "description": "D3 — Daily profile 3 — extended absence all day",
  "input": {
    "bytes": [210, 112, 39, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 248],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "FLOW CORE",
      "typeOfMessage": "Daily profil n°3",
      "versionOfMessage": 0,
      "sourceReconfiguration": "downlink",
      "statusReconfiguration": "total success",
      "temperatureSlot00h00_00h30": "absent temperature",
      "temperatureSlot00h30_01h00": "absent temperature",
      "temperatureSlot01h00_01h30": "absent temperature",
      "temperatureSlot01h30_02h00": "absent temperature",
      "temperatureSlot02h00_02h30": "absent temperature",
      "temperatureSlot02h30_03h00": "absent temperature",
      "temperatureSlot03h00_03h30": "absent temperature",
      "temperatureSlot03h30_04h00": "absent temperature",
      "temperatureSlot04h00_04h30": "absent temperature",
      "temperatureSlot04h30_05h00": "absent temperature",
      "temperatureSlot05h00_05h30": "absent temperature",
      "temperatureSlot05h30_06h00": "absent temperature",
      "temperatureSlot06h00_06h30": "absent temperature",
      "temperatureSlot06h30_07h00": "absent temperature",
      "temperatureSlot07h00_07h30": "absent temperature",
      "temperatureSlot07h30_08h00": "absent temperature",
      "temperatureSlot08h00_08h30": "absent temperature",
      "temperatureSlot08h30_09h00": "absent temperature",
      "temperatureSlot09h00_09h30": "absent temperature",
      "temperatureSlot09h30_10h00": "absent temperature",
      "temperatureSlot10h00_10h30": "absent temperature",
      "temperatureSlot10h30_11h00": "absent temperature",
      "temperatureSlot11h00_11h30": "absent temperature",
      "temperatureSlot11h30_12h00": "absent temperature",
      "temperatureSlot12h00_12h30": "absent temperature",
      "temperatureSlot12h30_13h00": "absent temperature",
      "temperatureSlot13h00_13h30": "absent temperature",
      "temperatureSlot13h30_14h00": "absent temperature",
      "temperatureSlot14h00_14h30": "absent temperature",
      "temperatureSlot14h30_15h00": "absent temperature",
      "temperatureSlot15h00_15h30": "absent temperature",
      "temperatureSlot15h30_16h00": "absent temperature",
      "temperatureSlot16h00_16h30": "absent temperature",
      "temperatureSlot16h30_17h00": "absent temperature",
      "temperatureSlot17h00_17h30": "absent temperature",
      "temperatureSlot17h30_18h00": "absent temperature",
      "temperatureSlot18h00_18h30": "absent temperature",
      "temperatureSlot18h30_19h00": "absent temperature",
      "temperatureSlot19h00_19h30": "absent temperature",
      "temperatureSlot19h30_20h00": "absent temperature",
      "temperatureSlot20h00_20h30": "absent temperature",
      "temperatureSlot20h30_21h00": "absent temperature",
      "temperatureSlot21h00_21h30": "absent temperature",
      "temperatureSlot21h30_22h00": "absent temperature",
      "temperatureSlot22h00_22h30": "absent temperature",
      "temperatureSlot22h30_23h00": "absent temperature",
      "temperatureSlot23h00_23h30": "absent temperature",
      "temperatureSlot23h30_00h00": "absent temperature"
    }
  }
}
```

---

# Downlink (`encoderFlow.js`)

Downlink layout (see [README-Frames_FLOW.md](README-Frames_FLOW.md), section 7): header `0x55`, then one or more `Command ID + DATA` pairs. `encodeDownlink` sorts the commands in ascending ID order, rounds values to the command step with a warning, and rejects out-of-range values with an error.

## downlink-encode (`encodeDownlink`)

### DE1 — Child lock on

Payload (hex): `55 76 01`

```json
{
  "type": "downlink-encode",
  "description": "DE1 — Child lock on",
  "input": {
    "data": {
      "setChildLock": true
    }
  },
  "output": {
    "bytes": [85, 118, 1],
    "fPort": 56,
    "warnings": [],
    "errors": []
  }
}
```

### DE2 — Manual setpoint 19.5 °C

Payload (hex): `55 8A 27`

```json
{
  "type": "downlink-encode",
  "description": "DE2 — Manual setpoint 19.5 °C",
  "input": {
    "data": {
      "setTargetTemperature": 19.5
    }
  },
  "output": {
    "bytes": [85, 138, 39],
    "fPort": 56,
    "warnings": [],
    "errors": []
  }
}
```

### DE3 — Setpoint limits 16-24 °C

Payload (hex): `55 77 20 78 30`

```json
{
  "type": "downlink-encode",
  "description": "DE3 — Setpoint limits 16-24 °C",
  "input": {
    "data": {
      "setMinTemperature": 16,
      "setMaxTemperature": 24
    }
  },
  "output": {
    "bytes": [85, 119, 32, 120, 48],
    "fPort": 56,
    "warnings": [],
    "errors": []
  }
}
```

### DE4 — Open window detection on, delta 1.5 °C, pause 15 min

Payload (hex): `55 73 01 74 0F 75 0F`

```json
{
  "type": "downlink-encode",
  "description": "DE4 — Open window detection on, delta 1.5 °C, pause 15 min",
  "input": {
    "data": {
      "setOpenWindowDetection": true,
      "setOpenWindowDelta": 1.5,
      "setOpenWindowPauseDuration": 15
    }
  },
  "output": {
    "bytes": [85, 115, 1, 116, 15, 117, 15],
    "fPort": 56,
    "warnings": [],
    "errors": []
  }
}
```

### DE5 — Temperature offset -1.5 °C

Payload (hex): `55 72 23`

```json
{
  "type": "downlink-encode",
  "description": "DE5 — Temperature offset -1.5 °C",
  "input": {
    "data": {
      "setTemperatureOffset": -1.5
    }
  },
  "output": {
    "bytes": [85, 114, 35],
    "fPort": 56,
    "warnings": [],
    "errors": []
  }
}
```

### DE6 — Commands given in any order are sent in ascending ID order (period 30 min, UTC+1, configuration request)

Payload (hex): `55 01 63 0D 86 03`

```json
{
  "type": "downlink-encode",
  "description": "DE6 — Commands given in any order are sent in ascending ID order (period 30 min, UTC+1, configuration request)",
  "input": {
    "data": {
      "setUplinkPeriodRegulationOn": 30,
      "setTimeZone": 1,
      "getConfiguration": ""
    }
  },
  "output": {
    "bytes": [85, 1, 99, 13, 134, 3],
    "fPort": 56,
    "warnings": [],
    "errors": []
  }
}
```

### DE7 — Heating season on, from October 15 to April 15

Payload (hex): `55 7F 01 80 0A 0F 81 04 0F`

```json
{
  "type": "downlink-encode",
  "description": "DE7 — Heating season on, from October 15 to April 15",
  "input": {
    "data": {
      "setHeatingSeason": true,
      "setHeatingSeasonStart": {
        "month": 10,
        "day": 15
      },
      "setHeatingSeasonEnd": {
        "month": 4,
        "day": 15
      }
    }
  },
  "output": {
    "bytes": [85, 127, 1, 128, 10, 15, 129, 4, 15],
    "fPort": 56,
    "warnings": [],
    "errors": []
  }
}
```

### DE8 — Weekly schedule: profile 1 on weekdays except Wednesday (profile 2), profile 3 on weekends

Payload (hex): `55 82 04 28`

```json
{
  "type": "downlink-encode",
  "description": "DE8 — Weekly schedule: profile 1 on weekdays except Wednesday (profile 2), profile 3 on weekends",
  "input": {
    "data": {
      "setWeeklySchedule": {
        "monday": 1,
        "tuesday": 1,
        "wednesday": 2,
        "thursday": 1,
        "friday": 1,
        "saturday": 3,
        "sunday": 3
      }
    }
  },
  "output": {
    "bytes": [85, 130, 4, 40],
    "fPort": 56,
    "warnings": [],
    "errors": []
  }
}
```

### DE9 — Daily profile 1: comfort 06:30-08:30 and 17:00-22:30, eco otherwise

Payload (hex): `55 83 AA AA AA 95 6A AA AA AA A5 55 55 6A`

```json
{
  "type": "downlink-encode",
  "description": "DE9 — Daily profile 1: comfort 06:30-08:30 and 17:00-22:30, eco otherwise",
  "input": {
    "data": {
      "setDailyProfile1": [
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "comfort",
        "comfort",
        "comfort",
        "comfort",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "comfort",
        "comfort",
        "comfort",
        "comfort",
        "comfort",
        "comfort",
        "comfort",
        "comfort",
        "comfort",
        "comfort",
        "comfort",
        "eco",
        "eco",
        "eco"
      ]
    }
  },
  "output": {
    "bytes": [85, 131, 170, 170, 170, 149, 106, 170, 170, 170, 165, 85, 85, 106],
    "fPort": 56,
    "warnings": [],
    "errors": []
  }
}
```

### DE10 — BOOST for 30 min

Payload (hex): `55 90 01 91 1E`

```json
{
  "type": "downlink-encode",
  "description": "DE10 — BOOST for 30 min",
  "input": {
    "data": {
      "setBoost": true,
      "setBoostDuration": 30
    }
  },
  "output": {
    "bytes": [85, 144, 1, 145, 30],
    "fPort": 56,
    "warnings": [],
    "errors": []
  }
}
```

### DE11 — Delayed network join in 24 h (1440 min)

Payload (hex): `55 1C 00 90`

```json
{
  "type": "downlink-encode",
  "description": "DE11 — Delayed network join in 24 h (1440 min)",
  "input": {
    "data": {
      "setDelayedNetworkJoin": 1440
    }
  },
  "output": {
    "bytes": [85, 28, 0, 144],
    "fPort": 56,
    "warnings": [],
    "errors": []
  }
}
```

### DE12 — Motor recalibration

Payload (hex): `55 8C`

```json
{
  "type": "downlink-encode",
  "description": "DE12 — Motor recalibration",
  "input": {
    "data": {
      "recalibrateMotor": ""
    }
  },
  "output": {
    "bytes": [85, 140],
    "fPort": 56,
    "warnings": [],
    "errors": []
  }
}
```

### DE13 — Vertical setpoint display

Payload (hex): `55 9A 01`

```json
{
  "type": "downlink-encode",
  "description": "DE13 — Vertical setpoint display",
  "input": {
    "data": {
      "setSetpointDisplayOrientation": "vertical"
    }
  },
  "output": {
    "bytes": [85, 154, 1],
    "fPort": 56,
    "warnings": [],
    "errors": []
  }
}
```

### DE14 — Raw command (escape hatch): child lock on

Payload (hex): `55 76 01`

```json
{
  "type": "downlink-encode",
  "description": "DE14 — Raw command (escape hatch): child lock on",
  "input": {
    "data": {
      "sendCustomHexCommand": "7601"
    }
  },
  "output": {
    "bytes": [85, 118, 1],
    "fPort": 56,
    "warnings": [],
    "errors": []
  }
}
```

### DE15 — Warning: setpoint 20.3 °C rounded to the 0.5 °C step (20.5 °C)

Payload (hex): `55 8A 29`

```json
{
  "type": "downlink-encode",
  "description": "DE15 — Warning: setpoint 20.3 °C rounded to the 0.5 °C step (20.5 °C)",
  "input": {
    "data": {
      "setTargetTemperature": 20.3
    }
  },
  "output": {
    "bytes": [85, 138, 41],
    "fPort": 56,
    "warnings": [
      "setTargetTemperature: 20.3C is not a multiple of 0.5C, rounded to 20.5C"
    ],
    "errors": []
  }
}
```

### DE16 — Error: setpoint out of range (35 °C, max 31 °C)

```json
{
  "type": "downlink-encode",
  "description": "DE16 — Error: setpoint out of range (35 °C, max 31 °C)",
  "input": {
    "data": {
      "setTargetTemperature": 35
    }
  },
  "output": {
    "bytes": [],
    "fPort": 56,
    "warnings": [],
    "errors": [
      "setTargetTemperature: out of range (0C..31C), got 35C"
    ]
  }
}
```

### DE17 — Error: unknown command

```json
{
  "type": "downlink-encode",
  "description": "DE17 — Error: unknown command",
  "input": {
    "data": {
      "setColor": "red"
    }
  },
  "output": {
    "bytes": [],
    "fPort": 56,
    "warnings": [],
    "errors": [
      "unknown command \"setColor\""
    ]
  }
}
```

### DE18 — Error: no command

```json
{
  "type": "downlink-encode",
  "description": "DE18 — Error: no command",
  "input": {
    "data": {}
  },
  "output": {
    "bytes": [],
    "fPort": 56,
    "warnings": [],
    "errors": [
      "empty downlink: no command provided"
    ]
  }
}
```

## downlink-decode (`decodeDownlink`)

### DD1 — Child lock on

Payload (hex): `55 76 01`

```json
{
  "type": "downlink-decode",
  "description": "DD1 — Child lock on",
  "input": {
    "bytes": [85, 118, 1],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "setChildLock": true
    },
    "warnings": [],
    "errors": []
  }
}
```

### DD2 — Configuration request, UTC+1, period 30 min

Payload (hex): `55 01 63 0D 86 03`

```json
{
  "type": "downlink-decode",
  "description": "DD2 — Configuration request, UTC+1, period 30 min",
  "input": {
    "bytes": [85, 1, 99, 13, 134, 3],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "getConfiguration": "",
      "setTimeZone": 1,
      "setUplinkPeriodRegulationOn": 30
    },
    "warnings": [],
    "errors": []
  }
}
```

### DD3 — Heating season on, from October 15 to April 15

Payload (hex): `55 7F 01 80 0A 0F 81 04 0F`

```json
{
  "type": "downlink-decode",
  "description": "DD3 — Heating season on, from October 15 to April 15",
  "input": {
    "bytes": [85, 127, 1, 128, 10, 15, 129, 4, 15],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "setHeatingSeason": true,
      "setHeatingSeasonStart": {
        "month": 10,
        "day": 15
      },
      "setHeatingSeasonEnd": {
        "month": 4,
        "day": 15
      }
    },
    "warnings": [],
    "errors": []
  }
}
```

### DD4 — Weekly schedule

Payload (hex): `55 82 04 28`

```json
{
  "type": "downlink-decode",
  "description": "DD4 — Weekly schedule",
  "input": {
    "bytes": [85, 130, 4, 40],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "setWeeklySchedule": {
        "monday": 1,
        "tuesday": 1,
        "wednesday": 2,
        "thursday": 1,
        "friday": 1,
        "saturday": 3,
        "sunday": 3
      }
    },
    "warnings": [],
    "errors": []
  }
}
```

### DD5 — Daily profile 1: comfort 06:30-08:30 and 17:00-22:30, eco otherwise

Payload (hex): `55 83 AA AA AA 95 6A AA AA AA A5 55 55 6A`

```json
{
  "type": "downlink-decode",
  "description": "DD5 — Daily profile 1: comfort 06:30-08:30 and 17:00-22:30, eco otherwise",
  "input": {
    "bytes": [85, 131, 170, 170, 170, 149, 106, 170, 170, 170, 165, 85, 85, 106],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "setDailyProfile1": [
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "comfort",
        "comfort",
        "comfort",
        "comfort",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "eco",
        "comfort",
        "comfort",
        "comfort",
        "comfort",
        "comfort",
        "comfort",
        "comfort",
        "comfort",
        "comfort",
        "comfort",
        "comfort",
        "eco",
        "eco",
        "eco"
      ]
    },
    "warnings": [],
    "errors": []
  }
}
```

### DD6 — Factory reset

Payload (hex): `55 4B 01`

```json
{
  "type": "downlink-decode",
  "description": "DD6 — Factory reset",
  "input": {
    "bytes": [85, 75, 1],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "factoryReset": ""
    },
    "warnings": [],
    "errors": []
  }
}
```

### DD7 — Error: bad header (0x56 instead of 0x55)

Payload (hex): `56 76 01`

```json
{
  "type": "downlink-decode",
  "description": "DD7 — Error: bad header (0x56 instead of 0x55)",
  "input": {
    "bytes": [86, 118, 1],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "raw": "567601"
    },
    "warnings": [],
    "errors": [
      "bad header: expected 0x55, got 0x56"
    ]
  }
}
```

### DD8 — Error: unknown command ID 0xFF

Payload (hex): `55 76 01 FF 01`

```json
{
  "type": "downlink-decode",
  "description": "DD8 — Error: unknown command ID 0xFF",
  "input": {
    "bytes": [85, 118, 1, 255, 1],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {
      "setChildLock": true,
      "raw": "557601FF01"
    },
    "warnings": [],
    "errors": [
      "unknown command ID 0xFF at offset 3"
    ]
  }
}
```

### DD9 — Error: truncated command (0x80 needs 2 bytes)

Payload (hex): `55 80 0A`

```json
{
  "type": "downlink-decode",
  "description": "DD9 — Error: truncated command (0x80 needs 2 bytes)",
  "input": {
    "bytes": [85, 128, 10],
    "fPort": 56,
    "recvTime": "2026-10-20T10:00:00.000+02:00"
  },
  "output": {
    "data": {},
    "warnings": [],
    "errors": [
      "truncated payload for command setHeatingSeasonStart"
    ]
  }
}
```
