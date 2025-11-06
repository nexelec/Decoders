
# ORIGIN / ORIGIN+ / GUARD / GUARD+ — Frame Decoding Reference (Uplink 0x00–0x05)

> Version: 2025-11-06 • Status: Draft • Language: English (technical)

This document details the **byte-level decoding** of all uplink messages (LoRaWAN & Sigfox) for ORIGIN, ORIGIN+, GUARD, and GUARD+ devices.

---

## 1. Conventions
- Byte order: big-endian
- Signed values: two’s complement
- Temperature encoding: 0 → -30°C, 300 → 0°C, 1000 → 70°C (scale = 0.1°C, offset = -30°C)
- Humidity encoding: linear, 0.5%RH step, 0–200 = 0–100%RH
- Product Type codes:
  - ORIGIN+ = 0xBD  
  - ORIGIN = 0xB2  
  - GUARD+ = 0xB3  
  - GUARD = 0xB4  

---

## 2. Frame 0x00 — Product Status

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-------------:|--------|--------------|--------|--------|------|
| 0 | 8 | Product type | Product model code | — | — | — |
| 8 | 8 | Message type | 0x00 | — | — | — |
| 16 | 8 | Hardware version | Version index | 1–255 | — | — |
| 24 | 8 | Software version | Version index | 10–255 | — | — |
| 32 | 8 | Remaining life | Time to end-of-life | 0–120 | 1 | Month |
| 40 | 1 | Smoke chamber | 0=OK, 1=Fault | — | — | — |
| 41 | 1 | Temp/Humidity sensor | 0=OK, 1=Fault | — | — | — |
| 42 | 1 | Reserved | — | — | — |
| 43 | 3 | Magnetic base detection | 0=Not detected, 1=Detected, 2=Removed, 3=Installed, 4=Never detected | — | — | — |
| 46 | 2 | Battery level | 0=High,1=Medium,2=Low,3=Critical | — | — | — |
| 48 | 8 | Battery voltage | Raw in 5 mV steps | 2000–3250 | ×5 | mV |

---

## 3. Frame 0x01 — Product Configuration

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-------------:|--------|--------------|--------|--------|------|
| 0 | 8 | Product type | Product model | — | — | — |
| 8 | 8 | Message type | 0x01 | — | — | — |
| 16 | 3 | Reconfiguration source | 0=NFC,1=Downlink,2=Startup,5=Local | — | — | — |
| 19 | 2 | Reconfiguration status | 0=Success,1=Partial,2=Fail | — | — | — |
| 21 | 1 | Datalog temperature | 0=Off,1=On | — | — | — |
| 22 | 1 | Daily air quality | 0=Off,1=On | — | — | — |
| 24 | 1 | Delayed connection | 0=No,1=Pending | — | — | — |
| 25 | 2 | NFC status | 0=Discoverable,1=Non-discoverable | — | — | — |
| 31 | 6 | Number of new Datalog | Number of new measures | 1–36 | — | — |
| 37 | 5 | Number of transmissions | Redundancy level | 1–24 | — | — |
| 42 | 8 | Transmission period | Datalog transmission period | 3–144 | ×10 | min |
| 50 | 17 | D2D network ID | Interconnection ID | 0–131071 | — | — |
| 72 | 16 | Downlink FCnt | Counter of reconfig message | 0–65535 | — | — |

---

## 4. Frame 0x02 — Alarm Status

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-------------:|--------|--------------|--------|--------|------|
| 0 | 8 | Product type | Model ID | — | — | — |
| 8 | 8 | Message type | 0x02 | — | — | — |
| 16 | 2 | Alarm status | 0=None,1=Smoke,2=Repeated | — | — | — |
| 18 | 2 | Pause alarm | 0=None,1=Manual,2=Network stop | — | — | — |
| 20 | 2 | Product test | 0=None,1=Local,2=Remote | — | — | — |
| 22 | 8 | Time since last test | Weeks since last test | 0–255 | — | weeks |
| 30 | 1 | Maintenance flag | 0=None,1=Performed | — | — | — |
| 31 | 8 | Time since maintenance | Weeks | 0–255 | — | weeks |
| 39 | 10 | Temperature | Encoded temperature | 0–1000 | 0.1 | °C |
| 49 | 7 | Not used | — | — | — |

---

## 5. Frame 0x03 — Daily Air Quality

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-------------:|--------|--------------|--------|--------|------|
| 0 | 8 | Product type | — | — | — | — |
| 8 | 8 | Message type | 0x03 | — | — | — |
| 16 | 10 | Min temperature | Linear temp (0.1°C, offset -30°C) | 0–1000 | 0.1 | °C |
| 26 | 10 | Max temperature | Linear temp (0.1°C, offset -30°C) | 0–1000 | 0.1 | °C |
| 36 | 10 | Avg temperature | Linear temp (0.1°C, offset -30°C) | 0–1000 | 0.1 | °C |
| 46 | 8 | Min RH | Linear humidity | 0–200 | 0.5 | %RH |
| 54 | 8 | Max RH | Linear humidity | 0–200 | 0.5 | %RH |
| 62 | 8 | Avg RH | Linear humidity | 0–200 | 0.5 | %RH |
| 70 | 2 | Not used | — | — | — | — |

---

## 6. Frame 0x04 — Periodic Data

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-------------:|--------|--------------|--------|--------|------|
| 0 | 8 | Product type | — | — | — | — |
| 8 | 8 | Message type | 0x04 | — | — | — |
| 16 | 10 | Temperature | Linear temp (0.1°C, offset -30°C) | 0–1000 | 0.1 | °C |
| 26 | 8 | Relative humidity | Linear RH | 0–200 | 0.5 | %RH |
| 34 | 6 | Not used | — | — | — | — |

---

## 7. Frame 0x05 — Historical Data (Datalog Temperature, LoRa only)

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-------------:|--------|--------------|--------|--------|------|
| 0 | 8 | Product type | — | — | — | — |
| 8 | 8 | Message type | 0x05 | — | — | — |
| 16 | 6 | Number of measurements | Total samples in message | 1–36 | — | — |
| 22 | 8 | Period between measurements | Step between two samples | 10–200 | 1 | min |
| 30 | 6 | Repeat | Number of identical repetitions | 1–24 | — | — |
| 36 | 10 | Temperature[n] | Latest temperature | 0–1000 | 0.1 | °C |
| 46 | 10 | Temperature[n-1] | Previous sample | 0–1000 | 0.1 | °C |
| ... | ... | ... | Older samples (n-x) | 0–1000 | 0.1 | °C |

---

## 8. Notes

- Frames 0x00–0x03 apply to both LoRaWAN and Sigfox.  
- Frames 0x04–0x05 apply **only to LoRaWAN**.  
- All bit/byte positions refer to the message payload excluding MAC headers.

---

## 🧾 Additional Resources

- Online decoder: [https://nexelec-support.fr/n/decoder/](https://nexelec-support.fr/n/decoder/)  
- Downlink builder: [https://nexelec-support.fr/n/downlink/](https://nexelec-support.fr/n/downlink/)  
- Technical documentation: [https://support.nexelec.fr](https://support.nexelec.fr)

---

## 🛠 Maintainer

**Nexelec Support Team**  
Contact: [support@nexelec.fr](mailto:support@nexelec.fr)