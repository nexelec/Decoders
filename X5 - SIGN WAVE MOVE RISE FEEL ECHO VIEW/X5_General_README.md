# 🧩 X5 Family – General Communication Overview

Uplink and downlink decoding overview for **Nexelec X5 family products**:  
**SIGN, RISE, MOVE, WAVE, FEEL, ECHO, VIEW**

This document summarizes the **LoRaWAN** and **Sigfox** communication behavior, message indexes, and data transmission principles used by the X5 series.

---

## 📡 Supported Communication Protocols

| Protocol | Region | Typical Payload Size | Description |
|-----------|---------|----------------------|--------------|
| **LoRaWAN** | EU868 / US915 / IN865 | 11–64 bytes | Main communication mode used for environmental monitoring and presence detection. |
| **Sigfox** | RC1 | 12 bytes uplink | Simplified communication mode for compact and low-power deployments. |

---

## 🧱 Product Family Overview

| Model | Internal Reference |
|--------|--------------------|
| **SIGN** | X565 |
| **RISE** | X520 |
| **MOVE** | X590 |
| **WAVE** | X530 |
| **FEEL** | X580 |
| **ECHO** | X570 |
| **VIEW** | X575 |

---

## 📨 Message Index Summary

All X5 devices communicate through a set of standardized uplink messages.  
Each message type is identified by an index byte (field `Message Type`).

| Function | Index (Hex) | Transmission | Disableable | Configurable |
|-----------|-------------|---------------|--------------|---------------|
| **Periodic data** | `0x01` | Periodic and on event | Yes | Yes |
| **Historical data (datalog)** | `0x02` CO₂<br>`0x03` Temperature<br>`0x04` Humidity | Periodic | Yes | Yes |
| **Product status** | `0x05` | Every 24h and on event | No | No |
| **Product configuration** | `0x06` | Every 7 days and on change | No | No |
| **Screen configuration** | `0x07` | Every 7 days and on change | No | No |
| **Presence / vacancy alert** | `0x08` | On event | Yes | Yes |

---

## 🔁 Transmission Behavior

| Trigger Type | Description |
|---------------|-------------|
| **Periodic** | Sent at regular intervals defined in configuration (typically every 10–30 min). |
| **On Event** | Sent immediately when a significant change occurs (presence detected, button press, etc.). |
| **On Configuration Change** | Sent after parameter updates via downlink or local configuration. |
| **Startup / Join** | Sent once after successful network join or power-on sequence. |

---

## 🧠 Message Categories

- **0x01 – Periodic Data**  
  Contains real-time environmental values: temperature, humidity, CO₂, luminosity, noise, activity index, IAQ, and presence flag.

- **0x02/0x03/0x04 – Historical Data (Datalog)**  
  Contains sequences of recorded measurements (CO₂, temperature, or humidity) with timestamp intervals.

- **0x05 – Product Status**  
  Hardware state, firmware version, power source, battery voltage, and lifetime counters.

- **0x06 – Product Configuration**  
  Reflects all product parameters: measurement intervals, thresholds, active sensors, buzzer, LED, datalog options.

- **0x07 – Screen Configuration**  
  Defines the display behavior (enabled screens, refresh period, pollutant priority, language, temperature units).

- **0x08 – Presence Alert**  
  Triggered when motion is detected or when a zone becomes vacant after a defined timeout.

---

## 🌍 Regional Behavior

| Protocol | Region | Notes |
|-----------|---------|-------|
| **LoRaWAN** | EU868 | Full frame format with IAQ and PM indexes. |
| **Sigfox** | RC1 | Simplified periodic frames with reduced field set (CO₂, Temp, Humidity, Activity). |
| **LoRaWAN** | US915 / IN865 | Same structure as EU868, adapted to channel plan. |

---

## 🧭 Typical Transmission Schedule

| Event | Message Type | Trigger |
|--------|---------------|----------|
| Device power-on | `0x05` Status | On join or boot |
| Periodic measurement | `0x01` Periodic data | Every 10–30 min |
| Presence detected | `0x08` Presence alert | Instant |
| Configuration changed | `0x06` Product configuration | Immediately |
| Screen setting changed | `0x07` Screen configuration | Immediately |
| Datalog full | `0x02`/`0x03`/`0x04` Historical | Periodic |

---

## 🧮 Example Uplink Sequence

1. Device joins LoRaWAN network (`Join Accept`).  
2. Sends `0x05` Product Status.  
3. Starts periodic uplinks `0x01`.  
4. Sends historical datalog (`0x02–0x04`) as needed.  
5. Sends presence alert `0x08` on motion.  

---

## 🔗 Useful Links

- 🧮 **Online Frame Decoder:** [https://nexelec-support.fr/n/decoder/](https://nexelec-support.fr/n/decoder/)  
- 🔁 **Downlink Tool:** [https://nexelec-support.fr/n/downlink/](https://nexelec-support.fr/n/downlink/)  
- 📧 **Support Contact:** [support@nexelec.fr](mailto:support@nexelec.fr)

---

## 📜 License

© Nexelec — All rights reserved.  
Internal documentation for the X5 product family communication formats.
