
# TRACK+ — Frame Decoding Reference (LoRaWAN Uplink 0x01–0x05)

This document details the **uplink frame structures** of TRACK+ for LoRaWAN operation.

---

## 1. Conventions

- Product type: **0xB5 (TRACK+)**  
- Units and scales as specified per field  
- All messages transmitted on FPort 56

---

## 2. Frame 0x01 — Periodic Measurements

| Byte | Field | Description | Range | Scale | Unit |
|------:|--------|-------------|--------|--------|------|
| 0 | Product ID | 0xB5 | — | — | — |
| 1 | Message Type | 0x01 | — | — | — |
| 3 | Measurement ID 1 | See table below | — | — | — |
| 4–5 | Measurement Value 1 | Encoded value | — | — | — |
| 6 | Measurement ID 2 | ... | — | — | — |
| 7–8 | Measurement Value 2 | ... | — | — | — |

### Measurement Identifiers

| ID (Hex) | Data | Description | Range | Scale | Unit |
|-----------|-------|-------------|--------|--------|------|
| 0x01 | PM1 | PM1 concentration | 0–1000 | 1 | µg/m³ |
| 0x02 | PM2.5 | PM2.5 concentration | 0–1000 | 1 | µg/m³ |
| 0x03 | PM10 | PM10 concentration | 0–1000 | 1 | µg/m³ |
| 0x04 | PM Channel 2 | 0.5–1 µm particles | 0–3000 | 1 | pcs/cm³ |
| 0x05 | PM Channel 3 | 1–2.5 µm particles | 0–3000 | 1 | pcs/cm³ |
| 0x06 | PM Channel 5 | 5–10 µm particles | 0–3000 | 1 | pcs/cm³ |
| 0x07 | Temperature | Encoded temp (0=-30°C,1000=70°C) | 0–1000 | 0.1 | °C |
| 0x08 | Humidity | Relative humidity | 0–1000 | 0.1 | %RH |
| 0x09 | Pressure | Atmospheric pressure | 300–1200 | 1 | hPa |
| 0x0A | CO₂ | CO₂ concentration | 0–10000 | 1 | ppm |
| 0x13 | PM Channel 1 | 0.3–0.5 µm particles | 0–3000 | 1 | pcs/cm³ |
| 0x14 | PM Channel 4 | 2.5–5 µm particles | 0–3000 | 1 | pcs/cm³ |
| 0x15 | PM Channel 4 (fine) | 2.5–5 µm precision channel | 0–65500 | 0.01 | pcs/cm³ |
| 0x16 | PM Channel 5 (fine) | 5–10 µm precision channel | 0–65500 | 0.01 | pcs/cm³ |
| 0x17 | Ozone (O₃) | Ozone concentration | 0–1000 | 1 | ppb |
| 0x18 | NO₂ | Nitrogen dioxide concentration | 0–1000 | 1 | ppb |

**Example (hex):** `B5 01 07 01 51 0A 0A E2`  
→ T = 3.7°C, CO₂ = 2786 ppm

---

## 3. Frame 0x02 — Product Status

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-------------:|--------|--------------|--------|--------|------|
| 0 | 8 | Product Type | 0xB5 | — | — | — |
| 8 | 8 | Message Type | 0x02 | — | — | — |
| 16 | 8 | HW Version | Hardware version | 0–250 | — | — |
| 24 | 8 | SW Version | Software version | 0–250 | — | — |
| 32 | 16 | Battery Voltage | Battery voltage | 0–8100 | 1 | mV |
| 48 | 8 | External Energy | Energy supplied externally (24h) | 0–250 | 1 | Wh |
| 56 | 8 | Stored Energy | Battery energy balance | -124–124 | 1 | Wh |
| 64 | 2 | Orientation | 0=OK,1=Incorrect,2=Unavailable | — | — | — |
| 66 | 2 | Mode | 0=Normal,1=Low Battery,2=Preservation | — | — | — |
| 68 | 1 | Power Source | 0=External,1=Battery | — | — | — |

---

## 4. Frame 0x03 — GPS Data

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-------------:|--------|--------------|--------|--------|------|
| 0 | 8 | Product Type | 0xB5 | — | — | — |
| 8 | 8 | Message Type | 0x03 | — | — | — |
| 16 | 7 | Latitude Degrees | Latitude (°) | 0–90 | 1 | ° |
| 23 | 6 | Latitude Minutes | — | 0–60 | 1 | ' |
| 29 | 6 | Latitude Seconds | — | 0–60 | 1 | ″ |
| 35 | 7 | Latitude msec | Milliseconds | 0–100 | 10 | ms |
| 42 | 1 | N/S Flag | 0=North,1=South | — | — | — |
| 43 | 8 | Longitude Degrees | Longitude (°) | 0–180 | 1 | ° |
| 51 | 6 | Longitude Minutes | — | 0–60 | 1 | ' |
| 57 | 6 | Longitude Seconds | — | 0–60 | 1 | ″ |
| 63 | 7 | Longitude msec | Milliseconds | 0–100 | 10 | ms |
| 70 | 1 | E/W Flag | 0=East,1=West | — | — | — |
| 71 | 7 | HDOP | Horizontal precision | 0–100 | 0.1 | — |
| 78 | 5 | Satellites | Number of satellites | 1–32 | — | — |
| 83 | 2 | Fix Type | 0=None,1=GNSS,2=DGPS | — | — | — |

---

## 5. Frame 0x04 — Product Configuration

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-------------:|--------|--------------|--------|--------|------|
| 0 | 8 | Product Type | 0xB5 | — | — | — |
| 8 | 8 | Message Type | 0x04 | — | — | — |
| 16 | 3 | Reconfig Source | 0=NFC,1=Downlink,2=Startup,3=Network,4=GPS,5=Local | — | — | — |
| 19 | 2 | Reconfig Result | 0=Success,1=Partial,2=Fail | — | — | — |
| 21 | 1 | CO₂ Auto Calibration | 0=Off,1=On | — | — | — |
| 22 | 4 | Protocol & Region | 01=EU868,...,17=AS923-4 | — | — | — |
| 26 | 6 | Periodic Interval | Transmission period | 5–60 | 1 | min |
| 32 | 1 | Measurement Mode | 0=Periodic,1=Continuous | — | — | — |
| 35 | 5 | Timezone | UTC offset (-12 → +14) | — | — | h |

---

## 6. Frame 0x05 — LinkCheck

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-------------:|--------|--------------|--------|--------|------|
| 0 | 8 | Product Type | 0xB5 | — | — | — |
| 8 | 8 | Message Type | 0x05 | LinkCheck | — | — | — |

---

## 7. Notes

- All frames use **FPort 56** for LoRaWAN uplink.  
- Cellular (4G) behavior is similar, but protocol framing differs (not covered here).  
- Fields may vary slightly by firmware revision.

---

## 🧾 Additional Resources

- Online decoder: [https://nexelec-support.fr/n/decoder/](https://nexelec-support.fr/n/decoder/)  
- Downlink builder: [https://nexelec-support.fr/n/downlink/](https://nexelec-support.fr/n/downlink/)  
- Technical documentation: [https://support.nexelec.fr](https://support.nexelec.fr)

---

## 🛠 Maintainer

**Nexelec Support Team**  
Contact: [support@nexelec.fr](mailto:support@nexelec.fr)