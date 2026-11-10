# ORIGIN+ / ORIGIN / GUARD+ / GUARD — Payload Examples

Examples for the decoder of ORIGIN+ / ORIGIN / GUARD+ / GUARD, in the format of the LoRa Alliance *Payload Codec API* specification (TS013-1.0.0, §6.2.1 "Payload Examples"): every frame type decoded by `decodeUplink` (`decoderOrigin+.js` **2.0.0**), plus the error and warning cases.

> **Synthetic frames.** The payloads are built bit by bit from the layout of [README-Frames_ORIGIN-GUARD.md](README-Frames_ORIGIN-GUARD.md) (technical guide D1035C) with realistic values, then decoded with `decoderOrigin+.js`. They are meant to validate a decoder integration; they are not captures from devices in the field.

All LoRaWAN frames use **FPort 56**. The machine-readable list is [`examples.json`](examples.json); each example below is the corresponding entry of that file, and `output` is always the exact object returned by `decodeUplink`, so the file can be run as a test suite (TS013, Appendix 2 B).

| Property | Content |
|----------|---------|
| `type` | `"uplink"` |
| `description` | Example ID and scenario |
| `input` | `bytes` (payload as an array of numbers), `fPort`, `recvTime` (ISO 8601, not used by the decoder) |
| `output` | `data` (decoded object) and `warnings` when the frame is incomplete, or `errors` only when the frame cannot be decoded |

## Summary

| ID | Frame | Product | Payload (hex) | Scenario |
|----|-------|---------|---------------|----------|
| S1 | 0x00 | ORIGIN+ | `BD00010C7604D2` | ORIGIN+, new product: 118 months left, sensors OK, on its base, battery high (3050 mV) |
| S2 | 0x00 | GUARD+ | `B300020F280A50` | GUARD+, product just removed from its base, battery low (2400 mV) |
| S3 | 0x00 | ORIGIN | `B200010A03D30A` | ORIGIN, smoke chamber and temperature/humidity sensor faulty, base never detected, battery critical |
| C1 | 0x01 | ORIGIN+ | `BD01460030C4824680000C` | ORIGIN+, start-up, datalog on (6 new values × 3, every 3 h), daily air quality on, after downlink FCnt 12 |
| C2 | 0x01 | GUARD | `B4012AA060C93FFFE0FFFF` | GUARD, reconfigured by downlink, partial success, join programmed, NFC non-discoverable, datalog off |
| C3 | 0x01 | ORIGIN+ | `BD01040030C4800020` | ORIGIN+, frame without the Downlink FCnt (9 bytes, older firmware), reconfigured by NFC |
| A1 | 0x02 | ORIGIN+ | `BD024012290180` | ORIGIN+, smoke detected, 21.5 °C |
| A2 | 0x02 | ORIGIN+ | `BD02902868F900` | ORIGIN+, repeated alarm from an interconnected detector, hushed with the main button |
| A3 | 0x02 | GUARD | `B402280201FF00` | GUARD, remote product test just done, no temperature sensor (1022) |
| D1 | 0x03 | ORIGIN+ | `BD0378A167ED31BD70` | ORIGIN+, 18.2 / 23.4 / 20.7 °C and 38 / 55.5 / 46 %RH (min / max / average) |
| D2 | 0x03 | ORIGIN | `B2033F94148FFFFFFC` | ORIGIN, sub-zero temperatures (garage), humidity sensor error (255) |
| P1 | 0x04 | ORIGIN+ | `BD048057C0` | ORIGIN+, 21.3 °C, 47.5 %RH |
| P2 | 0x04 | GUARD+ | `B304FFD900` | GUARD+, temperature error (1023) |
| H1 | 0x05 | ORIGIN+ | `BD05487837F9FC7EDF97E1F87DDF57D1F37C9F27C5F17C1F07BDEF` | ORIGIN+, 18 temperatures every 30 min (6 new values × 3 repetitions), most recent first |
| H2 | 0x05 | GUARD+ | `B30510F01833FF826080` | GUARD+, 4 temperatures every 60 min, one measure in error (1023) |
| E1 | — | — | `BD` | payload shorter than 2 bytes |
| E2 | — | — | `BD0600` | unknown message type 0x06 |
| E3 | — | — | `BD00010C` | product status truncated (4 bytes instead of 7) |
| W1 | 0x05 | ORIGIN+ | `BD05182817D1F57D80` | historical data truncated: 6 measures announced, 3 in the frame |

---

## Frame 0x00 — Product Status

### S1 — Product status — ORIGIN+, new product: 118 months left, sensors OK, on its base, battery high (3050 mV)

Payload (hex): `BD00010C7604D2`

```json
{
  "type": "uplink",
  "description": "S1 — Product status — ORIGIN+, new product: 118 months left, sensors OK, on its base, battery high (3050 mV)",
  "input": {
    "bytes": [189, 0, 1, 12, 118, 4, 210],
    "fPort": 56,
    "recvTime": "2026-11-10T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "ORIGIN+",
      "typeOfMessage": "Product Status",
      "hardwareVersion": 1,
      "softwareVersion": 12,
      "remainingProductLifetime": {
        "value": 118,
        "unit": "month"
      },
      "statusSmokeSensor": "ok",
      "statusTemperatureHumiditySensor": "ok",
      "statusAntiTear": "detected",
      "batteryLevel": "high",
      "batteryVoltage": {
        "value": 3050,
        "unit": "mV"
      }
    }
  }
}
```

### S2 — Product status — GUARD+, product just removed from its base, battery low (2400 mV)

Payload (hex): `B300020F280A50`

```json
{
  "type": "uplink",
  "description": "S2 — Product status — GUARD+, product just removed from its base, battery low (2400 mV)",
  "input": {
    "bytes": [179, 0, 2, 15, 40, 10, 80],
    "fPort": 56,
    "recvTime": "2026-11-10T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "GUARD+",
      "typeOfMessage": "Product Status",
      "hardwareVersion": 2,
      "softwareVersion": 15,
      "remainingProductLifetime": {
        "value": 40,
        "unit": "month"
      },
      "statusSmokeSensor": "ok",
      "statusTemperatureHumiditySensor": "ok",
      "statusAntiTear": "just removed from the base",
      "batteryLevel": "low",
      "batteryVoltage": {
        "value": 2400,
        "unit": "mV"
      }
    }
  }
}
```

### S3 — Product status — ORIGIN, smoke chamber and temperature/humidity sensor faulty, base never detected, battery critical

Payload (hex): `B200010A03D30A`

```json
{
  "type": "uplink",
  "description": "S3 — Product status — ORIGIN, smoke chamber and temperature/humidity sensor faulty, base never detected, battery critical",
  "input": {
    "bytes": [178, 0, 1, 10, 3, 211, 10],
    "fPort": 56,
    "recvTime": "2026-11-10T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "ORIGIN",
      "typeOfMessage": "Product Status",
      "hardwareVersion": 1,
      "softwareVersion": 10,
      "remainingProductLifetime": {
        "value": 3,
        "unit": "month"
      },
      "statusSmokeSensor": "error",
      "statusTemperatureHumiditySensor": "error",
      "statusAntiTear": "never detected",
      "batteryLevel": "critical",
      "batteryVoltage": {
        "value": 2050,
        "unit": "mV"
      }
    }
  }
}
```

## Frame 0x01 — Product Configuration

### C1 — Product configuration — ORIGIN+, start-up, datalog on (6 new values × 3, every 3 h), daily air quality on, after downlink FCnt 12

Payload (hex): `BD01460030C4824680000C`

```json
{
  "type": "uplink",
  "description": "C1 — Product configuration — ORIGIN+, start-up, datalog on (6 new values × 3, every 3 h), daily air quality on, after downlink FCnt 12",
  "input": {
    "bytes": [189, 1, 70, 0, 48, 196, 130, 70, 128, 0, 12],
    "fPort": 56,
    "recvTime": "2026-11-10T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "ORIGIN+",
      "typeOfMessage": "Product Configuration",
      "reconfigurationSource": "start up",
      "reconfigurationStatus": "total success",
      "enableDatalogTemperature": "on",
      "enableDailyAirQuality": "on",
      "pendingJoin": "no join programmed",
      "enableNfcDiscover": "discoverable",
      "datalogNewValues": 6,
      "datalogRepeatValues": 3,
      "periodDatalogTransmission": {
        "value": 180,
        "unit": "minutes"
      },
      "d2dNetworkId": 4660,
      "downlinkFcnt": 12
    }
  }
}
```

### C2 — Product configuration — GUARD, reconfigured by downlink, partial success, join programmed, NFC non-discoverable, datalog off

Payload (hex): `B4012AA060C93FFFE0FFFF`

```json
{
  "type": "uplink",
  "description": "C2 — Product configuration — GUARD, reconfigured by downlink, partial success, join programmed, NFC non-discoverable, datalog off",
  "input": {
    "bytes": [180, 1, 42, 160, 96, 201, 63, 255, 224, 255, 255],
    "fPort": 56,
    "recvTime": "2026-11-10T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "GUARD",
      "typeOfMessage": "Product Configuration",
      "reconfigurationSource": "downlink",
      "reconfigurationStatus": "partial success",
      "enableDatalogTemperature": "off",
      "enableDailyAirQuality": "on",
      "pendingJoin": "join programmed",
      "enableNfcDiscover": "no discoverable",
      "datalogNewValues": 12,
      "datalogRepeatValues": 3,
      "periodDatalogTransmission": {
        "value": 360,
        "unit": "minutes"
      },
      "d2dNetworkId": 131071,
      "downlinkFcnt": 65535
    }
  }
}
```

### C3 — Product configuration — ORIGIN+, frame without the Downlink FCnt (9 bytes, older firmware), reconfigured by NFC

Payload (hex): `BD01040030C4800020`

```json
{
  "type": "uplink",
  "description": "C3 — Product configuration — ORIGIN+, frame without the Downlink FCnt (9 bytes, older firmware), reconfigured by NFC",
  "input": {
    "bytes": [189, 1, 4, 0, 48, 196, 128, 0, 32],
    "fPort": 56,
    "recvTime": "2026-11-10T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "ORIGIN+",
      "typeOfMessage": "Product Configuration",
      "reconfigurationSource": "nfc",
      "reconfigurationStatus": "total success",
      "enableDatalogTemperature": "on",
      "enableDailyAirQuality": "off",
      "pendingJoin": "no join programmed",
      "enableNfcDiscover": "discoverable",
      "datalogNewValues": 6,
      "datalogRepeatValues": 3,
      "periodDatalogTransmission": {
        "value": 180,
        "unit": "minutes"
      },
      "d2dNetworkId": 1
    }
  }
}
```

## Frame 0x02 — Alarm Status

### A1 — Alarm status — ORIGIN+, smoke detected, 21.5 °C

Payload (hex): `BD024012290180`

```json
{
  "type": "uplink",
  "description": "A1 — Alarm status — ORIGIN+, smoke detected, 21.5 °C",
  "input": {
    "bytes": [189, 2, 64, 18, 41, 1, 128],
    "fPort": 56,
    "recvTime": "2026-11-10T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "ORIGIN+",
      "typeOfMessage": "Alarm Status",
      "smokeAlarm": "smoke detected",
      "smokeAlarmHush": "stopped, no more smoke",
      "productTest": "none",
      "timeSinceLastTest": {
        "value": 4,
        "unit": "weeks"
      },
      "isMaintenanceDone": "true",
      "timeSinceLastMaintenance": {
        "value": 20,
        "unit": "weeks"
      },
      "temperature": {
        "value": 21.5,
        "unit": "°C"
      }
    }
  }
}
```

### A2 — Alarm status — ORIGIN+, repeated alarm from an interconnected detector, hushed with the main button

Payload (hex): `BD02902868F900`

```json
{
  "type": "uplink",
  "description": "A2 — Alarm status — ORIGIN+, repeated alarm from an interconnected detector, hushed with the main button",
  "input": {
    "bytes": [189, 2, 144, 40, 104, 249, 0],
    "fPort": 56,
    "recvTime": "2026-11-10T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "ORIGIN+",
      "typeOfMessage": "Alarm Status",
      "smokeAlarm": "repeated alarm",
      "smokeAlarmHush": "stopped by the main button",
      "productTest": "none",
      "timeSinceLastTest": {
        "value": 10,
        "unit": "weeks"
      },
      "isMaintenanceDone": "false",
      "timeSinceLastMaintenance": {
        "value": 52,
        "unit": "weeks"
      },
      "temperature": {
        "value": 19.8,
        "unit": "°C"
      }
    }
  }
}
```

### A3 — Alarm status — GUARD, remote product test just done, no temperature sensor (1022)

Payload (hex): `B402280201FF00`

```json
{
  "type": "uplink",
  "description": "A3 — Alarm status — GUARD, remote product test just done, no temperature sensor (1022)",
  "input": {
    "bytes": [180, 2, 40, 2, 1, 255, 0],
    "fPort": 56,
    "recvTime": "2026-11-10T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "GUARD",
      "typeOfMessage": "Alarm Status",
      "smokeAlarm": "no smoke detected",
      "smokeAlarmHush": "stopped by all the smoke-detecting products",
      "productTest": "remote",
      "timeSinceLastTest": {
        "value": 0,
        "unit": "weeks"
      },
      "isMaintenanceDone": "true",
      "timeSinceLastMaintenance": {
        "value": 0,
        "unit": "weeks"
      },
      "temperature": "Sensor not present"
    }
  }
}
```

## Frame 0x03 — Daily Air Quality

### D1 — Daily air quality — ORIGIN+, 18.2 / 23.4 / 20.7 °C and 38 / 55.5 / 46 %RH (min / max / average)

Payload (hex): `BD0378A167ED31BD70`

```json
{
  "type": "uplink",
  "description": "D1 — Daily air quality — ORIGIN+, 18.2 / 23.4 / 20.7 °C and 38 / 55.5 / 46 %RH (min / max / average)",
  "input": {
    "bytes": [189, 3, 120, 161, 103, 237, 49, 189, 112],
    "fPort": 56,
    "recvTime": "2026-11-10T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "ORIGIN+",
      "typeOfMessage": "Daily Air Quality",
      "temperatureMin": {
        "value": 18.2,
        "unit": "°C"
      },
      "temperatureMax": {
        "value": 23.4,
        "unit": "°C"
      },
      "temperatureAvg": {
        "value": 20.7,
        "unit": "°C"
      },
      "humidityMin": {
        "value": 38,
        "unit": "%RH"
      },
      "humidityMax": {
        "value": 55.5,
        "unit": "%RH"
      },
      "humidityAvg": {
        "value": 46,
        "unit": "%RH"
      }
    }
  }
}
```

### D2 — Daily air quality — ORIGIN, sub-zero temperatures (garage), humidity sensor error (255)

Payload (hex): `B2033F94148FFFFFFC`

```json
{
  "type": "uplink",
  "description": "D2 — Daily air quality — ORIGIN, sub-zero temperatures (garage), humidity sensor error (255)",
  "input": {
    "bytes": [178, 3, 63, 148, 20, 143, 255, 255, 252],
    "fPort": 56,
    "recvTime": "2026-11-10T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "ORIGIN",
      "typeOfMessage": "Daily Air Quality",
      "temperatureMin": {
        "value": -4.6,
        "unit": "°C"
      },
      "temperatureMax": {
        "value": 2.1,
        "unit": "°C"
      },
      "temperatureAvg": {
        "value": -0.9,
        "unit": "°C"
      },
      "humidityMin": "Error",
      "humidityMax": "Error",
      "humidityAvg": "Error"
    }
  }
}
```

## Frame 0x04 — Periodic Data

### P1 — Periodic data — ORIGIN+, 21.3 °C, 47.5 %RH

Payload (hex): `BD048057C0`

```json
{
  "type": "uplink",
  "description": "P1 — Periodic data — ORIGIN+, 21.3 °C, 47.5 %RH",
  "input": {
    "bytes": [189, 4, 128, 87, 192],
    "fPort": 56,
    "recvTime": "2026-11-10T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "ORIGIN+",
      "typeOfMessage": "Periodic Data",
      "temperature": {
        "value": 21.3,
        "unit": "°C"
      },
      "humidity": {
        "value": 47.5,
        "unit": "%RH"
      }
    }
  }
}
```

### P2 — Periodic data — GUARD+, temperature error (1023)

Payload (hex): `B304FFD900`

```json
{
  "type": "uplink",
  "description": "P2 — Periodic data — GUARD+, temperature error (1023)",
  "input": {
    "bytes": [179, 4, 255, 217, 0],
    "fPort": 56,
    "recvTime": "2026-11-10T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "GUARD+",
      "typeOfMessage": "Periodic Data",
      "temperature": "Error",
      "humidity": {
        "value": 50,
        "unit": "%RH"
      }
    }
  }
}
```

## Frame 0x05 — Historical Data

### H1 — Historical data — ORIGIN+, 18 temperatures every 30 min (6 new values × 3 repetitions), most recent first

Payload (hex): `BD05487837F9FC7EDF97E1F87DDF57D1F37C9F27C5F17C1F07BDEF`

```json
{
  "type": "uplink",
  "description": "H1 — Historical data — ORIGIN+, 18 temperatures every 30 min (6 new values × 3 repetitions), most recent first",
  "input": {
    "bytes": [189, 5, 72, 120, 55, 249, 252, 126, 223, 151, 225, 248, 125, 223, 87, 209, 243, 124, 159, 39, 197, 241, 124, 31, 7, 189, 239],
    "fPort": 56,
    "recvTime": "2026-11-10T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "ORIGIN+",
      "typeOfMessage": "Historical Data",
      "newMeasure": 18,
      "periodBetweenMeasure": {
        "value": 30,
        "unit": "minutes"
      },
      "redundancy": 3,
      "temperature": {
        "value": [
          21,
          20.8,
          20.7,
          20.5,
          20.4,
          20.4,
          20.3,
          20.1,
          20,
          19.9,
          19.8,
          19.8,
          19.7,
          19.7,
          19.6,
          19.6,
          19.5,
          19.5
        ],
        "unit": "°C"
      }
    }
  }
}
```

### H2 — Historical data — GUARD+, 4 temperatures every 60 min, one measure in error (1023)

Payload (hex): `B30510F01833FF826080`

```json
{
  "type": "uplink",
  "description": "H2 — Historical data — GUARD+, 4 temperatures every 60 min, one measure in error (1023)",
  "input": {
    "bytes": [179, 5, 16, 240, 24, 51, 255, 130, 96, 128],
    "fPort": 56,
    "recvTime": "2026-11-10T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "GUARD+",
      "typeOfMessage": "Historical Data",
      "newMeasure": 4,
      "periodBetweenMeasure": {
        "value": 60,
        "unit": "minutes"
      },
      "redundancy": 1,
      "temperature": {
        "value": [
          22.4,
          "Error",
          22.1,
          22
        ],
        "unit": "°C"
      }
    }
  }
}
```

## Errors and warnings

Following TS013, a frame that cannot be decoded returns `errors` and no `data`; a frame that can be partly decoded returns `data` with `warnings`.

### E1 — Error — payload shorter than 2 bytes

Payload (hex): `BD`

```json
{
  "type": "uplink",
  "description": "E1 — Error — payload shorter than 2 bytes",
  "input": {
    "bytes": [189],
    "fPort": 56,
    "recvTime": "2026-11-10T10:00:00.000+01:00"
  },
  "output": {
    "errors": [
      "Payload too short: 1 bytes, at least 2 expected"
    ]
  }
}
```

### E2 — Error — unknown message type 0x06

Payload (hex): `BD0600`

```json
{
  "type": "uplink",
  "description": "E2 — Error — unknown message type 0x06",
  "input": {
    "bytes": [189, 6, 0],
    "fPort": 56,
    "recvTime": "2026-11-10T10:00:00.000+01:00"
  },
  "output": {
    "errors": [
      "Unknown message type: 6"
    ]
  }
}
```

### E3 — Error — product status truncated (4 bytes instead of 7)

Payload (hex): `BD00010C`

```json
{
  "type": "uplink",
  "description": "E3 — Error — product status truncated (4 bytes instead of 7)",
  "input": {
    "bytes": [189, 0, 1, 12],
    "fPort": 56,
    "recvTime": "2026-11-10T10:00:00.000+01:00"
  },
  "output": {
    "errors": [
      "Payload too short for message type 0: 4 bytes, 7 expected"
    ]
  }
}
```

### W1 — Warning — historical data truncated: 6 measures announced, 3 in the frame

Payload (hex): `BD05182817D1F57D80`

```json
{
  "type": "uplink",
  "description": "W1 — Warning — historical data truncated: 6 measures announced, 3 in the frame",
  "input": {
    "bytes": [189, 5, 24, 40, 23, 209, 245, 125, 128],
    "fPort": 56,
    "recvTime": "2026-11-10T10:00:00.000+01:00"
  },
  "output": {
    "data": {
      "typeOfProduct": "ORIGIN+",
      "typeOfMessage": "Historical Data",
      "newMeasure": 6,
      "periodBetweenMeasure": {
        "value": 10,
        "unit": "minutes"
      },
      "redundancy": 1,
      "temperature": {
        "value": [
          20,
          20.1,
          20.2
        ],
        "unit": "°C"
      }
    },
    "warnings": [
      "Historical data truncated: 3 measures decoded, 6 announced"
    ]
  }
}
```
