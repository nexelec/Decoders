
# AIR / AIR+ — Communication Overview (LoRaWAN)

This document summarizes the communication and message behavior for the **AIR / AIR+** LoRaWAN-connected carbon monoxide detector range.

---

## 1. Scope

- Products: **AIR** (X845LS) and **AIR+** (X850LS)
- Network: **LoRaWAN Class A (EU868)** only
- Messages covered: **0x00–0x04 uplink only**
- Excludes: Downlink reconfiguration, NFC, or mobile app configuration.

---

## 2. Message Taxonomy

| Function | Message Type | ID (Hex) | Transmission | Deactivable | Configurable |
|-----------|---------------|-----------|---------------|--------------|---------------|
| Product Status | Device condition and lifetime | **0x00** | On event + Periodic | No | No |
| CO Alarm Status | CO and pre-alarm status | **0x01** | On event | No | No |
| Periodic Data | Instant CO, T°, RH, IAQ | **0x02** | On event + Periodic | Yes | Yes |
| Product Function Configuration | Configuration summary | **0x03** | On event + Periodic | No | No |
| SAV Information | Maintenance/diagnostic info | **0x04** | On event | No | No |

---

## 3. LoRaWAN Behavior

- **Protocol version:** LoRaWAN 1.0.2 (RP001 revB)  
- **Profile:** Class A (uplink initiated, RX2 SF9 or SF12)  
- **Join Type:** OTAA  
- **AppEUI:** 0x70B3D540F43B155D  
- **Application Port:** 56  
- **ADR:** Enabled  
- **Frequencies:** EU868

### Typical Startup Sequence
At first power-up, the product automatically joins the network and sends:
- `Product Status (0x00)`  
- `Product Function Configuration (0x03)`  

If successful, daily status frames and periodic environmental data continue according to configuration.

---

## 4. Periodic and Event Transmission

| Event | Uplink Frame(s) Sent |
|--------|----------------------|
| Power-up | 0x00 + 0x03 |
| CO detection (≥50 ppm) | 0x01 |
| CO pre-alarm (≥40 ppm) | 0x01 |
| Product test | 0x01 + (0x02 for AIR+) |
| Magnetic base removal/insertion | 0x00 |
| Scheduled periodic transmission | 0x02 |
| Configuration update | 0x03 |
| Maintenance or fault | 0x00 / 0x04 |

---

## 5. Measurement & Reporting

| Parameter | Unit | Resolution | Range | Period |
|------------|------|-------------|--------|---------|
| CO | ppm | 1 | 0–1000 | 1 min (no CO) / 30 s (CO detected) |
| Temperature (AIR+) | °C | 0.1 | -30 … +70 | 10 min |
| Humidity (AIR+) | %RH | 0.5 | 0–100 | 10 min |

### IAQ (Indoor Air Quality)
The AIR+ product computes a qualitative **IAQ level (0–7)** based on CO, T°, and RH.  
Level 0 = Excellent, 4 = Bad, 7 = Error.

---

## 6. Power & Lifetime

- Powered by **two non-replaceable batteries**.  
- **Autonomy: 10 years** (standard configuration).  
- Battery status is represented by 4 levels (High / Medium / Low / Critical) in the 0x00 frame.

---

## 7. Configuration Parameters (local or remote summary)

| Setting | Default | Range / Options | Description |
|----------|----------|----------------|--------------|
| Periodic transmission | 60 min | 10–90 min | Time between two 0x02 messages |
| ΔCO (delta trigger) | 15 ppm | 0–999 ppm | Threshold for immediate CO transmission |
| ΔT° (delta trigger) | 1°C | 0–9.9°C | Threshold for immediate temperature transmission |
| NFC discoverability | Discoverable | 0/1 | Accessibility of NFC memory |
| Interconnection D2D ID | 0 | 1–131071 | ID for accessory interconnection |

---

## 8. Interconnection (D2D) Behavior

- Interconnection allows pairing with accessories (e.g. RELAY modules).  
- Successful pairing generates a configuration frame (0x03) containing the network ID.  
- Disconnection events are also confirmed by frame 0x03.

---

## 9. Data Logic Summary

| Frame ID | Contains | Trigger | Available on |
|-----------|-----------|----------|---------------|
| 0x00 | Product HW status, CO sensor, lifetime, magnetic base | Periodic + event | All products |
| 0x01 | CO level, pre-alarm, alarm, test | Event only | All products |
| 0x02 | CO, T°, RH, IAQ | Periodic / delta | AIR+ only |
| 0x03 | Configuration, deltas, periods, D2D ID | On event / 7 days | All products |
| 0x04 | SAV diagnostic data | On event | All products |

---


- Online decoder: [https://nexelec-support.fr/n/decoder/](https://nexelec-support.fr/n/decoder/)  
- Autonomy calculator: [https://nexelec-support.fr/n/volt/](https://nexelec-support.fr/n/volt/)  
- Support: **support@nexelec.fr**


