
# VISTA SPACE / FEEL / MOVE / WAVE / RISE — Frame Decoding Reference (LoRaWAN Uplink 0x1–0x7)

This document details the **uplink frame structures** of VISTA for LoRaWAN operation, plus the downlink command set.  
Reference: technical guide **D1196A — revision A** (21/10/2026) and decoder `decoderVista.js` **1.0.0**. The last column gives the field name output by the decoder.

---

## 1. Conventions

- Product type: **0xDA (SPACE)** / **0xD7 (FEEL)** / **0xD8 (MOVE)** / **0xD9 (WAVE)** / **0xDB (RISE)**
- Byte 1 is split in two nibbles: **message type** (bits 8–11) and **message version** (bits 12–15)
- All offsets and sizes are expressed in **bits**, MSB first; fields are not byte aligned
- Unused bits at the end of a frame are set to 0 to complete the last byte
- All messages are transmitted on **FPort 56**
- Temperatures use a 30 °C offset (0 = -30 °C, 300 = 0 °C, 1000 = 70 °C)
- Sensor codes on 10-bit measures: **1023** error, **1022** sensor not present, **1021** sensor disabled, **1020** end of life (CO2 only). Same codes on the 14-bit CO2 (16383 … 16380) and the 7-bit activity index (127 … 125)

---

## 2. Frame 0x1 — Periodic Data

### VISTA SPACE (0xDA)

| Offset | Size (bit) | Field | Description | Range | Scale | Unit | Output |
|--------:|-----------:|-------|-------------|-------|-------|------|--------|
| 0 | 8 | Product Type | 0xDA | — | — | — | `typeOfProduct` |
| 8 | 4 | Message Type | 0x1 | — | — | — | `typeOfMessage` |
| 12 | 4 | Version | Message version | 0–15 | — | — | `versionOfMessage` |
| 16 | 10 | Luminosity | Luminosity | 0–1020 | 5 | lux | `luminosity` |
| 26 | 1 | Reserved | — | — | — | — | — |
| 27 | 7 | Activity Index | 0 = low activity, 100 = high activity | 0–100 | 1 | % | `activityIndex` |
| 34 | 1 | Presence Flag | 0 = absence, 1 = presence | — | — | — | `presence` |

### VISTA FEEL (0xD7)

| Offset | Size (bit) | Field | Description | Range | Scale | Unit | Output |
|--------:|-----------:|-------|-------------|-------|-------|------|--------|
| 0 | 8 | Product Type | 0xD7 | — | — | — | `typeOfProduct` |
| 8 | 4 | Message Type | 0x1 | — | — | — | `typeOfMessage` |
| 12 | 4 | Version | Message version | 0–15 | — | — | `versionOfMessage` |
| 16 | 10 | Temperature | 30 °C offset | 0–1000 | 0.1 | °C | `temperature` |
| 26 | 10 | Humidity | Relative humidity | 0–1000 | 0.1 | %RH | `humidity` |

### VISTA MOVE (0xD8)

| Offset | Size (bit) | Field | Description | Range | Scale | Unit | Output |
|--------:|-----------:|-------|-------------|-------|-------|------|--------|
| 0 | 8 | Product Type | 0xD8 | — | — | — | `typeOfProduct` |
| 8 | 4 | Message Type | 0x1 | — | — | — | `typeOfMessage` |
| 12 | 4 | Version | Message version | 0–15 | — | — | `versionOfMessage` |
| 16 | 10 | Temperature | 30 °C offset | 0–1000 | 0.1 | °C | `temperature` |
| 26 | 10 | Humidity | Relative humidity | 0–1000 | 0.1 | %RH | `humidity` |
| 36 | 10 | Luminosity | Luminosity | 0–1020 | 5 | lux | `luminosity` |
| 46 | 1 | Reserved | — | — | — | — | — |
| 47 | 7 | Activity Index | 0 = low activity, 100 = high activity | 0–100 | 1 | % | `activityIndex` |
| 54 | 1 | Presence Flag | 0 = absence, 1 = presence | — | — | — | `presence` |

### VISTA WAVE (0xD9)

| Offset | Size (bit) | Field | Description | Range | Scale | Unit | Output |
|--------:|-----------:|-------|-------------|-------|-------|------|--------|
| 0 | 8 | Product Type | 0xD9 | — | — | — | `typeOfProduct` |
| 8 | 4 | Message Type | 0x1 | — | — | — | `typeOfMessage` |
| 12 | 4 | Version | Message version | 0–15 | — | — | `versionOfMessage` |
| 16 | 10 | Temperature | 30 °C offset | 0–1000 | 0.1 | °C | `temperature` |
| 26 | 10 | Humidity | Relative humidity | 0–1000 | 0.1 | %RH | `humidity` |
| 36 | 14 | CO2 | CO2 concentration | 0–10000 | 1 | ppm | `co2` |
| 50 | 10 | Luminosity | Luminosity | 0–1020 | 5 | lux | `luminosity` |
| 60 | 1 | Reserved | — | — | — | — | — |
| 61 | 7 | Activity Index | 0 = low activity, 100 = high activity | 0–100 | 1 | % | `activityIndex` |
| 68 | 1 | Presence Flag | 0 = absence, 1 = presence | — | — | — | `presence` |

### VISTA RISE (0xDB)

| Offset | Size (bit) | Field | Description | Range | Scale | Unit | Output |
|--------:|-----------:|-------|-------------|-------|-------|------|--------|
| 0 | 8 | Product Type | 0xDB | — | — | — | `typeOfProduct` |
| 8 | 4 | Message Type | 0x1 | — | — | — | `typeOfMessage` |
| 12 | 4 | Version | Message version | 0–15 | — | — | `versionOfMessage` |
| 16 | 10 | Temperature | 30 °C offset | 0–1000 | 0.1 | °C | `temperature` |
| 26 | 10 | Humidity | Relative humidity | 0–1000 | 0.1 | %RH | `humidity` |
| 36 | 14 | CO2 | CO2 concentration | 0–10000 | 1 | ppm | `co2` |

---

## 3. Frames 0x2 / 0x3 / 0x4 — Historical Data (datalog)

Products: FEEL, MOVE, WAVE, RISE (CO2 datalog on WAVE and RISE only). Measures are ordered from the most recent (value n) to the oldest.

| Offset | Size (bit) | Field | Description | Range | Scale | Unit | Output |
|--------:|-----------:|-------|-------------|-------|-------|------|--------|
| 0 | 8 | Product Type | 0xD7 / 0xD8 / 0xD9 / 0xDB | — | — | — | `typeOfProduct` |
| 8 | 4 | Message Type | 0x2 = CO2, 0x3 = temperature, 0x4 = humidity | — | — | — | `typeOfMessage` |
| 12 | 4 | Version | Message version | 0–15 | — | — | `versionOfMessage` |
| 16 | 6 | Number of Measures | Total number of measures in the frame | 1–36 | 1 | — | `newMeasure` |
| 22 | 8 | Period Between Measures | Time between two measures | 1–144 | 10 | min | `periodBetweenMeasure` |
| 30 | 6 | Repetition | Number of transmissions of a same measure | 1–24 | 1 | — | `redundancy` |
| 36 | 10 | Measure [n] | Most recent measure | see below | | | `co2` / `temperature` / `humidity` (array) |
| 46 | 10 | Measure [n-1] | Previous measure | see below | | | |
| … | 10 | Measure [n-x] | … | see below | | | |
| … | … | Unused | Bits set to 0 to complete the last byte | — | — | — | — |

| Measure | Coding (10 bits) | Range | Unit |
|---|---|---|---|
| CO2 | 5 ppm resolution | 0–1000 → 0–5000 | ppm |
| Temperature | 0.1 °C, 30 °C offset | 0–1000 → -30 … 70 | °C |
| Humidity | 0.1 %RH | 0–1000 → 0–100 | %RH |

---

## 4. Frame 0x5 — Product Status

Same layout for every product.

| Offset | Size (bit) | Field | Description | Range | Scale | Unit | Output |
|--------:|-----------:|-------|-------------|-------|-------|------|--------|
| 0 | 8 | Product Type | 0xDA / 0xD7 / 0xD8 / 0xD9 / 0xDB | — | — | — | `typeOfProduct` |
| 8 | 4 | Message Type | 0x5 | — | — | — | `typeOfMessage` |
| 12 | 4 | Version | Message version | 0–15 | — | — | `versionOfMessage` |
| 16 | 8 | Hardware Version | e.g. 5 for V005 | 0–250 | — | — | `hardwareVersion` |
| 24 | 8 | Software Version | e.g. 123 for V12.3 | 0–250 | — | — | `softwareVersion` |
| 32 | 10 | Battery Voltage | Battery voltage | 0–1000<br>1022 : Reserved<br>1023 : Error | 5 | mV | `batteryVoltage` |
| 42 | 3 | Battery Level | 0 = high (> 50 %), 1 = medium (10–50 %), 2 = low (1–10 %), 3 = critical (< 1 %), 4–7 = reserved | — | — | — | `batteryLevel` |
| 45 | 1 | Product Status | 0 = hardware OK, 1 = hardware fault | — | — | — | `statusProduct` |
| 46 | 10 | Activation Time Counter | Cumulated activation time | 0–1000<br>1023 : Error | 1 | months | `timeActivation` |
| 56 | 8 | Time Since Last Manual CO2 Calibration | Days since the last manual calibration; always 255 on SPACE, FEEL and MOVE | 0–250<br>255 : Error | 1 | days | `timeCo2LastCalibration` |
| 64 | 2 | Anti-Tear Status | 0 = base not detected, 1 = base detected, 2 = just removed from the base, 3 = just installed on the base | — | — | — | `statusAntiTear` |
| 66 | 8 | Low Battery Threshold | 5 mV resolution, 2000 mV offset (2000–2550 mV) | 0–110 | 5 | mV | *not output* |
| 74 | 8 | Bootloader Version | Bootloader version | 0–250 | — | — | `bootloaderVersion` |

---

## 5. Frame 0x6 — Product Configuration

Common values:
- **Reconfiguration Source:** 0 = NFC, 1 = application downlink, 2 = product startup, 3–4 = reserved, 5 = periodic (every 7 days), 6–7 = reserved
- **Reconfiguration Status:** 0 = total success, 1 = partial success, 2 = total failure, 3 = reserved
- **Protocol & Region:** 1 = LR-EU868, 2–15 = reserved
- **NFC Status:** 0 = discoverable, 1 = not discoverable, 2–3 = reserved
- **On / Off flags:** 0 = disabled, 1 = enabled

### VISTA SPACE (0xDA)

| Offset | Size (bit) | Field | Description | Range | Scale | Unit | Output |
|--------:|-----------:|-------|-------------|-------|-------|------|--------|
| 0 | 8 | Product Type | 0xDA | — | — | — | `typeOfProduct` |
| 8 | 4 | Message Type | 0x6 | — | — | — | `typeOfMessage` |
| 12 | 4 | Version | Message version | 0–15 | — | — | `versionOfMessage` |
| 16 | 3 | Reconfiguration Source | see above | — | — | — | `reconfigurationSource` |
| 19 | 2 | Reconfiguration Status | see above | — | — | — | `reconfigurationStatus` |
| 21 | 1 | PIR On / Off | Motion sensor | — | — | — | `enableMotion` |
| 22 | 1 | Reserved | — | — | — | — | — |
| 23 | 4 | Protocol & Region | see above | — | — | — | `protocolAndRegion` |
| 27 | 1 | Periodic Data On / Off | Periodic transmission | — | — | — | `enablePeriodicData` |
| 28 | 6 | Periodic Data Period | Periodic transmission period | 10–60 | 1 | min | `periodPeriodicTransmission` |
| 34 | 1 | Deferred Network Connection | 0 = no request pending, 1 = join scheduled | — | — | — | `pendingJoin` |
| 35 | 2 | NFC Status | see above | — | — | — | `enableNfcDiscover` |
| 37 | 16 | Downlink FCnt | FCnt of the downlink that triggered the reconfiguration | — | — | — | `downlinkFcnt` |
| 53 | 1 | Presence Alert On / Off | Presence alert function | — | — | — | `enableRoomPresence` |
| 54 | 6 | Period Without Motion | No-motion time before a "vacant" alert | 5–60 | 1 | min | `periodWithoutMotion` |
| 60 | 1 | FUOTA Mode | 0 = inactive, 1 = firmware update in progress | — | — | — | `enableFuota` |
| 61 | 1 | Deferred FUOTA Activation | 0 = no request, 1 = FUOTA activation scheduled | — | — | — | `isFuotaPending` |

### VISTA FEEL (0xD7)

| Offset | Size (bit) | Field | Description | Range | Scale | Unit | Output |
|--------:|-----------:|-------|-------------|-------|-------|------|--------|
| 0 | 8 | Product Type | 0xD7 | — | — | — | `typeOfProduct` |
| 8 | 4 | Message Type | 0x6 | — | — | — | `typeOfMessage` |
| 12 | 4 | Version | Message version | 0–15 | — | — | `versionOfMessage` |
| 16 | 3 | Reconfiguration Source | see above | — | — | — | `reconfigurationSource` |
| 19 | 2 | Reconfiguration Status | see above | — | — | — | `reconfigurationStatus` |
| 21 | 1 | Reserved | — | — | — | — | — |
| 22 | 4 | Protocol & Region | see above | — | — | — | `protocolAndRegion` |
| 26 | 1 | Periodic Data On / Off | Periodic transmission | — | — | — | `enablePeriodicData` |
| 27 | 6 | Periodic Data Period | Periodic transmission period | 10–60 | 1 | min | `periodPeriodicTransmission` |
| 33 | 7 | Delta Temperature | Change triggering an immediate transmission | 0–99<br>127 : Disabled | 0.1 | °C | `deltaTemperature` |
| 40 | 1 | Temperature Datalog On / Off | Temperature historical data | — | — | — | `enableDatalogTemperature` |
| 41 | 6 | Datalog New Measures | New measures per datalog frame | 1–36 | 1 | — | `datalogNewValues` |
| 47 | 5 | Datalog Repetitions | Transmissions of a same measure | 1–24 | 1 | — | `datalogRepeatValues` |
| 52 | 8 | Datalog Period | Datalog transmission period | 3–144<br>255 : Error | 10 | min | `periodDatalogTransmission` |
| 60 | 1 | Deferred Network Connection | 0 = no request pending, 1 = join scheduled | — | — | — | `pendingJoin` |
| 61 | 2 | NFC Status | see above | — | — | — | `enableNfcDiscover` |
| 63 | 1 | Humidity Datalog On / Off | Humidity historical data | — | — | — | `enableDatalogHumidity` |
| 64 | 16 | Downlink FCnt | FCnt of the downlink that triggered the reconfiguration | — | — | — | `downlinkFcnt` |
| 80 | 1 | FUOTA Mode | 0 = inactive, 1 = firmware update in progress | — | — | — | `enableFuota` |
| 81 | 1 | Deferred FUOTA Activation | 0 = no request, 1 = FUOTA activation scheduled | — | — | — | `isFuotaPending` |

### VISTA MOVE (0xD8)

| Offset | Size (bit) | Field | Description | Range | Scale | Unit | Output |
|--------:|-----------:|-------|-------------|-------|-------|------|--------|
| 0 | 8 | Product Type | 0xD8 | — | — | — | `typeOfProduct` |
| 8 | 4 | Message Type | 0x6 | — | — | — | `typeOfMessage` |
| 12 | 4 | Version | Message version | 0–15 | — | — | `versionOfMessage` |
| 16 | 3 | Reconfiguration Source | see above | — | — | — | `reconfigurationSource` |
| 19 | 2 | Reconfiguration Status | see above | — | — | — | `reconfigurationStatus` |
| 21 | 1 | PIR On / Off | Motion sensor | — | — | — | `enableMotion` |
| 22 | 1 | Reserved | — | — | — | — | — |
| 23 | 4 | Protocol & Region | see above | — | — | — | `protocolAndRegion` |
| 27 | 1 | Periodic Data On / Off | Periodic transmission | — | — | — | `enablePeriodicData` |
| 28 | 6 | Periodic Data Period | Periodic transmission period | 10–60 | 1 | min | `periodPeriodicTransmission` |
| 34 | 7 | Delta Temperature | Change triggering an immediate transmission | 0–99<br>127 : Disabled | 0.1 | °C | `deltaTemperature` |
| 41 | 1 | Temperature Datalog On / Off | Temperature historical data | — | — | — | `enableDatalogTemperature` |
| 42 | 6 | Datalog New Measures | New measures per datalog frame | 1–36 | 1 | — | `datalogNewValues` |
| 48 | 5 | Datalog Repetitions | Transmissions of a same measure | 1–24 | 1 | — | `datalogRepeatValues` |
| 53 | 8 | Datalog Period | Datalog transmission period | 3–144<br>255 : Error | 10 | min | `periodDatalogTransmission` |
| 61 | 1 | Deferred Network Connection | 0 = no request pending, 1 = join scheduled | — | — | — | `pendingJoin` |
| 62 | 2 | NFC Status | see above | — | — | — | `enableNfcDiscover` |
| 64 | 1 | Humidity Datalog On / Off | Humidity historical data | — | — | — | `enableDatalogHumidity` |
| 65 | 16 | Downlink FCnt | FCnt of the downlink that triggered the reconfiguration | — | — | — | `downlinkFcnt` |
| 81 | 1 | Presence Alert On / Off | Presence alert function | — | — | — | `enableRoomPresence` |
| 82 | 6 | Period Without Motion | No-motion time before a "vacant" alert | 5–60 | 1 | min | `periodWithoutMotion` |
| 88 | 1 | FUOTA Mode | 0 = inactive, 1 = firmware update in progress | — | — | — | `enableFuota` |
| 89 | 1 | Deferred FUOTA Activation | 0 = no request, 1 = FUOTA activation scheduled | — | — | — | `isFuotaPending` |

### VISTA WAVE (0xD9)

| Offset | Size (bit) | Field | Description | Range | Scale | Unit | Output |
|--------:|-----------:|-------|-------------|-------|-------|------|--------|
| 0 | 8 | Product Type | 0xD9 | — | — | — | `typeOfProduct` |
| 8 | 4 | Message Type | 0x6 | — | — | — | `typeOfMessage` |
| 12 | 4 | Version | Message version | 0–15 | — | — | `versionOfMessage` |
| 16 | 3 | Reconfiguration Source | see above | — | — | — | `reconfigurationSource` |
| 19 | 2 | Reconfiguration Status | see above | — | — | — | `reconfigurationStatus` |
| 21 | 1 | CO2 On / Off | CO2 measurement | — | — | — | `enableCo2` |
| 22 | 1 | PIR On / Off | Motion sensor | — | — | — | `enableMotion` |
| 23 | 1 | CO2 Automatic Calibration | ABC calibration | — | — | — | `enableAutomaticCo2Calibration` |
| 24 | 10 | CO2 Medium Level | Threshold between "good" and "medium" | 0–1000 | 5 | ppm | `thresholdCo2Medium` |
| 34 | 10 | CO2 High Level | Threshold between "medium" and "high" | 0–1000 | 5 | ppm | `thresholdCo2High` |
| 44 | 1 | CO2 LED | LED indicating the CO2 level | — | — | — | `enableLedCo2` |
| 45 | 1 | LED Medium Level | Orange LED for the medium CO2 level | — | — | — | `enableLedMediumLevel` |
| 46 | 1 | Reserved | — | — | — | — | — |
| 47 | 4 | Protocol & Region | see above | — | — | — | `protocolAndRegion` |
| 51 | 1 | Periodic Data On / Off | Periodic transmission | — | — | — | `enablePeriodicData` |
| 52 | 6 | Periodic Data Period | Periodic transmission period | 10–60 | 1 | min | `periodPeriodicTransmission` |
| 58 | 8 | Delta CO2 | Change triggering an immediate transmission | 0–250<br>255 : Disabled | 4 | ppm | `deltaCo2` |
| 66 | 7 | Delta Temperature | Change triggering an immediate transmission | 0–99<br>127 : Disabled | 0.1 | °C | `deltaTemperature` |
| 73 | 1 | CO2 Datalog On / Off | CO2 historical data | — | — | — | `enableDatalogCo2` |
| 74 | 1 | Temperature Datalog On / Off | Temperature historical data | — | — | — | `enableDatalogTemperature` |
| 75 | 6 | Datalog New Measures | New measures per datalog frame | 1–36 | 1 | — | `datalogNewValues` |
| 81 | 5 | Datalog Repetitions | Transmissions of a same measure | 1–24 | 1 | — | `datalogRepeatValues` |
| 86 | 8 | Datalog Period | Datalog transmission period | 3–144<br>255 : Error | 10 | min | `periodDatalogTransmission` |
| 94 | 1 | Deferred Network Connection | 0 = no request pending, 1 = join scheduled | — | — | — | `pendingJoin` |
| 95 | 2 | NFC Status | see above | — | — | — | `enableNfcDiscover` |
| 97 | 1 | Humidity Datalog On / Off | Humidity historical data | — | — | — | `enableDatalogHumidity` |
| 98 | 16 | Downlink FCnt | FCnt of the downlink that triggered the reconfiguration | — | — | — | `downlinkFcnt` |
| 114 | 1 | Presence Alert On / Off | Presence alert function | — | — | — | `enableRoomPresence` |
| 115 | 6 | Period Without Motion | No-motion time before a "vacant" alert | 5–60 | 1 | min | `periodWithoutMotion` |
| 121 | 1 | FUOTA Mode | 0 = inactive, 1 = firmware update in progress | — | — | — | `enableFuota` |
| 122 | 1 | Deferred FUOTA Activation | 0 = no request, 1 = FUOTA activation scheduled | — | — | — | `isFuotaPending` |

### VISTA RISE (0xDB)

| Offset | Size (bit) | Field | Description | Range | Scale | Unit | Output |
|--------:|-----------:|-------|-------------|-------|-------|------|--------|
| 0 | 8 | Product Type | 0xDB | — | — | — | `typeOfProduct` |
| 8 | 4 | Message Type | 0x6 | — | — | — | `typeOfMessage` |
| 12 | 4 | Version | Message version | 0–15 | — | — | `versionOfMessage` |
| 16 | 3 | Reconfiguration Source | see above | — | — | — | `reconfigurationSource` |
| 19 | 2 | Reconfiguration Status | see above | — | — | — | `reconfigurationStatus` |
| 21 | 1 | CO2 On / Off | CO2 measurement | — | — | — | `enableCo2` |
| 22 | 1 | CO2 Automatic Calibration | ABC calibration | — | — | — | `enableAutomaticCo2Calibration` |
| 23 | 10 | CO2 Medium Level | Threshold between "good" and "medium" | 0–1000 | 5 | ppm | `thresholdCo2Medium` |
| 33 | 10 | CO2 High Level | Threshold between "medium" and "high" | 0–1000 | 5 | ppm | `thresholdCo2High` |
| 43 | 1 | CO2 LED | LED indicating the CO2 level | — | — | — | `enableLedCo2` |
| 44 | 1 | LED Medium Level | Orange LED for the medium CO2 level | — | — | — | `enableLedMediumLevel` |
| 45 | 1 | Reserved | — | — | — | — | — |
| 46 | 4 | Protocol & Region | see above | — | — | — | `protocolAndRegion` |
| 50 | 1 | Periodic Data On / Off | Periodic transmission | — | — | — | `enablePeriodicData` |
| 51 | 6 | Periodic Data Period | Periodic transmission period | 10–60 | 1 | min | `periodPeriodicTransmission` |
| 57 | 8 | Delta CO2 | Change triggering an immediate transmission | 0–250<br>255 : Disabled | 4 | ppm | `deltaCo2` |
| 65 | 7 | Delta Temperature | Change triggering an immediate transmission | 0–99<br>127 : Disabled | 0.1 | °C | `deltaTemperature` |
| 72 | 1 | CO2 Datalog On / Off | CO2 historical data | — | — | — | `enableDatalogCo2` |
| 73 | 1 | Temperature Datalog On / Off | Temperature historical data | — | — | — | `enableDatalogTemperature` |
| 74 | 6 | Datalog New Measures | New measures per datalog frame | 1–36 | 1 | — | `datalogNewValues` |
| 80 | 5 | Datalog Repetitions | Transmissions of a same measure | 1–24 | 1 | — | `datalogRepeatValues` |
| 85 | 8 | Datalog Period | Datalog transmission period | 3–144<br>255 : Error | 10 | min | `periodDatalogTransmission` |
| 93 | 1 | Deferred Network Connection | 0 = no request pending, 1 = join scheduled | — | — | — | `pendingJoin` |
| 94 | 2 | NFC Status | see above | — | — | — | `enableNfcDiscover` |
| 96 | 1 | Humidity Datalog On / Off | Humidity historical data | — | — | — | `enableDatalogHumidity` |
| 97 | 16 | Downlink FCnt | FCnt of the downlink that triggered the reconfiguration | — | — | — | `downlinkFcnt` |
| 113 | 1 | FUOTA Mode | 0 = inactive, 1 = firmware update in progress | — | — | — | `enableFuota` |
| 114 | 1 | Deferred FUOTA Activation | 0 = no request, 1 = FUOTA activation scheduled | — | — | — | `isFuotaPending` |

---

## 6. Frame 0x7 — Presence Alert

Products: SPACE, MOVE, WAVE.

| Offset | Size (bit) | Field | Description | Range | Scale | Unit | Output |
|--------:|-----------:|-------|-------------|-------|-------|------|--------|
| 0 | 8 | Product Type | 0xDA / 0xD8 / 0xD9 | — | — | — | `typeOfProduct` |
| 8 | 4 | Message Type | 0x7 | — | — | — | `typeOfMessage` |
| 12 | 4 | Version | Message version | 0–15 | — | — | `versionOfMessage` |
| 16 | 1 | Presence / Absence | 0 = occupied, 1 = vacant | — | — | — | `presence` (`"presence"` / `"absent"`) |

---

## 7. Downlink Commands

Downlink layout: header **0x55**, then one or more `Command ID + DATA` pairs, sent in ascending ID order, on **FPort 56**.

| ID | Length (bytes) | Range | Values | Description |
|---|---|---|---|---|
| 0x01 | 0 | — | — | Force an immediate configuration uplink |
| 0x03 | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable the CO2 LED indicator |
| 0x05 | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable periodic data |
| 0x08 | 1 | 0–99 | 0–9.9 °C, 0.1 °C step | Delta temperature triggering an immediate transmission |
| 0x0A | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable the NFC interface |
| 0x10 | 1 | 0–50 | 0–1000 ppm, 20 ppm step | Delta CO2 triggering an immediate transmission |
| 0x12 | 1 | 0–250 | 0–5000 ppm, 20 ppm step | CO2 threshold, "orange" level |
| 0x13 | 1 | 0–250 | 0–5000 ppm, 20 ppm step | CO2 threshold, "red" level |
| 0x19 | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable the CO2 measurement |
| 0x1C | 2 | 1–1008 | 10–10080 min | Schedule a deferred network join |
| 0x28 | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable the temperature datalog |
| 0x29 | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable the humidity datalog |
| 0x2E | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable the "orange" level of the CO2 LED |
| 0x49 | 1 | 10–60 | 10–60 min | Periodic data period |
| 0x4A | 1 | 1 | 1 | Reboot the product |
| 0x4B | 1 | 1 | 1 | Restore factory configuration |
| 0x54 | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable the motion sensor (PIR) |
| 0x59 | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable the CO2 automatic calibration |
| 0x5C | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable the CO2 datalog |
| 0x5D | 1 | 1–36 | 1–36 | Number of new measures per datalog frame |
| 0x5E | 1 | 3–144 | 30–1440 min | Datalog transmission period |
| 0x5F | 1 | 1–24 | 1–24 | Number of transmissions of a same measure (datalog) |
| 0x69 | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable the presence alert |
| 0x6A | 1 | 5–60 | 5–60 min | Period without motion before a "vacant" alert |
| 0x97 | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable FUOTA mode |
| 0x9B | 4 | 0 or Unix epoch | Unix epoch UTC in seconds, MSB first, between now − 2 h and now + 7 days<br>0 = cancel the pending request | Deferred FUOTA mode activation: at the scheduled time the product enters FUOTA mode |

**Example — enable the CO2 LED and disable the orange level:** `55 03 01 2E 00`

**Example — enter FUOTA mode on 01/10/2026 at 08:00 UTC:** `55 9B 6A BE 13 00`

---

## 8. Notes

- The CO2 thresholds and delta are coded with a 20 ppm step in downlinks, but reported with a 5 ppm (thresholds) and 4 ppm (delta) step in the configuration frame 0x6.
- A datalog frame holds at most 36 measures in Europe (*new measures × repetitions ≤ 36*).
- Fields may vary by firmware revision; check the frame version nibble before decoding.

---

## 🧾 Additional Resources

- Online decoder: [https://nexelec-support.fr/n/decoder/](https://nexelec-support.fr/n/decoder/)  
- Downlink builder: [https://nexelec-support.fr/n/downlink/](https://nexelec-support.fr/n/downlink/)  
- Technical documentation: [https://support.nexelec.fr](https://support.nexelec.fr)  
- Source document: **D1196A — VISTA Guide Technique, revision A**

---

## 🛠 Maintainer

**Nexelec Support Team**  
Contact: [support@nexelec.fr](mailto:support@nexelec.fr)
