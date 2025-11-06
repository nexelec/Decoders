
# TRACK+ — Communication Overview (LoRaWAN)


This document summarizes the communication behavior and message structure of the **TRACK+** environmental monitoring station.  
It details all **uplink messages (0x01–0x05)** sent via **LoRaWAN**. Cellular (4G) and downlink functions are excluded.

---

## 1. Scope

- Product: **TRACK+** (Outdoor air quality monitoring station)
- Networks supported: **LoRaWAN Class A (EU868)** and **4G LTE** (uplink only in this document)
- Protocol covered: LoRaWAN 1.0.3 (RP001 revA)
- Frames described: 0x01–0x05 uplink

---

## 2. Message Taxonomy

| Function | Message Type | ID (Hex) | Transmission | Configurable |
|-----------|---------------|-----------|---------------|---------------|
| Periodic Measurements | Environmental data frame | **0x01** | Every 5 min (default) | Yes |
| Product Status | Hardware & power state | **0x02** | At startup + every 24h | No |
| GPS Data | Location coordinates | **0x03** | At startup + every 24h | No |
| Product Configuration | Operating parameters | **0x04** | On startup / change / 7 days | Yes |
| LinkCheck | Network verification | **0x05** | Daily | No |

---

## 3. LoRaWAN Parameters

| Parameter | Value |
|------------|--------|
| LoRaWAN version | 1.0.3 |
| Regional parameters | RP001-1.0.3 revA |
| Profile | Class A |
| Band | EU868 |
| Join type | OTAA |
| AppEUI | 70B3D540F10AAD2B |
| AppKey / DevEUI | Unique per product |
| Application port | 56 |
| ADR | Enabled |

### Join and Retry Behavior
- Two automatic join attempts at startup.  
- If both fail, retry every 24h.  
- Daily LinkCheck (0x05) confirms network presence.

---

## 4. Measurement Functionality

| Sensor | Unit | Range | Resolution | Accuracy |
|---------|------|--------|-------------|-----------|
| Temperature | °C | -30 … +70 | 0.1 | ±0.3 °C |
| Humidity | %RH | 0–100 | 0.1 | ±2 %RH |
| Pressure | hPa | 300–1100 | 1 | ±2.5 hPa |
| PM1 / PM2.5 / PM10 | µg/m³ | 0–1000 | 1 | *Refer to evaluation report* |
| PM Channels (0.3–10 µm) | pcs/cm³ | 0–3000 | 1 | — |
| CO₂ | ppm | 0–10000 | 1 | ±3% ±30ppm |
| O₃ (Ozone) | ppb | 0–1000 | 1 | — |
| NO₂ (Nitrogen dioxide) | ppb | 0–1000 | 1 | — |

---

## 5. Operation Modes

| Mode | Description |
|------|--------------|
| **Periodic** | Default: measures every 5 min and transmits mean values. |
| **Continuous** | Continuous measurement, averages between transmissions (higher consumption). |
| **Battery preservation** | Activated when power is low; only GPS + status transmitted daily. |

### Battery Status
- Monitored continuously and reported in frame **0x02**.  
- Device can be powered by **AC (230V/110V)**, **DC (9–36V)**, or **solar panel (20W)** with integrated backup battery.


## 6. Transmission Logic

| Event | Frame(s) Sent |
|--------|----------------|
| Startup | 0x01 + 0x02 + 0x03 + 0x04 |
| Periodic (every 5 min) | 0x01 |
| Daily (00:00–01:00 UTC) | 0x02 + 0x03 + 0x05 |
| Configuration change | 0x04 |
| Manual button press | Immediate 0x01 uplink |
| Low battery | 0x02 (Status) |

---

## 7. Power Supply Summary

| Source | Voltage | Typical Usage |
|---------|----------|----------------|
| AC mains | 110–230V | Permanent installations |
| DC supply | 9–36V | Industrial systems |
| Solar panel | 20W | Autonomous outdoor setup |
| Internal battery | Li-Ion | Backup (≈15 days autonomy) |

---

## 9. Location Reporting (GPS)

- GNSS system: GPS / GLONASS / Galileo / QZSS  
- Transmitted every 24h (frame 0x03).  
- Parameters include latitude, longitude, HDOP, satellites used, and fix type.

---

## 🧾 Additional Resources

- Online decoder: [https://nexelec-support.fr/n/decoder/](https://nexelec-support.fr/n/decoder/)  
- Downlink builder: [https://nexelec-support.fr/n/downlink/](https://nexelec-support.fr/n/downlink/)  
- Technical documentation: [https://support.nexelec.fr](https://support.nexelec.fr)

---

## 🛠 Maintainer

**Nexelec Support Team**  
Contact: [support@nexelec.fr](mailto:support@nexelec.fr)
