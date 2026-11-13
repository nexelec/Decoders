# VISTA SPACE / FEEL / MOVE / WAVE / RISE — Payload Examples

Examples for the decoder of VISTA SPACE / FEEL / MOVE / WAVE / RISE, in the format of the LoRa Alliance *Payload Codec API* specification (TS013-1.0.0, §6.2.1 "Payload Examples"): every frame type decoded by `decodeUplink` (`decoderVista.js` **1.0.0**), for each product that sends it.

> **Synthetic frames.** The payloads are built bit by bit from the layout of [README-Frames_VISTA.md](README-Frames_VISTA.md) (technical guide D1196A) with realistic values, then decoded with `decoderVista.js`. They are meant to validate a decoder integration. The message version nibble is 0 in every frame.
>
> **Captured frames.** Examples M1 to M4 are frames received from a VISTA MOVE, given as they were sent by the device.

All LoRaWAN frames use **FPort 56**. The machine-readable list is [`examples.json`](examples.json); each example below is the corresponding entry of that file, and `output` is always the exact object returned by `decodeUplink`, so the file can be run as a test suite (TS013, Appendix 2 B).

| Property | Content |
|----------|---------|
| `type` | `"uplink"` |
| `description` | Example ID and scenario |
| `input` | `bytes` (payload as an array of numbers), `fPort`, `recvTime` (ISO 8601, not used by the decoder) |
| `output` | `data` (decoded object) |

> `decoderVista.js` 1.0.0 does not check the frame length and returns neither `errors` nor `warnings`, so no error case is listed.

## Summary

| ID | Frame | Product | Payload (hex) | Scenario |
|----|-------|---------|---------------|----------|
| P1 | 0x1 | SPACE | `DA10118AA0` | VISTA SPACE, occupied meeting room: 350 lux, activity index 42 %, presence |
| P2 | 0x1 | FEEL | `D710809C40` | VISTA FEEL, 21.4 °C, 45.2 %RH |
| P3 | 0x1 | MOVE | `D810799E000000` | VISTA MOVE, empty office at night: 18.6 °C, 48 %RH, 0 lux, no activity, absence |
| P4 | 0x1 | WAVE | `D91084A03137478438` | VISTA WAVE, classroom in use: 23 °C, 51.5 %RH, 1245 ppm CO2, 600 lux, activity 67 %, presence |
| P5 | 0x1 | RISE | `DB107C99309900` | VISTA RISE, 19.8 °C, 40.3 %RH, 612 ppm CO2 |
| P6 | 0x1 | WAVE | `D910835B8FFF0547D0` | VISTA WAVE, CO2 sensor at end of life (16380), motion sensor disabled (activity index 125) |
| P7 | 0x1 | FEEL | `D7103FFFF0` | VISTA FEEL, sub-zero temperature (-4.5 °C, unheated storage), humidity sensor error (1023) |
| H1 | 0x2 | WAVE | `D920300C33B0DD330BC2B09E240831E0701A8650` | VISTA WAVE, 12 CO2 measures every 30 min (4 new values × 3 repetitions), most recent first |
| H2 | 0x3 | RISE | `DB30181827E1FA7F5FF7F9FC` | VISTA RISE, 6 temperatures every 60 min (3 new values × 2 repetitions) |
| H3 | 0x4 | MOVE | `D84010081833FF7F9FA0` | VISTA MOVE, 4 humidity measures every 20 min, one measure in error (1023) |
| H4 | 0x3 | FEEL | `D7301004180600801FE0` | VISTA FEEL, 4 temperatures every 10 min, no repetition |
| S1 | 0x5 | WAVE | `D950057BB4000E1E5900C0` | VISTA WAVE, battery high (3600 mV), hardware OK, 14 months of activity, CO2 calibrated 30 days ago, on its base |
| S2 | 0x5 | SPACE | `DA500579A50803FF9900C0` | VISTA SPACE, just removed from its base, battery medium (3300 mV), no CO2 sensor (calibration time 255) |
| S3 | 0x5 | FEEL | `D750046E7A9C3DFF1B8080` | VISTA FEEL, hardware fault, battery critical (2450 mV), base never detected |
| C1 | 0x6 | SPACE | `DA604432800004F0` | VISTA SPACE, start-up, PIR on, periodic data every 10 min, presence alert after 15 min without motion |
| C2 | 0x6 | FEEL | `D7602867858C306B001B00` | VISTA FEEL, reconfigured by downlink FCnt 27, partial success, delta 0.5 °C, temperature and humidity datalog (6 × 3, every 60 min), join programmed, NFC not discoverable |
| C3 | 0x6 | MOVE | `D8600432BFC4106000005E40` | VISTA MOVE, reconfigured by NFC, delta temperature disabled, temperature datalog only, presence alert after 30 min, FUOTA activation scheduled |
| C4 | 0x6 | WAVE | `D960A728118C32867FE60C90001C0A40` | VISTA WAVE, weekly periodic configuration, CO2 thresholds 800 / 1400 ppm, delta CO2 100 ppm, CO2 and temperature datalog (12 × 3, every 6 h), FUOTA in progress |
| C5 | 0x6 | RISE | `DB60246428106A7F8A861030000280` | VISTA RISE, reconfigured by downlink FCnt 5, automatic calibration off, thresholds 1000 / 1600 ppm, orange LED off, delta CO2 disabled, delta 1 °C |
| A1 | 0x7 | SPACE | `DA7080` | VISTA SPACE, room vacant (no motion for the configured period) |
| A2 | 0x7 | MOVE | `D87000` | VISTA MOVE, room occupied again |
| R1 | 0x8 | WAVE | `D980` | VISTA WAVE, reserved message type 0x8: only the product and "Reserved" are returned |
| M1 | 0x1 | MOVE | `D810815B984400` | VISTA MOVE, 21.7 °C, 44.1 %RH, 2645 lux, no activity, absence |
| M2 | 0x7 | MOVE | `D87080` | VISTA MOVE, room vacant |
| M3 | 0x6 | MOVE | `D860243282861890000BC500` | VISTA MOVE, reconfigured by downlink FCnt 23, periodic data every 10 min, delta 0.5 °C, datalog off, presence alert after 5 min |
| M4 | 0x5 | MOVE | `D850010B950000FF990580` | VISTA MOVE, hardware 1, software 11, battery high (2980 mV), just removed from its base, bootloader 22 |

---

## Frame 0x1 — Periodic Data

### P1 — Periodic data — VISTA SPACE, occupied meeting room: 350 lux, activity index 42 %, presence

Payload (hex): `DA10118AA0`

```json
{
  "type": "uplink",
  "description": "P1 — Periodic data — VISTA SPACE, occupied meeting room: 350 lux, activity index 42 %, presence",
  "input": {
    "bytes": [218, 16, 17, 138, 160],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA SPACE",
      "typeOfMessage": "Periodic Data",
      "versionOfMessage": 0,
      "luminosity": {
        "value": 350,
        "unit": "lux"
      },
      "activityIndex": {
        "value": 42,
        "unit": "%"
      },
      "presence": "presence"
    }
  }
}
```

### P2 — Periodic data — VISTA FEEL, 21.4 °C, 45.2 %RH

Payload (hex): `D710809C40`

```json
{
  "type": "uplink",
  "description": "P2 — Periodic data — VISTA FEEL, 21.4 °C, 45.2 %RH",
  "input": {
    "bytes": [215, 16, 128, 156, 64],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA FEEL",
      "typeOfMessage": "Periodic Data",
      "versionOfMessage": 0,
      "temperature": {
        "value": 21.4,
        "unit": "°C"
      },
      "humidity": {
        "value": 45.2,
        "unit": "%RH"
      }
    }
  }
}
```

### P3 — Periodic data — VISTA MOVE, empty office at night: 18.6 °C, 48 %RH, 0 lux, no activity, absence

Payload (hex): `D810799E000000`

```json
{
  "type": "uplink",
  "description": "P3 — Periodic data — VISTA MOVE, empty office at night: 18.6 °C, 48 %RH, 0 lux, no activity, absence",
  "input": {
    "bytes": [216, 16, 121, 158, 0, 0, 0],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA MOVE",
      "typeOfMessage": "Periodic Data",
      "versionOfMessage": 0,
      "temperature": {
        "value": 18.6,
        "unit": "°C"
      },
      "humidity": {
        "value": 48,
        "unit": "%RH"
      },
      "luminosity": {
        "value": 0,
        "unit": "lux"
      },
      "activityIndex": {
        "value": 0,
        "unit": "%"
      },
      "presence": "absent"
    }
  }
}
```

### P4 — Periodic data — VISTA WAVE, classroom in use: 23 °C, 51.5 %RH, 1245 ppm CO2, 600 lux, activity 67 %, presence

Payload (hex): `D91084A03137478438`

```json
{
  "type": "uplink",
  "description": "P4 — Periodic data — VISTA WAVE, classroom in use: 23 °C, 51.5 %RH, 1245 ppm CO2, 600 lux, activity 67 %, presence",
  "input": {
    "bytes": [217, 16, 132, 160, 49, 55, 71, 132, 56],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA WAVE",
      "typeOfMessage": "Periodic Data",
      "versionOfMessage": 0,
      "temperature": {
        "value": 23,
        "unit": "°C"
      },
      "humidity": {
        "value": 51.5,
        "unit": "%RH"
      },
      "co2": {
        "value": 1245,
        "unit": "ppm"
      },
      "luminosity": {
        "value": 600,
        "unit": "lux"
      },
      "activityIndex": {
        "value": 67,
        "unit": "%"
      },
      "presence": "presence"
    }
  }
}
```

### P5 — Periodic data — VISTA RISE, 19.8 °C, 40.3 %RH, 612 ppm CO2

Payload (hex): `DB107C99309900`

```json
{
  "type": "uplink",
  "description": "P5 — Periodic data — VISTA RISE, 19.8 °C, 40.3 %RH, 612 ppm CO2",
  "input": {
    "bytes": [219, 16, 124, 153, 48, 153, 0],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA RISE",
      "typeOfMessage": "Periodic Data",
      "versionOfMessage": 0,
      "temperature": {
        "value": 19.8,
        "unit": "°C"
      },
      "humidity": {
        "value": 40.3,
        "unit": "%RH"
      },
      "co2": {
        "value": 612,
        "unit": "ppm"
      }
    }
  }
}
```

### P6 — Periodic data — VISTA WAVE, CO2 sensor at end of life (16380), motion sensor disabled (activity index 125)

Payload (hex): `D910835B8FFF0547D0`

```json
{
  "type": "uplink",
  "description": "P6 — Periodic data — VISTA WAVE, CO2 sensor at end of life (16380), motion sensor disabled (activity index 125)",
  "input": {
    "bytes": [217, 16, 131, 91, 143, 255, 5, 71, 208],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA WAVE",
      "typeOfMessage": "Periodic Data",
      "versionOfMessage": 0,
      "temperature": {
        "value": 22.5,
        "unit": "°C"
      },
      "humidity": {
        "value": 44,
        "unit": "%RH"
      },
      "co2": "end of life sensor",
      "luminosity": {
        "value": 420,
        "unit": "lux"
      },
      "activityIndex": "desactivated sensor",
      "presence": "absent"
    }
  }
}
```

### P7 — Periodic data — VISTA FEEL, sub-zero temperature (-4.5 °C, unheated storage), humidity sensor error (1023)

Payload (hex): `D7103FFFF0`

```json
{
  "type": "uplink",
  "description": "P7 — Periodic data — VISTA FEEL, sub-zero temperature (-4.5 °C, unheated storage), humidity sensor error (1023)",
  "input": {
    "bytes": [215, 16, 63, 255, 240],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA FEEL",
      "typeOfMessage": "Periodic Data",
      "versionOfMessage": 0,
      "temperature": {
        "value": -4.5,
        "unit": "°C"
      },
      "humidity": "error"
    }
  }
}
```

---

## Frames 0x2 / 0x3 / 0x4 — Historical Data

### H1 — CO2 historical data — VISTA WAVE, 12 CO2 measures every 30 min (4 new values × 3 repetitions), most recent first

Payload (hex): `D920300C33B0DD330BC2B09E240831E0701A8650`

```json
{
  "type": "uplink",
  "description": "H1 — CO2 historical data — VISTA WAVE, 12 CO2 measures every 30 min (4 new values × 3 repetitions), most recent first",
  "input": {
    "bytes": [217, 32, 48, 12, 51, 176, 221, 51, 11, 194, 176, 158, 36, 8, 49, 224, 112, 26, 134, 80],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA WAVE",
      "typeOfMessage": "CO2 Historical Data",
      "versionOfMessage": 0,
      "newMeasure": 12,
      "periodBetweenMeasure": {
        "value": 30,
        "unit": "minutes"
      },
      "redundancy": 3,
      "co2": {
        "value": [
          1180,
          1105,
          1020,
          940,
          860,
          790,
          720,
          655,
          600,
          560,
          530,
          505
        ],
        "unit": "ppm"
      }
    }
  }
}
```

### H2 — Temperature historical data — VISTA RISE, 6 temperatures every 60 min (3 new values × 2 repetitions)

Payload (hex): `DB30181827E1FA7F5FF7F9FC`

```json
{
  "type": "uplink",
  "description": "H2 — Temperature historical data — VISTA RISE, 6 temperatures every 60 min (3 new values × 2 repetitions)",
  "input": {
    "bytes": [219, 48, 24, 24, 39, 225, 250, 127, 95, 247, 249, 252],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA RISE",
      "typeOfMessage": "Temperature Historical Data",
      "versionOfMessage": 0,
      "newMeasure": 6,
      "periodBetweenMeasure": {
        "value": 60,
        "unit": "minutes"
      },
      "redundancy": 2,
      "temperature": {
        "value": [
          20.4,
          20.6,
          20.9,
          21.1,
          21,
          20.8
        ],
        "unit": "°C"
      }
    }
  }
}
```

### H3 — Humidity historical data — VISTA MOVE, 4 humidity measures every 20 min, one measure in error (1023)

Payload (hex): `D84010081833FF7F9FA0`

```json
{
  "type": "uplink",
  "description": "H3 — Humidity historical data — VISTA MOVE, 4 humidity measures every 20 min, one measure in error (1023)",
  "input": {
    "bytes": [216, 64, 16, 8, 24, 51, 255, 127, 159, 160],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA MOVE",
      "typeOfMessage": "Humidity Historical Data",
      "versionOfMessage": 0,
      "newMeasure": 4,
      "periodBetweenMeasure": {
        "value": 20,
        "unit": "minutes"
      },
      "redundancy": 1,
      "humidity": {
        "value": [
          52.4,
          "error",
          51,
          50.6
        ],
        "unit": "%RH"
      }
    }
  }
}
```

### H4 — Temperature historical data — VISTA FEEL, 4 temperatures every 10 min, no repetition

Payload (hex): `D7301004180600801FE0`

```json
{
  "type": "uplink",
  "description": "H4 — Temperature historical data — VISTA FEEL, 4 temperatures every 10 min, no repetition",
  "input": {
    "bytes": [215, 48, 16, 4, 24, 6, 0, 128, 31, 224],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA FEEL",
      "typeOfMessage": "Temperature Historical Data",
      "versionOfMessage": 0,
      "newMeasure": 4,
      "periodBetweenMeasure": {
        "value": 10,
        "unit": "minutes"
      },
      "redundancy": 1,
      "temperature": {
        "value": [
          21.3,
          21.2,
          21.2,
          21
        ],
        "unit": "°C"
      }
    }
  }
}
```

---

## Frame 0x5 — Product Status

### S1 — Product status — VISTA WAVE, battery high (3600 mV), hardware OK, 14 months of activity, CO2 calibrated 30 days ago, on its base

Payload (hex): `D950057BB4000E1E5900C0`

```json
{
  "type": "uplink",
  "description": "S1 — Product status — VISTA WAVE, battery high (3600 mV), hardware OK, 14 months of activity, CO2 calibrated 30 days ago, on its base",
  "input": {
    "bytes": [217, 80, 5, 123, 180, 0, 14, 30, 89, 0, 192],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA WAVE",
      "typeOfMessage": "Product Status",
      "versionOfMessage": 0,
      "hardwareVersion": 5,
      "softwareVersion": 123,
      "batteryVoltage": {
        "value": 3600,
        "unit": "mV"
      },
      "batteryLevel": "high",
      "statusProduct": "ok",
      "timeActivation": {
        "value": 14,
        "unit": "month"
      },
      "timeCo2LastCalibration": {
        "value": 30,
        "unit": "days"
      },
      "statusAntiTear": "detected",
      "lowBatterieThreshold": {
        "value": 2500,
        "unit": "mV"
      },
      "bootloaderVersion": 3
    }
  }
}
```

### S2 — Product status — VISTA SPACE, just removed from its base, battery medium (3300 mV), no CO2 sensor (calibration time 255)

Payload (hex): `DA500579A50803FF9900C0`

```json
{
  "type": "uplink",
  "description": "S2 — Product status — VISTA SPACE, just removed from its base, battery medium (3300 mV), no CO2 sensor (calibration time 255)",
  "input": {
    "bytes": [218, 80, 5, 121, 165, 8, 3, 255, 153, 0, 192],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA SPACE",
      "typeOfMessage": "Product Status",
      "versionOfMessage": 0,
      "hardwareVersion": 5,
      "softwareVersion": 121,
      "batteryVoltage": {
        "value": 3300,
        "unit": "mV"
      },
      "batteryLevel": "medium",
      "statusProduct": "ok",
      "timeActivation": {
        "value": 3,
        "unit": "month"
      },
      "timeCo2LastCalibration": "error",
      "statusAntiTear": "just removed from the base",
      "lowBatterieThreshold": {
        "value": 2500,
        "unit": "mV"
      },
      "bootloaderVersion": 3
    }
  }
}
```

### S3 — Product status — VISTA FEEL, hardware fault, battery critical (2450 mV), base never detected

Payload (hex): `D750046E7A9C3DFF1B8080`

```json
{
  "type": "uplink",
  "description": "S3 — Product status — VISTA FEEL, hardware fault, battery critical (2450 mV), base never detected",
  "input": {
    "bytes": [215, 80, 4, 110, 122, 156, 61, 255, 27, 128, 128],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA FEEL",
      "typeOfMessage": "Product Status",
      "versionOfMessage": 0,
      "hardwareVersion": 4,
      "softwareVersion": 110,
      "batteryVoltage": {
        "value": 2450,
        "unit": "mV"
      },
      "batteryLevel": "critical",
      "statusProduct": "error",
      "timeActivation": {
        "value": 61,
        "unit": "month"
      },
      "timeCo2LastCalibration": "error",
      "statusAntiTear": "not detected",
      "lowBatterieThreshold": {
        "value": 2550,
        "unit": "mV"
      },
      "bootloaderVersion": 2
    }
  }
}
```

---

## Frame 0x6 — Product Configuration

### C1 — Product configuration — VISTA SPACE, start-up, PIR on, periodic data every 10 min, presence alert after 15 min without motion

Payload (hex): `DA604432800004F0`

```json
{
  "type": "uplink",
  "description": "C1 — Product configuration — VISTA SPACE, start-up, PIR on, periodic data every 10 min, presence alert after 15 min without motion",
  "input": {
    "bytes": [218, 96, 68, 50, 128, 0, 4, 240],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA SPACE",
      "typeOfMessage": "Product Configuration",
      "versionOfMessage": 0,
      "reconfigurationSource": "start up",
      "reconfigurationStatus": "total success",
      "enableMotion": "on",
      "protocolAndRegion": "LR-EU868",
      "enablePeriodicData": "on",
      "periodPeriodicTransmission": {
        "value": 10,
        "unit": "minutes"
      },
      "pendingJoin": "no join programmed",
      "enableNfcDiscover": "discoverable",
      "downlinkFcnt": 0,
      "enableRoomPresence": "on",
      "periodWithoutMotion": {
        "value": 15,
        "unit": "minutes"
      },
      "enableFuota": "off",
      "isFuotaPending": "false"
    }
  }
}
```

### C2 — Product configuration — VISTA FEEL, reconfigured by downlink FCnt 27, partial success, delta 0.5 °C, temperature and humidity datalog (6 × 3, every 60 min), join programmed, NFC not discoverable

Payload (hex): `D7602867858C306B001B00`

```json
{
  "type": "uplink",
  "description": "C2 — Product configuration — VISTA FEEL, reconfigured by downlink FCnt 27, partial success, delta 0.5 °C, temperature and humidity datalog (6 × 3, every 60 min), join programmed, NFC not discoverable",
  "input": {
    "bytes": [215, 96, 40, 103, 133, 140, 48, 107, 0, 27, 0],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA FEEL",
      "typeOfMessage": "Product Configuration",
      "versionOfMessage": 0,
      "reconfigurationSource": "downlink",
      "reconfigurationStatus": "partial success",
      "protocolAndRegion": "LR-EU868",
      "enablePeriodicData": "on",
      "periodPeriodicTransmission": {
        "value": 15,
        "unit": "minutes"
      },
      "deltaTemperature": {
        "value": 0.5,
        "unit": "°C"
      },
      "enableDatalogTemperature": "on",
      "enableDatalogHumidity": "on",
      "datalogNewValues": 6,
      "datalogRepeatValues": 3,
      "periodDatalogTransmission": {
        "value": 60,
        "unit": "minutes"
      },
      "pendingJoin": "join programmed",
      "enableNfcDiscover": "no discoverable",
      "downlinkFcnt": 27,
      "enableFuota": "off",
      "isFuotaPending": "false"
    }
  }
}
```

### C3 — Product configuration — VISTA MOVE, reconfigured by NFC, delta temperature disabled, temperature datalog only, presence alert after 30 min, FUOTA activation scheduled

Payload (hex): `D8600432BFC4106000005E40`

```json
{
  "type": "uplink",
  "description": "C3 — Product configuration — VISTA MOVE, reconfigured by NFC, delta temperature disabled, temperature datalog only, presence alert after 30 min, FUOTA activation scheduled",
  "input": {
    "bytes": [216, 96, 4, 50, 191, 196, 16, 96, 0, 0, 94, 64],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA MOVE",
      "typeOfMessage": "Product Configuration",
      "versionOfMessage": 0,
      "reconfigurationSource": "nfc",
      "reconfigurationStatus": "total success",
      "enableMotion": "on",
      "protocolAndRegion": "LR-EU868",
      "enablePeriodicData": "on",
      "periodPeriodicTransmission": {
        "value": 10,
        "unit": "minutes"
      },
      "deltaTemperature": "desactivated",
      "enableDatalogTemperature": "on",
      "enableDatalogHumidity": "off",
      "datalogNewValues": 4,
      "datalogRepeatValues": 2,
      "periodDatalogTransmission": {
        "value": 120,
        "unit": "minutes"
      },
      "pendingJoin": "no join programmed",
      "enableNfcDiscover": "discoverable",
      "downlinkFcnt": 0,
      "enableRoomPresence": "on",
      "periodWithoutMotion": {
        "value": 30,
        "unit": "minutes"
      },
      "enableFuota": "off",
      "isFuotaPending": "true"
    }
  }
}
```

### C4 — Product configuration — VISTA WAVE, weekly periodic configuration, CO2 thresholds 800 / 1400 ppm, delta CO2 100 ppm, CO2 and temperature datalog (12 × 3, every 6 h), FUOTA in progress

Payload (hex): `D960A728118C32867FE60C90001C0A40`

```json
{
  "type": "uplink",
  "description": "C4 — Product configuration — VISTA WAVE, weekly periodic configuration, CO2 thresholds 800 / 1400 ppm, delta CO2 100 ppm, CO2 and temperature datalog (12 × 3, every 6 h), FUOTA in progress",
  "input": {
    "bytes": [217, 96, 167, 40, 17, 140, 50, 134, 127, 230, 12, 144, 0, 28, 10, 64],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA WAVE",
      "typeOfMessage": "Product Configuration",
      "versionOfMessage": 0,
      "reconfigurationSource": "periodic",
      "reconfigurationStatus": "total success",
      "enableCo2": "on",
      "enableMotion": "on",
      "enableAutomaticCo2Calibration": "on",
      "thresholdCo2Medium": {
        "value": 800,
        "unit": "ppm"
      },
      "thresholdCo2High": {
        "value": 1400,
        "unit": "ppm"
      },
      "enableLedCo2": "on",
      "enableLedMediumLevel": "on",
      "protocolAndRegion": "LR-EU868",
      "enablePeriodicData": "on",
      "periodPeriodicTransmission": {
        "value": 10,
        "unit": "minutes"
      },
      "deltaCo2": {
        "value": 100,
        "unit": "ppm"
      },
      "deltaTemperature": "desactivated",
      "enableDatalogCo2": "on",
      "enableDatalogTemperature": "on",
      "enableDatalogHumidity": "off",
      "datalogNewValues": 12,
      "datalogRepeatValues": 3,
      "periodDatalogTransmission": {
        "value": 360,
        "unit": "minutes"
      },
      "pendingJoin": "no join programmed",
      "enableNfcDiscover": "discoverable",
      "downlinkFcnt": 112,
      "enableRoomPresence": "off",
      "periodWithoutMotion": {
        "value": 20,
        "unit": "minutes"
      },
      "enableFuota": "on",
      "isFuotaPending": "false"
    }
  }
}
```

### C5 — Product configuration — VISTA RISE, reconfigured by downlink FCnt 5, automatic calibration off, thresholds 1000 / 1600 ppm, orange LED off, delta CO2 disabled, delta 1 °C

Payload (hex): `DB60246428106A7F8A861030000280`

```json
{
  "type": "uplink",
  "description": "C5 — Product configuration — VISTA RISE, reconfigured by downlink FCnt 5, automatic calibration off, thresholds 1000 / 1600 ppm, orange LED off, delta CO2 disabled, delta 1 °C",
  "input": {
    "bytes": [219, 96, 36, 100, 40, 16, 106, 127, 138, 134, 16, 48, 0, 2, 128],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA RISE",
      "typeOfMessage": "Product Configuration",
      "versionOfMessage": 0,
      "reconfigurationSource": "downlink",
      "reconfigurationStatus": "total success",
      "enableCo2": "on",
      "enableAutomaticCo2Calibration": "off",
      "thresholdCo2Medium": {
        "value": 1000,
        "unit": "ppm"
      },
      "thresholdCo2High": {
        "value": 1600,
        "unit": "ppm"
      },
      "enableLedCo2": "on",
      "enableLedMediumLevel": "off",
      "protocolAndRegion": "LR-EU868",
      "enablePeriodicData": "on",
      "periodPeriodicTransmission": {
        "value": 20,
        "unit": "minutes"
      },
      "deltaCo2": "desactivated",
      "deltaTemperature": {
        "value": 1,
        "unit": "°C"
      },
      "enableDatalogCo2": "on",
      "enableDatalogTemperature": "off",
      "enableDatalogHumidity": "off",
      "datalogNewValues": 6,
      "datalogRepeatValues": 2,
      "periodDatalogTransmission": {
        "value": 60,
        "unit": "minutes"
      },
      "pendingJoin": "no join programmed",
      "enableNfcDiscover": "discoverable",
      "downlinkFcnt": 5,
      "enableFuota": "off",
      "isFuotaPending": "false"
    }
  }
}
```

---

## Frame 0x7 — Presence Alert

### A1 — Presence alert — VISTA SPACE, room vacant (no motion for the configured period)

Payload (hex): `DA7080`

```json
{
  "type": "uplink",
  "description": "A1 — Presence alert — VISTA SPACE, room vacant (no motion for the configured period)",
  "input": {
    "bytes": [218, 112, 128],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA SPACE",
      "typeOfMessage": "Presence Alert",
      "versionOfMessage": 0,
      "presence": "absent"
    }
  }
}
```

### A2 — Presence alert — VISTA MOVE, room occupied again

Payload (hex): `D87000`

```json
{
  "type": "uplink",
  "description": "A2 — Presence alert — VISTA MOVE, room occupied again",
  "input": {
    "bytes": [216, 112, 0],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA MOVE",
      "typeOfMessage": "Presence Alert",
      "versionOfMessage": 0,
      "presence": "presence"
    }
  }
}
```

---

## Reserved message type

### R1 — Reserved message type — VISTA WAVE, reserved message type 0x8: only the product and "Reserved" are returned

Payload (hex): `D980`

```json
{
  "type": "uplink",
  "description": "R1 — Reserved message type — VISTA WAVE, reserved message type 0x8: only the product and \"Reserved\" are returned",
  "input": {
    "bytes": [217, 128],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA WAVE",
      "typeOfMessage": "Reserved"
    }
  }
}
```

---

## Frames captured on a device

### M1 — Captured frame — Periodic data — VISTA MOVE, 21.7 °C, 44.1 %RH, 2645 lux, no activity, absence

Payload (hex): `D810815B984400`

```json
{
  "type": "uplink",
  "description": "M1 — Captured frame — Periodic data — VISTA MOVE, 21.7 °C, 44.1 %RH, 2645 lux, no activity, absence",
  "input": {
    "bytes": [216, 16, 129, 91, 152, 68, 0],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA MOVE",
      "typeOfMessage": "Periodic Data",
      "versionOfMessage": 0,
      "temperature": {
        "value": 21.7,
        "unit": "°C"
      },
      "humidity": {
        "value": 44.1,
        "unit": "%RH"
      },
      "luminosity": {
        "value": 2645,
        "unit": "lux"
      },
      "activityIndex": {
        "value": 0,
        "unit": "%"
      },
      "presence": "absent"
    }
  }
}
```

### M2 — Captured frame — Presence alert — VISTA MOVE, room vacant

Payload (hex): `D87080`

```json
{
  "type": "uplink",
  "description": "M2 — Captured frame — Presence alert — VISTA MOVE, room vacant",
  "input": {
    "bytes": [216, 112, 128],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA MOVE",
      "typeOfMessage": "Presence Alert",
      "versionOfMessage": 0,
      "presence": "absent"
    }
  }
}
```

### M3 — Captured frame — Product configuration — VISTA MOVE, reconfigured by downlink FCnt 23, periodic data every 10 min, delta 0.5 °C, datalog off, presence alert after 5 min

Payload (hex): `D860243282861890000BC500`

```json
{
  "type": "uplink",
  "description": "M3 — Captured frame — Product configuration — VISTA MOVE, reconfigured by downlink FCnt 23, periodic data every 10 min, delta 0.5 °C, datalog off, presence alert after 5 min",
  "input": {
    "bytes": [216, 96, 36, 50, 130, 134, 24, 144, 0, 11, 197, 0],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA MOVE",
      "typeOfMessage": "Product Configuration",
      "versionOfMessage": 0,
      "reconfigurationSource": "downlink",
      "reconfigurationStatus": "total success",
      "enableMotion": "on",
      "protocolAndRegion": "LR-EU868",
      "enablePeriodicData": "on",
      "periodPeriodicTransmission": {
        "value": 10,
        "unit": "minutes"
      },
      "deltaTemperature": {
        "value": 0.5,
        "unit": "°C"
      },
      "enableDatalogTemperature": "off",
      "enableDatalogHumidity": "off",
      "datalogNewValues": 6,
      "datalogRepeatValues": 3,
      "periodDatalogTransmission": {
        "value": 180,
        "unit": "minutes"
      },
      "pendingJoin": "no join programmed",
      "enableNfcDiscover": "discoverable",
      "downlinkFcnt": 23,
      "enableRoomPresence": "on",
      "periodWithoutMotion": {
        "value": 5,
        "unit": "minutes"
      },
      "enableFuota": "off",
      "isFuotaPending": "false"
    }
  }
}
```

### M4 — Captured frame — Product status — VISTA MOVE, hardware 1, software 11, battery high (2980 mV), just removed from its base, bootloader 22

Payload (hex): `D850010B950000FF990580`

```json
{
  "type": "uplink",
  "description": "M4 — Captured frame — Product status — VISTA MOVE, hardware 1, software 11, battery high (2980 mV), just removed from its base, bootloader 22",
  "input": {
    "bytes": [216, 80, 1, 11, 149, 0, 0, 255, 153, 5, 128],
    "fPort": 56,
    "recvTime": "2026-11-13T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "VISTA MOVE",
      "typeOfMessage": "Product Status",
      "versionOfMessage": 0,
      "hardwareVersion": 1,
      "softwareVersion": 11,
      "batteryVoltage": {
        "value": 2980,
        "unit": "mV"
      },
      "batteryLevel": "high",
      "statusProduct": "ok",
      "timeActivation": {
        "value": 0,
        "unit": "month"
      },
      "timeCo2LastCalibration": "error",
      "statusAntiTear": "just removed from the base",
      "lowBatterieThreshold": {
        "value": 2500,
        "unit": "mV"
      },
      "bootloaderVersion": 22
    }
  }
}
```
