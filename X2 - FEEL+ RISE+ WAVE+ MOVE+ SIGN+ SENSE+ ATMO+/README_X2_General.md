# Nexelec LoRaWAN Uplink Frame Reference for X2 range (EU868)

This repository contains the complete documentation and decoding reference for Nexelec connected sensors using the LoRaWAN EU868 protocol.  
It covers the following product lines: **FEEL+**, **RISE+**, **WAVE+**, **MOVE+**, **SIGN+**, **SENSE+**, and **ATMO+**.

---

## 📘 Overview

This README provides a summarized technical guide for interpreting uplink messages transmitted by Nexelec devices.  
For full decoding tables, see the detailed document `NEXELEC_UPLINK_FRAMES.md`.

---

## 🧩 Uplink Message Types

| Message Type | Index | Transmission | Configurable | Description |
|---------------|--------|---------------|---------------|--------------|
| **Periodic Data** | `0x01` | Periodic and event-based | Yes | Temperature, Humidity, CO₂, Noise, Activity, etc. |
| **Historical Data (Datalog)** | `0x02–0x04` | Periodic | Yes | CO₂, Temperature, Humidity historical logs |
| **Product Status** | `0x05` | Every 24h or on event | No | Hardware state, battery, SD card, display, etc. |
| **Product Configuration** | `0x06` | Every 7 days or on change | No | Current product settings |
| **Display Configuration** | `0x07` | Every 7 days or on change | No | Screen language, units, active displays |
| **Presence Alert** | `0x08` | On motion event | Yes | Occupied / Vacant state |

---

## 🌍 Regional Specifics (EU868)

All frames follow the EU868 LoRaWAN standard, Class A devices, using **port 56** for uplink and downlink communication.  
Default protocol version: **LoRaWAN 1.1.0 / 1.0.4**.

---

## 🧠 Quick Reference

- **CO₂:** 0–5000 ppm (resolution: 5 ppm)  
- **Temperature:** -30 to +70 °C (resolution: 0.1 °C)  
- **Humidity:** 0–100 %RH (resolution: 0.1 %)  
- **Noise:** 35–120 dB (avg. and peak)  
- **Activity index:** 0–100 %  
- **AirDrive index:** 0–500  
- **IAQ levels:** 0 = Good / 2 = Medium / 4 = Poor

---

## 🧾 Additional Resources

- Online decoder: [https://nexelec-support.fr/n/decoder/](https://nexelec-support.fr/n/decoder/)  
- Downlink builder: [https://nexelec-support.fr/n/downlink/](https://nexelec-support.fr/n/downlink/)  
- Technical documentation: [https://support.nexelec.fr](https://support.nexelec.fr)

---

## 🛠 Maintainer

**Nexelec Support Team**  
Contact: [support@nexelec.fr](mailto:support@nexelec.fr)
