# 🧩 X5 Family – General Communication Overview

Uplink and downlink decoding overview for **Nexelec X5 family products**:  
**SIGN, RISE, MOVE, WAVE, FEEL, ECHO, VIEW**

This document summarizes the **LoRaWAN** and **Sigfox** communication behavior, message indexes, and data transmission principles used by the X5 series.

Frame-by-frame bit tables are in [README-Frames_X5.md](README-Frames_X5.md).

---

## 📡 Supported Communication Protocols

| Protocol | Region | Typical Payload Size | Description |
|-----------|---------|----------------------|--------------|
| **LoRaWAN** | EU868 / IN865 | up to ~19 bytes | Full frame format, long payloads. |
| **LoRaWAN** | US915 / AU915 | 12 bytes uplink | Reduced field set, dedicated message IDs. |
| **Sigfox** | RC1 | 12 bytes uplink | Same reduced format as US915 / AU915. |

### LoRaWAN parameters

| Parameter | Value |
|---|---|
| LoRaWAN version | 1.0.4 |
| Regional parameters | RP002 1.0.3 |
| Profile | Class A (RX2 SF9) |
| Bands | EU868 / US915 / AS923 / AU915 / KR920 / IN865 / RU864 |
| Join type | OTAA |
| AppEUI | 70B3D540FCAD56DF |
| AppKey / DevEUI | Unique per product |
| Application port (uplink / downlink) | 56 |
| ADR | Enabled |

### Sigfox parameters

| Parameter | Value |
|---|---|
| Radio configuration | RC1 |
| Number of transmissions (N) | 3 |
| Standard bit rate | 100 bps |

---

## 🧱 Product Family Overview

| Model | Internal Reference | Product ID |
|--------|--------------------|------------|
| **FEEL** | X580 | 0xA9 |
| **RISE** | X520 | 0xAA |
| **MOVE** | X590 | 0xAB |
| **WAVE** | X530 | 0xAC |
| **SIGN** | X565 | 0xAD |
| **ECHO** | X570 | 0xC9 |
| **VIEW** | X575 | 0xCA |

---

## 📨 Message Index Summary

All X5 devices communicate through a set of standardized uplink messages.  
Each message type is identified by an index byte (field `Message Type`). Reduced-payload networks use their own indexes.

| Function | Index — EU868 / IN865 | Index — US915 / AU915 / Sigfox | Transmission | Disableable | Configurable |
|-----------|-------------|-------------|---------------|--------------|---------------|
| **Periodic data** | `0x01` | `0x11` | Periodic and on event | Yes | Yes |
| **Historical data (datalog)** | `0x02` CO₂<br>`0x03` Temperature<br>`0x04` Humidity | same indexes | Periodic | Yes | Yes |
| **Product status** | `0x05` | `0x15` | Every 24 h and on event | No | No |
| **Product configuration** | `0x06` | `0x16` (frame 1)<br>`0x17` (frame 2) | Every 7 days and on change | No | No |

---

## 🔁 Transmission Behavior

| Trigger Type | Description |
|---------------|-------------|
| **Periodic** | Sent at regular intervals defined in configuration (10–60 min, configurable). |
| **On Event** | Sent immediately when a CO₂ or temperature delta threshold is crossed, or on a button press. |
| **On Configuration Change** | Sent after parameter updates via downlink or NFC. |
| **Startup / Join** | Status and configuration sent once after successful network join or power-on sequence. |

---

## 🧠 Message Categories

- **`0x01` / `0x11` – Periodic Data**  
  Real-time environmental values: temperature, humidity, CO₂, luminosity, noise (average and peak), occupancy rate, iZiAIR indexes, AirDrive index and button flag. The reduced format (`0x11`) stops after the occupancy rate.

- **`0x02` / `0x03` / `0x04` – Historical Data (Datalog)**  
  Sequences of recorded measurements (CO₂, temperature or humidity), ordered most recent first, with the interval between measurements carried in the frame.

- **`0x05` / `0x15` – Product Status**  
  Hardware and firmware versions, power source, battery voltage and level, per-sensor status, SD card status, activation counter, time since last CO₂ calibration and anti-tear state.

- **`0x06` / `0x16` + `0x17` – Product Configuration**  
  All product parameters: measurement and transmission periods, enabled sensors, CO₂ thresholds, LED and buzzer behavior, datalog options, NFC status, product date and downlink FCnt. On reduced-payload networks the configuration is split across two frames.

---

## 🧭 Typical Transmission Schedule

| Event | Message Type | Trigger |
|--------|---------------|----------|
| Device power-on | `0x05` / `0x15` Status + `0x06` / `0x16`-`0x17` Configuration | On join or boot |
| Periodic measurement | `0x01` / `0x11` Periodic data | Every 10–60 min |
| CO₂ or temperature delta exceeded | `0x01` / `0x11` Periodic data | Instant |
| Button press | `0x01` / `0x11` Periodic data | Instant, if enabled |
| Datalog period elapsed | `0x02` / `0x03` / `0x04` Historical | Every 30–1440 min |
| Configuration changed | `0x06` / `0x16`-`0x17` Configuration | Immediately |
| Sensor removed from / refitted on its base | `0x05` / `0x15` Status | Instant |
| Every 24 h | `0x05` / `0x15` Status | Daily |
| Every 7 days | `0x06` / `0x16`-`0x17` Configuration | Weekly |

---

## 🧮 Example Uplink Sequence

1. Device joins the LoRaWAN network (`Join Accept`).  
2. Sends `0x05` Product Status and `0x06` Product Configuration.  
3. Starts periodic uplinks `0x01`.  
4. Sends historical datalog (`0x02`–`0x04`) at the configured datalog period.  
5. Sends an immediate `0x01` when a CO₂ or temperature delta is crossed.

---

## 🔗 Useful Links

- 🧮 **Online Frame Decoder:** [https://nexelec-support.fr/n/decoder/](https://nexelec-support.fr/n/decoder/)  
- 🔁 **Downlink Tool:** [https://nexelec-support.fr/n/downlink/](https://nexelec-support.fr/n/downlink/)  
- 📧 **Support Contact:** [support@nexelec.fr](mailto:support@nexelec.fr)  
- 📄 **Source document:** D948N — SIGN RISE FEEL MOVE WAVE ECHO VIEW LoRa/Sigfox Technical Guide

---

## 📜 License

© Nexelec — All rights reserved.  
Internal documentation for the X5 product family communication formats.
