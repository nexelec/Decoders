
# ORIGIN / ORIGIN+ / GUARD / GUARD+ — Communication Overview (LoRaWAN & Sigfox)

> Version: 2025-11-06 • Status: Draft • Language: English (technical)

This document summarizes the communication principles for the **ORIGIN / ORIGIN+ / GUARD / GUARD+** product range.  
It describes all **uplink messages** exchanged via **LoRaWAN** and **Sigfox** protocols — their types, triggering conditions, and general behavior.

---

## 1. Scope

- Applicable to: ORIGIN, ORIGIN+, GUARD, GUARD+ (smoke detector family)
- Networks supported: **LoRaWAN Class A** and **Sigfox RC1**
- Message range covered: **0x00 to 0x05** (uplink only)
- Excludes: Downlink, OTA, or NFC configuration functions

---

## 2. Message Taxonomy

| Function | Message Type | Index (Hex) | Transmission | Deactivable | Configurable | LoRa | Sigfox |
|-----------|---------------|--------------|---------------|--------------|---------------|-------|---------|
| Product Status | Device status summary | **0x00** | On event + Periodic | No | No | ✅ | ✅ |
| Product Configuration | Configuration confirmation | **0x01** | On event + Periodic | No | No | ✅ | ✅ |
| Alarm Status | Smoke/test/maintenance report | **0x02** | On event + Periodic | No | No | ✅ | ✅ |
| Daily Air Quality | Temperature/Humidity statistics | **0x03** | Periodic | Yes | Yes | ✅ | ✅ |
| Periodic Data | Instant temperature/humidity | **0x04** | On event + Periodic | No | No | ✅ | ❌ |
| Historical Data (Datalog Temperature) | Logged temperature series | **0x05** | Periodic | Yes | Yes | ✅ | ❌ |

---

## 3. LoRaWAN Communication Behavior

- **Protocol version:** LoRaWAN 1.0.2 (RP001 revB)
- **Profile:** Class A (uplink-initiated, RX2 window SF9 or SF12)
- **Membership:** OTAA (AppEUI = 0x70B3D540FA4A80ED)
- **Application port:** `56`
- **ADR:** Enabled by default  
- **Region:** EU868

### Uplink Flow
- Sent on startup: `Product Status (0x00)`, `Product Configuration (0x01)`, and `Periodic Data (0x04)`  
- Periodic data and daily statistics transmitted according to configuration.  
- Datalog messages (0x05) aggregate multiple temperature samples per frame.  
- On event (smoke, test, base removal): instant transmission of `Alarm Status (0x02)` or `Product Status (0x00)`.

### Reliability & Retransmission
- Datalog redundancy ensures higher reliability — repeated identical payloads increase reception success rate.  
- Up to **36 samples per frame** (6 new × 3 repetitions default).  
- Battery level and life countdown are periodically reported in `Product Status`.

---

## 4. Sigfox Communication Behavior

- **Radio Configuration:** RC1 Class (100 bps)  
- **Number of repetitions:** 3 per uplink (standard)  
- **No concept of persistent connection** — each uplink is autonomous.  
- Supported frames: 0x00 to 0x03.  
- Historical Datalog frames (0x05) are **not supported**.

---

## 5. Measurement & Reporting

| Parameter | Unit | Resolution | Range | Typical Period |
|------------|------|-------------|--------|----------------|
| Temperature | °C | 0.1 | -30 … +70 | 10 min |
| Humidity | %RH | 0.5 | 0 … 100 | 10 min |

- Air quality reports (0x03) include min, max, and average values over 24h.  
- Periodic frames (0x04) provide instantaneous temperature and humidity.  
- Product lifetime countdown (in months) is embedded in frame 0x00.  

---

## 6. Trigger Events Summary

| Event | Generated Message(s) |
|--------|-----------------------|
| Power-up | 0x00 Product Status, 0x01 Product Configuration, 0x04 Periodic Data |
| Base removed/inserted | 0x00 Product Status |
| Alarm detection | 0x02 Alarm Status |
| Product test | 0x02 Alarm Status (+0x04 Periodic Data for + models) |
| Periodic 24h measurement | 0x03 Daily Air Quality |
| Datalog cycle (LoRa only) | 0x05 Historical Temperature Data |

---

## 7. Interconnection Behavior (LoRa only)

- Up to **25 detectors or accessories** can be interconnected.  
- Interconnection messages trigger configuration updates (0x01) when a network is formed or modified.  
- Alarm repetition within the D2D network is **mirrored by 0x02 frames**.

---

## 8. Power & Autonomy

- ORIGIN / ORIGIN+ : sealed batteries — 10 years (typ.)  
- GUARD / GUARD+ : replaceable battery — 5 years (typ.)  
- Autonomy depends on message frequency and network coverage (ADR efficiency).

---

## 🧾 Additional Resources

- Online decoder: [https://nexelec-support.fr/n/decoder/](https://nexelec-support.fr/n/decoder/)  
- Downlink builder: [https://nexelec-support.fr/n/downlink/](https://nexelec-support.fr/n/downlink/)  
- Technical documentation: [https://support.nexelec.fr](https://support.nexelec.fr)

---

## 🛠 Maintainer

**Nexelec Support Team**  
Contact: [support@nexelec.fr](mailto:support@nexelec.fr)