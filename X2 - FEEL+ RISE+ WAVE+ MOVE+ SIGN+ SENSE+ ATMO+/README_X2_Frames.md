# NEXELEC_UPLINK_FRAMES.md

## 📘 Complete Reference of LoRaWAN Uplink Frames for X2 range (EU868)

This document provides a full technical breakdown of the uplink frame structures (messages sent by devices) for the **FEEL+**, **RISE+**, **WAVE+**, **MOVE+**, **SIGN+**, **SENSE+**, and **ATMO+** product lines.

Based on section **XVI.5** of the official Nexelec Technical Guide (EU868 version).

---

## Table of Contents

1. [Historical Data](#1-historical-data)
2. [Periodic Data (FEEL+, RISE+, WAVE+, MOVE+, SIGN+)](#2-periodic-data--feel-rise-wave-move-sign)
3. [Periodic Data (SENSE+, ATMO+)](#3-periodic-data--sense-atmo)
4. [Product Status](#4-product-status)
5. [Product Configuration](#5-product-configuration)
6. [Display Configuration](#6-display-configuration)
7. [Presence / Absence Alert](#7-presence--absence-alert)
8. [Annexes](#8-annexes)

---

## 1. Historical Data

**Message Type:** `0x02` (CO₂), `0x03` (Temperature), `0x04` (Humidity)  
**Transmission:** Periodic (Datalog mode)

| Offset | Size (bits) | Field | Description | Valid Range | Scale | Unit |
|---------|--------------|--------|--------------|--------------|--------|------|
| 0 | 8 | Product Type | Product model ID | FEEL+: `0xB9`, RISE+: `0xBA`, WAVE+: `0xBB`, MOVE+: `0xC6`, SIGN+: `0xC7`, SENSE+: `0xC8`, ATMO+: `0xCD` | - | - |
| 8 | 8 | Message Type | Type of data stored | `0x02` CO₂, `0x03` Temp, `0x04` Humidity | - | - |
| 16 | 6 | Number of samples | Total number of data points | 1–36 | - | - |
| 22 | 8 | Period between samples | Interval in minutes | 5–30 | 1 | min |
| 30 | 6 | Repetition | Number of repetitions | 1–24 | - | - |
| 36 | 10*n | Measurements [n→n-x] | CO₂ / Temperature / Humidity | See details below | - | ppm / °C / %RH |

**Measurement Scales:**

| Data | Range | Resolution | Scale | Special Codes |
|-------|--------|-------------|--------|----------------|
| Temperature | -30 → +70°C | 0.1°C | Offset +30°C | 1023: Error / 1022: Sensor missing / 1021: Disabled |
| Humidity | 0–100% | 0.1% | Linear | Same codes |
| CO₂ | 0–5000 ppm | 5 ppm | Linear | 1023: Error / 1022: Missing / 1021: Disabled / 1020: End of life |

---

## 2. Periodic Data — FEEL+, RISE+, WAVE+, MOVE+, SIGN+

**Message Type:** `0x01`  
**Transmission:** Periodic and on event

| Offset | Size (bits) | Field | Description | Range | Scale | Unit |
|---------|--------------|--------|--------------|--------|--------|------|
| 0 | 8 | Product Type | Model identifier | FEEL+: `0xB9`, RISE+: `0xBA`, WAVE+: `0xBB`, MOVE+: `0xC6`, SIGN+: `0xC7` | - | - |
| 8 | 8 | Message Type | Periodic data | `0x01` | - | - |
| 16 | 10 | Temperature | Temperature sensor reading | 0–1000 | -30–70 | °C |
| 26 | 10 | Humidity | Humidity sensor reading | 0–1000 | 0–100 | %RH |
| 36 | 14 | CO₂ | CO₂ concentration | 0–10000 | 1 | ppm |
| 64 | 10 | Light | Illuminance | 0–1020 | 0–5100 | lux |
| 74 | 1 | Button | Button press state | 0: no / 1: pressed | - | - |
| 75 | 7 | Avg. Noise | Average sound level | 35–120 | 1 | dB |
| 82 | 7 | Peak Noise | Max sound level | 35–120 | 1 | dB |
| 89 | 7 | Activity Index | PIR motion | 0–100 | 1 | % |
| 96 | 3 | IAQ Global | Overall air quality | 0 Good / 2 Medium / 4 Poor | - | - |
| 99 | 4 | IAQ Source | Dominant pollutant | 5 CO₂ / 6 VOC | - | - |
| 103 | 3 | IAQ CO₂ | CO₂ level index | 0 Good / 2 Medium / 4 Poor | - | - |
| 106 | 3 | IAQ VOC | VOC index | Same as above | - | - |
| 109 | 9 | AirDrive | Ventilation index | 0–500 | 1 | - |
| 118 | 1 | Presence | Room occupancy | 0: empty / 1: occupied | - | - |

---

## 3. Periodic Data — SENSE+, ATMO+

**Message Type:** `0x01`  
**Transmission:** Periodic and on event

| Offset | Size (bits) | Field | Description | Range | Scale | Unit |
|---------|--------------|--------|--------------|--------|--------|------|
| 0 | 8 | Product Type | `0xC8` SENSE+ / `0xCD` ATMO+ | - | - | - |
| 8 | 8 | Message Type | Periodic data | `0x01` | - | - |
| 16 | 10 | Temperature | °C reading | 0–1000 | -30–70 | °C |
| 26 | 10 | Humidity | %RH reading | 0–1000 | 0–100 | %RH |
| 36 | 14 | CO₂ | Concentration | 0–10000 | 1 | ppm |
| 64 | 10 | Light | Illuminance | 0–1020 | 0–5100 | lux |
| 74 | 1 | Button | Button press | 0/1 | - | - |
| 75 | 7 | Avg. Noise | Sound level | 35–120 | 1 | dB |
| 82 | 7 | Peak Noise | Peak sound level | 35–120 | 1 | dB |
| 89 | 7 | Activity Index | PIR activity | 0–100 | 1 | % |
| 96 | 3 | IAQ Global | Overall quality index | 0 Good / 2 Medium / 4 Poor | - | - |
| 99 | 4 | IAQ Source | Dominant pollutant | 5 CO₂ / 6 VOC / 7 HCHO / 8 PM1 / 9 PM2.5 / 10 PM10 | - | - |
| 103 | 3 | IAQ CO₂ | CO₂ air quality | 0 Good / 2 Medium / 4 Poor | - | - |
| 106 | 3 | IAQ VOC | VOC quality | Same | - | - |
| 109 | 9 | AirDrive | Ventilation control index | 0–500 | 1 | - |
| 118 | 1 | Presence | Presence flag | 0/1 | - | - |
| 119 | 16 | PM1 | PM1 particles | 0–2000 | 1 | µg/m³ |
| 135 | 16 | PM2.5 | PM2.5 particles | 0–2000 | 1 | µg/m³ |
| 151 | 16 | PM10 | PM10 particles | 0–2000 | 1 | µg/m³ |
| 247 | 10 | Pressure | Barometric pressure | 0–800 | +300 | hPa |
| 257 | 10 | Formaldehyde | HCHO concentration | 0–1000 | 1 | ppb |
| 267 | 3 | IAQ PM1 | PM1 air quality | 0–7 | - | - |
| 270 | 3 | IAQ PM2.5 | PM2.5 air quality | 0–7 | - | - |
| 273 | 3 | IAQ PM10 | PM10 air quality | 0–7 | - | - |
| 276 | 3 | IAQ HCHO | Formaldehyde air quality | 0–7 | - | - |

---

## 4. Product Status (`0x05`)

| Offset | Size (bits) | Field | Description | Values |
|---------|--------------|--------|--------------|---------|
| 0 | 8 | Product Type | Model ID | FEEL+ `0xB9` → ATMO+ `0xCD` |
| 8 | 8 | Message Type | Product status | `0x05` |
| 16 | 8 | HW Version | Hardware version | 0–250 |
| 24 | 8 | SW Version | Software version | 0–250 |
| 32 | 2 | Power Source | Battery / USB | 0 Battery / 1 USB |
| 34 | 10 | Battery Voltage | mV value | 0–5000 |
| 44 | 3 | Battery Level | Battery state | 0 High / 1 Mid / 2 Low / 3 Critical |
| 47 | 1 | Global Status | Hardware status | 0 OK / 1 Fault |
| 48 | 3 | SD Card | SD state | 0 OK / 1 Fault / 2 Missing / 3 Disabled |
| 51 | 3 | Display | Display status | 0 OK / 1 Fault / 2 Missing / 3 Disabled |
| 64 | 8 | Activation Time | Total uptime | Months |
| 72 | 2 | Tamper | Mounting base detection | 0 not detected / 1 detected |

---

## 5. Product Configuration (`0x06`)

| Offset | Size (bits) | Field | Description | Values / Details |
|---------|--------------|--------|--------------|----------------|
| 0 | 8 | Product Type | Product ID | FEEL+ → ATMO+ |
| 8 | 8 | Message Type | Configuration | `0x06` |
| 16 | 3 | Config Source | Config origin | 0 NFC / 1 Downlink |
| 19 | 2 | Config Result | Success / Fail | 0 Full / 1 Partial / 2 Fail |
| 21 | 5 | Measure Period | Time between samples | 5–30 min |
| 26 | 1 | CO₂ | CO₂ measurement | 0/1 |
| 27 | 1 | VOC | VOC measurement | 0/1 |
| 28 | 1 | PIR | Motion detection | 0/1 |
| 29 | 1 | Microphone | Sound measurement | 0/1 |
| 30 | 1 | SD Logging | SD storage | 0/1 |
| 31 | 1 | Auto CO₂ Calib | Auto-calibration | 0/1 |
| 32 | 10 | CO₂ Mid Level | Orange threshold | 0–5000 ppm |
| 42 | 10 | CO₂ High Level | Red threshold | 0–5000 ppm |
| 52 | 1 | LED CO₂ | LED indicator | 0/1 |
| 54 | 1 | Buzzer | Sound alert | 0/1 |
| 63 | 1 | Periodic Data | Periodic transmission | 0/1 |
| 64 | 6 | Period Duration | Transmission interval | 10–60 min |
| 70 | 8 | Delta CO₂ | CO₂ change trigger | 0–1000 ppm |
| 78 | 7 | Delta Temp | Temp change trigger | 0–9.9 °C |
| 85 | 1 | CO₂ History | Datalog CO₂ | 0/1 |
| 86 | 1 | Temp History | Datalog Temperature | 0/1 |
| 98 | 8 | Datalog Period | Log interval | 10–1440 min |
| 106 | 1 | Deferred Join | Scheduled network join | 0/1 |
| 109 | 6 | Year | Year since 2000 | 0–63 |
| 115 | 4 | Month | Month | 1–12 |
| 119 | 5 | Day | Day | 1–31 |
| 124 | 5 | Hour | Hour | 0–23 |
| 129 | 6 | Minute | Minute | 0–59 |
| 135 | 1 | Humidity History | Datalog Humidity | 0/1 |
| 152 | 1 | PM | PM measurement | 0/1 |
| 153 | 1 | HCHO | Formaldehyde measurement | 0/1 |
| 154 | 1 | Presence Alert | PIR alert | 0/1 |
| 155 | 6 | Vacancy Delay | Delay before "vacant" frame | 5–60 min |

---

## 6. Display Configuration (`0x07`)

| Offset | Size (bits) | Field | Description | Values |
|---------|--------------|--------|--------------|----------|
| 0 | 8 | Product Type | Product model | FEEL+ → ATMO+ |
| 8 | 8 | Message Type | Display configuration | `0x07` |
| 16 | 3 | Config Source | Config origin | 0 NFC / 1 Downlink |
| 21 | 1 | Display Active | Screen enable | 0/1 |
| 22 | 4 | Language | FR=1 / EN=2 / ES=3 / DE=4 / IT=5 | - |
| 26 | 2 | Temp Unit | °C=1 / °F=2 / K=3 | - |
| 32 | 8 | Boot Screen | Startup screen | 1–9 (1=1 pollutant, 8=IAQ, 9=Diag) |
| 40–72 | 8x4 | Other Screens | Cycle order via button | - |
| 80 | 4 | 1st Pollutant | Display order | 1=T / 2=RH / 3=CO₂ / 4=VOC / 5=PM1 / 6=PM2.5 / 7=PM10 / 8=HCHO |
| 88–108 | 4x6 | Following Pollutants | Full order | - |
| 108 | 5 | Refresh Rate | Screen refresh interval | 1–30 min |

---

## 7. Presence / Absence Alert (`0x08`)

| Offset | Size (bits) | Field | Description | Values |
|---------|--------------|--------|--------------|----------|
| 0 | 8 | Product Type | Model | WAVE+ / MOVE+ / SIGN+ / SENSE+ / ATMO+ |
| 8 | 8 | Message Type | Presence/Absence alert | `0x08` |
| 16 | 1 | Presence | Status | 0 Occupied / 1 Vacant |

---

## 8. Annexes

### Sensor Error Codes

| Code | Meaning |
|-------|----------|
| 1023 | Measurement error |
| 1022 | Sensor missing |
| 1021 | Sensor disabled |
| 1020 | Sensor end of life |

### Main Units

| Symbol | Parameter |
|---------|------------|
| °C | Temperature |
| %RH | Relative humidity |
| ppm | CO₂ concentration |
| ppb | Formaldehyde (HCHO) |
| µg/m³ | Particulate matter (PM) |
| lux | Light intensity |
| dB | Sound pressure level |
| hPa | Atmospheric pressure |

---

## 🧾 Additional Resources

- Online decoder: [https://nexelec-support.fr/n/decoder/](https://nexelec-support.fr/n/decoder/)  
- Downlink builder: [https://nexelec-support.fr/n/downlink/](https://nexelec-support.fr/n/downlink/)  
- Technical documentation: [https://support.nexelec.fr](https://support.nexelec.fr)

---

## 🛠 Maintainer

**Nexelec Support Team**  
Contact: [support@nexelec.fr](mailto:support@nexelec.fr)