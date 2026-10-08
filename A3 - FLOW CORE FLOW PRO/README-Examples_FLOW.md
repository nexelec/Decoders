# FLOW CORE / FLOW PRO — Uplink Examples

Example uplink payloads for every frame type and every version handled by `decoderFlow.js` **1.1.0**, with the output returned by the decoder.

> **Synthetic frames.** These payloads are built bit by bit from the layout of [README-Frames_FLOW.md](README-Frames_FLOW.md) with realistic values, then decoded with `decoderFlow.js`. They are meant to validate a decoder integration; they are not captures from devices in the field.

All frames are sent on **FPort 56**. The same list is available in machine-readable form in [`examples_FLOW.json`](examples_FLOW.json) (`payload` = hex string, `decoded` = exact decoder output).

## Summary

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

---

## Frame 0x01 — Periodic Data

### P1 — Periodic v1 — FLOW CORE, comfort mode on schedule, 21.3 °C for a 21 °C setpoint

```
D211806A2032992464
```

```json
{
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
```

### P2 — Periodic v1 — FLOW PRO, regulating on a NODE One probe, eco mode, setpoint changed with the wheel

```
D6117CA65F844B0246
```

```json
{
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
```

### P3 — Periodic v1 — FLOW CORE, open window detected (regulation paused, valve closed)

```
D21173AA1CC200000E
```

```json
{
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
```

### P4 — Periodic v1 — FLOW PRO, BOOST triggered by downlink (valve fully open)

```
D611796A1E59450C8C
```

```json
{
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
```

### P5 — Periodic v1 — FLOW CORE, clock not set: degraded mode, setpoint forced to 19.5 °C

```
D2117AE71EBA834382
```

```json
{
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
```

### P6 — Periodic v1 — FLOW CORE, temperature sensor error (1023), regulation off

```
D211FFE83FF0000000
```

```json
{
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
```

### P7 — Periodic v0 — FLOW CORE, older firmware, normal regulation

```
D2107D681F522EE150
```

```json
{
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
```

### P8 — Periodic v0 — FLOW PRO, older firmware, open window flag set

```
D61071AA1C63000000
```

```json
{
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
```

---

## Frame 0x02 — Product Status

### S1 — Product status — FLOW CORE, batteries OK, head on its base, calibrated, NODE One paired

```
D220030C9DA7408A8C00E0BECBD0
```

```json
{
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
```

### S2 — Product status — FLOW PRO, low battery, head just removed from its base (calibration cleared)

```
D620030C93A4C93A8C01C0E001A0
```

```json
{
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
```

### S3 — Product status — FLOW CORE, no battery in slot 2 (1021)

```
D220030C9C3FD08A8C00402A7380
```

```json
{
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
```

### S4 — Product status — FLOW CORE, status version 1 with the bootloader version (10)

```
D221030C9DA7408A8C00E0BECBD0A0
```

```json
{
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
```

---

## Frame 0x03 — NODE One Status

### N1 — NODE One status — FLOW CORE with a paired NODE One probe, good radio link

```
D23001E24044B11C9C
```

```json
{
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
```

---

## Frame 0x04 — Product Configuration

### C0 — Configuration v0 — FLOW CORE, older firmware, sent at start-up

```
D24041062F693AA79955140C85A0000D053D00140000
```

```json
{
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
```

### C1 — Configuration v1 — FLOW PRO, after an application downlink (FCnt 57)

```
D64121062F693AA79905AA28190B40001A0A7A00280072
```

```json
{
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
```

### C2 — Configuration v2 — FLOW CORE, weekly periodic resend, BOOST 30 min

```
D242A1062F693AA79905AA28190B40001A0A7A002800013C00
```

```json
{
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
```

### C3 — Configuration v3 — FLOW PRO, start-up, vertical setpoint display, FUOTA off

```
D64341062F693AA79905AA28190B40001A0A7A002800013C01
```

```json
{
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
```

### C4 — Configuration v3 — FLOW PRO, after downlink 0x9B: deferred FUOTA activation pending

```
D64321062F693AA79905AA28190B40001A0A7A002800013C0180
```

```json
{
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
```

---

## Frames 0x05 / 0x06 / 0x07 — Daily Profiles

### D1 — Daily profile 1 — weekday: comfort 06:30-08:30 and 17:00-22:30, eco otherwise

```
D25045555554AB555555552AAAAB50
```

```json
{
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
```

### D2 — Daily profile 2 — weekend: comfort 08:00-23:00, eco otherwise

```
D2604555555552AAAAAAAAAAAAAAD0
```

```json
{
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
```

### D3 — Daily profile 3 — extended absence all day

```
D27027FFFFFFFFFFFFFFFFFFFFFFF8
```

```json
{
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
```
