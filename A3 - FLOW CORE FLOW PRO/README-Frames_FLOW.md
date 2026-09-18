
# FLOW CORE / FLOW PRO — Frame Decoding Reference (LoRaWAN Uplink 0x01–0x07)

This document details the **uplink frame structures** of FLOW for LoRaWAN operation, plus the downlink command set.

---

## 1. Conventions

- Product type: **0xD2 (FLOW CORE)** / **0xD6 (FLOW PRO)**
- Byte 1 is split in two nibbles: **message type** (bits 8–11) and **message version** (bits 12–15)
- All offsets and sizes are expressed in **bits**, MSB first
- All messages are transmitted on **FPort 56**
- Temperatures use a 30 °C offset when coded on 10 bits (0 = -30 °C, 300 = 0 °C, 1000 = 70 °C) and a 0.5 °C step when coded on 6 bits (0 = 0 °C, 36 = 18 °C, 62 = 31 °C)

---

## 2. Frame 0x01 — Periodic Data (version 1)

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-----------:|-------|-------------|-------|-------|------|
| 0 | 8 | Product Type | 0xD2 / 0xD6 | — | — | — |
| 8 | 4 | Message Type | 0x01 | — | — | — |
| 12 | 4 | Version | 1 | — | — | — |
| 16 | 10 | Ambient Temperature | Temperature used for regulation, 30 °C offset | 0–1000<br>1023 : Error | 0.1 | °C |
| 26 | 6 | Setpoint Temperature | Target temperature, 0.5 °C step | 0–62<br>63 : Error | 0.5 | °C |
| 32 | 2 | Ambient Temperature Source | 0 = internal sensor, 1 = NODE One probe, 2–3 = RFU | — | — | — |
| 34 | 10 | Internal Sensor Temperature | Always the head's own sensor, 30 °C offset | 0–1000<br>1023 : Error | 0.1 | °C |
| 44 | 3 | Setpoint Change Source | 0 = none, 1 = schedule, 2 = wheel, 3 = NFC, 4 = downlink, 5 = clock not set (degraded, forced 19.5 °C), 6–7 = RFU | — | — | — |
| 47 | 13 | Motor Position | Instantaneous motor position, 0 = fully retracted | 0–7000<br>8191 : Error | 1 | µm |
| 60 | 7 | Valve Opening | Valve opening percentage | 0–100 | 1 | % |
| 67 | 4 | Regulation Mode | 0 = regulation OFF, 1 = continuous (schedule off or setpoint forced), 2 = Comfort, 3 = Eco, 4 = Frost protection, 5 = Extended absence, 6 = BOOST, 7 = Open window, 8 = Low battery, 9–15 = RFU | — | — | — |

### Version 0 differences
Version 0 keeps offsets 0–43 identical, then replaces the *Regulation mode* field with two flags placed before the motor position:

| Offset | Size (bit) | Field | Description |
|--------:|-----------:|-------|-------------|
| 47 | 1 | Open Window Active | 0 = false, 1 = true |
| 48 | 1 | Frost Protection Active | 0 = false, 1 = true |

Both versions are handled by `decoderFlow.js`.

---

## 3. Frame 0x02 — Product Status

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-----------:|-------|-------------|-------|-------|------|
| 0 | 8 | Product Type | 0xD2 / 0xD6 | — | — | — |
| 8 | 4 | Message Type | 0x02 | — | — | — |
| 12 | 4 | Version | 0 | — | — | — |
| 16 | 8 | HW Version | Hardware version | 0–250 | — | — |
| 24 | 8 | SW Version | Software version | 0–250 | — | — |
| 32 | 10 | Battery Voltage Slot 1 | Voltage of battery slot 1 | 0–1000<br>1021 : No battery<br>1022 : Reserved<br>1023 : Error | 5 | mV |
| 42 | 10 | Battery Voltage Slot 2 | Voltage of battery slot 2 | 0–1000<br>1021 : No battery<br>1022 : Reserved<br>1023 : Error | 5 | mV |
| 52 | 2 | Battery Level | 0 = High (>50 %), 1 = Reserved, 2 = Low, 3 = Critical (<1 %) | — | — | — |
| 54 | 1 | Global Product Status | 0 = head functional, 1 = head faulty | — | — | — |
| 55 | 2 | Anti-Tear Status | 0 = base not detected, 1 = base detected, 2 = head just removed, 3 = head just installed | — | — | — |
| 57 | 3 | Motor Calibration Status | 0 = success, 1 = failure, 2 = not performed (head not on base), 3 = cleared after removal, 4 = reserved | — | — | — |
| 60 | 13 | Motor Stroke | Calibrated motor travel | 0–7000<br>8191 : Error | 1 | µm |
| 73 | 10 | Activation Time Counter | Cumulated activation time | 0–1000<br>1023 : Error | 1 | months |
| 83 | 24 | Date | Product date, in minutes since 01/01/2026 | 0–16777215 | 1 | min |
| 107 | 1 | NODE One Interconnection | 0 = no NODE One paired, 1 = NODE One paired | — | — | — |

---

## 4. Frame 0x03 — NODE One Remote Probe Status

Transmitted only when a NODE One probe is paired with the head.

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-----------:|-------|-------------|-------|-------|------|
| 0 | 8 | Product Type | 0xD2 / 0xD6 | — | — | — |
| 8 | 4 | Message Type | 0x03 | — | — | — |
| 12 | 4 | Version | 0 | — | — | — |
| 16 | 24 | Interconnection ID | 0 = no probe paired, 1–16777215 = FLOW ↔ NODE One pairing identifier | — | — | — |
| 40 | 2 | Probe Base Detection | 0 = base not detected, 1 = base detected, 2 = probe just removed, 3 = probe just installed | — | — | — |
| 42 | 1 | Probe Temperature Sensor Status | 0 = sensor OK, 1 = sensor faulty | — | — | — |
| 43 | 2 | Probe Battery Level | 0 = High (>50 %), 1–2 = Reserved, 3 = Critical (<1 %) | — | — | — |
| 45 | 10 | Probe Battery Voltage | Voltage of the NODE One battery | 0–1000<br>1021 : No battery<br>1022 : Reserved<br>1023 : Error | 5 | mV |
| 55 | 8 | Frames Received | NODE One frames received by FLOW over the last 24 h | 0–255 | 1 | frames |
| 63 | 8 | Radio Link Quality | Absolute RSSI of the last NODE One frame (unsigned; 50 means -50 dBm) | 0–255 | -1 | dBm |

---

## 5. Frame 0x04 — Product Configuration (version 2)

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-----------:|-------|-------------|-------|-------|------|
| 0 | 8 | Product Type | 0xD2 / 0xD6 | — | — | — |
| 8 | 4 | Message Type | 0x04 | — | — | — |
| 12 | 4 | Version | 2 | — | — | — |
| 16 | 3 | Reconfiguration Source | 0 = NFC, 1 = application downlink, 2 = product startup, 3–4 = reserved, 5 = periodic (7 days), 6 = manual action, 7 = reserved | — | — | — |
| 19 | 2 | Reconfiguration Status | 0 = total success, 1 = partial success, 2 = total failure, 3 = reserved | — | — | — |
| 21 | 3 | Periodic Period — Regulation ON | Periodic frame interval while regulating | 1–6 | 10 | min |
| 24 | 8 | Periodic Period — Regulation OFF | Periodic frame interval while not regulating | 1–144 | 10 | min |
| 32 | 1 | Child Lock Enable | 0 = disabled, 1 = enabled | — | — | — |
| 33 | 1 | Child Lock Offline Behavior | 0 = kept when disconnected, 1 = released when disconnected | — | — | — |
| 34 | 1 | Regulation Enable | 0 = disabled, 1 = enabled | — | — | — |
| 35 | 6 | Minimum Wheel Temperature | Lowest setpoint reachable with the wheel, 0.5 °C step | 0–62<br>63 : Error | 0.5 | °C |
| 41 | 6 | Maximum Wheel Temperature | Highest setpoint reachable with the wheel, 0.5 °C step | 0–62<br>63 : Error | 0.5 | °C |
| 47 | 1 | Frost Protection Enable | 0 = disabled, 1 = enabled | — | — | — |
| 48 | 6 | Frost Protection Threshold | Activation threshold, 0.5 °C step | 0–62 | 0.5 | °C |
| 54 | 1 | Open Window Detection Enable | 0 = disabled, 1 = enabled | — | — | — |
| 55 | 5 | Open Window Temperature Drop | Drop triggering the detection, 0.1 °C step | 1–30 | 0.1 | °C/min |
| 60 | 6 | Open Window Pause Duration | Regulation pause after a detection | 1–60 | 1 | min |
| 66 | 7 | Internal Temperature Offset | Offset applied to the internal sensor, 0.1 °C step | 0–100 | 0.1 | °C (-5 … +5) |
| 73 | 7 | Regulation Tolerance | Allowed gap between setpoint and ambient temperature | 1–99 | 0.1 | °C |
| 80 | 6 | Comfort Temperature | Comfort mode setpoint, 0.5 °C step | 0–62<br>63 : Error | 0.5 | °C |
| 86 | 6 | Eco Temperature | Eco mode setpoint, 0.5 °C step | 0–62<br>63 : Error | 0.5 | °C |
| 92 | 6 | Extended Absence Temperature | Extended absence setpoint, 0.5 °C step | 0–62<br>63 : Error | 0.5 | °C |
| 98 | 7 | Low Battery Valve Opening | Valve opening in low battery mode | 0–99 | 1 | % |
| 105 | 4 | Protocol & Region | 01 = LR-EU868, 02–13 = reserved | — | — | — |
| 109 | 5 | Time Zone | 0 = UTC-12 … 12 = UTC … 26 = UTC+14 | — | 1 | h |
| 114 | 1 | Deferred Network Connection | 0 = no request pending, 1 = join scheduled | — | — | — |
| 115 | 2 | NFC Status | 0 = discoverable, 1 = not discoverable, 2–3 = reserved | — | — | — |
| 117 | 14 | Reserved | — | — | — | — |
| 131 | 1 | Heating Period Enable | 0 = disabled, 1 = enabled | — | — | — |
| 132 | 4 | Heating Start — Month | Month | 1–12 | 1 | month |
| 136 | 5 | Heating Start — Day | Day | 1–31 | 1 | day |
| 141 | 4 | Heating End — Month | Month | 1–12 | 1 | month |
| 145 | 5 | Heating End — Day | Day | 1–31 | 1 | day |
| 150 | 1 | Scheduling Enable | 0 = disabled, 1 = enabled | — | — | — |
| 151 | 16 | Weekly Planning | [15..14] Monday, [13..12] Tuesday, [11..10] Wednesday, [9..8] Thursday, [7..6] Friday, [5..4] Saturday, [3..2] Sunday, [1..0] unused — each pair: 0 = profile 1, 1 = profile 2, 2 = profile 3 | — | — | — |
| 167 | 16 | Downlink FCnt | FCnt of the downlink that triggered the reconfiguration | — | — | — |
| 183 | 1 | BOOST Enable | 0 = disabled, 1 = enabled | — | — | — |
| 184 | 7 | BOOST Duration | BOOST activation duration | 10–120 | 1 | min |
| 191 | 7 | Valve Opening — Regulation OFF | Valve opening while regulation is disabled | 0–100 | 1 | % |

### Version history

| Bits | Version 3 | Version 2 | Version 1 |
|---|---|---|---|
| 0 … 182 | Present | Present | Present, identical to V2 |
| 183 … 197 | Present | Added in V2 | Absent |
| 198 | Added in V3 | Absent | Absent |

**Bit 198 (V3) — LoRaWAN FUOTA mode:** 0 = FUOTA inactive, 1 = FUOTA active.

> Note: the D1183C table prints this field at offset 192, which conflicts with the version-history annex of the same document (fields 183–197 are the BOOST and valve-opening fields, so the V3 addition lands at 198). The offset above follows the annex.

> `decoderFlow.js` 1.0.6 implements configuration versions **0, 1 and 2**. Version 3 frames are not decoded yet.

---

## 6. Frames 0x05 / 0x06 / 0x07 — Daily Profiles

Same structure for the three profiles; only the message type differs.

| Offset | Size (bit) | Field | Description |
|--------:|-----------:|-------|-------------|
| 0 | 8 | Product Type | 0xD2 / 0xD6 |
| 8 | 4 | Message Type | 0x05 = profile 1, 0x06 = profile 2, 0x07 = profile 3 |
| 12 | 4 | Version | 0 |
| 16 | 3 | Reconfiguration Source | 0 = NFC, 1 = application downlink, 2 = product startup, 3–4 = reserved, 5 = periodic (7 days), 6–7 = reserved |
| 19 | 2 | Reconfiguration Status | 0 = total success, 1 = partial success, 2 = total failure, 3 = reserved |
| 21 | 2 | Slot 1 | Mode for 00:00–00:30 |
| 23 | 2 | Slot 2 | Mode for 00:30–01:00 |
| … | 2 | … | 48 slots of 30 minutes in total |
| 115 | 2 | Slot 48 | Mode for 23:30–00:00 |

**Slot values:** 0 = frost protection, 1 = comfort, 2 = eco, 3 = extended absence.

---

## 7. Downlink Commands (FPort 56)

Downlink layout: header **0x55**, then one or more `Command ID + DATA` pairs, sent in ascending ID order.

| ID | Length (bytes) | Range | Values | Description |
|---|---|---|---|---|
| 0x01 | 0 | — | — | Force an immediate configuration uplink |
| 0x0A | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable the NFC interface |
| 0x1C | 2 | 1–1008 | 10–10080 min | Schedule a deferred network join |
| 0x4A | 1 | 1 | 1 | Reboot the product |
| 0x4B | 1 | 1 | 1 | Restore factory configuration |
| 0x63 | 1 | 0–26 | UTC-12 … UTC+14 | Set the time zone |
| 0x72 | 1 | 0–100 | -5 °C … +5 °C | Internal temperature measurement offset |
| 0x73 | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable open-window detection |
| 0x74 | 1 | 1–30 | 0.1 °C … 3.0 °C | Temperature drop triggering open-window detection |
| 0x75 | 1 | 1–60 | 1–60 min | Regulation pause duration after a detection |
| 0x76 | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable Child Lock |
| 0x77 | 1 | 0–62 | 0–31 °C | Minimum wheel-adjustable temperature |
| 0x78 | 1 | 0–62 | 0–31 °C | Maximum wheel-adjustable temperature |
| 0x79 | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable regulation |
| 0x7A | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable frost protection |
| 0x7B | 1 | 0–62 | 0–31 °C | Frost protection setpoint |
| 0x7C | 1 | 0–62 | 0–31 °C | Comfort setpoint |
| 0x7D | 1 | 0–62 | 0–31 °C | Eco setpoint |
| 0x7E | 1 | 0–62 | 0–31 °C | Extended absence setpoint |
| 0x7F | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable the heating period |
| 0x80 | 2 | 1–12 / 1–31 | month, day | Heating period start date |
| 0x81 | 2 | 1–12 / 1–31 | month, day | Heating period end date |
| 0x82 | 2 | 0–2 | byte 1: [7..6] Mon, [5..4] Tue, [3..2] Wed, [1..0] Thu<br>byte 2: [7..6] Fri, [5..4] Sat, [3..2] Sun, [1..0] unused | Weekly planning (0 = profile 1, 1 = profile 2, 2 = profile 3) |
| 0x83 | 12 | 0–3 | 2 bits per 30 min slot, 48 slots | Daily profile 1 |
| 0x84 | 12 | 0–3 | same format as 0x83 | Daily profile 2 |
| 0x85 | 12 | 0–3 | same format as 0x83 | Daily profile 3 |
| 0x86 | 1 | 1–6 | 10–60 min | Periodic data period, regulation ON |
| 0x87 | 1 | 1–144 | 10–1440 min | Periodic data period, regulation OFF |
| 0x8A | 1 | 0–62 | 0–31 °C | Setpoint temperature |
| 0x8B | 1 | 0–99 | 0–99 % | Valve opening in low battery mode |
| 0x8C | 0 | — | — | Request a motor calibration |
| 0x90 | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable BOOST mode |
| 0x91 | 1 | 10–120 | 10–120 min | BOOST activation duration |
| 0x93 | 1 | 0/1 | 0 = disabled, 1 = enabled | Child Lock behavior on network loss |
| 0x94 | 1 | 1–99 | 0.1 °C … 9.9 °C | Regulation tolerance |
| 0x95 | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable scheduling |
| 0x98 | 1 | 0–100 | 0–100 % | Valve opening while regulation is disabled |

**Example — enable Child Lock:** `55 76 01`

---

## 8. Notes

- Daily profile slot values are the same enumeration in uplink frames 0x05–0x07 and in downlink commands 0x83–0x85.
- Error codes displayed on the product: **F1** calibration failure, **F2** head not mounted on its base, **F4** date/time not set (schedules disabled, 19.5 °C fallback).
- Fields may vary slightly by firmware revision; check the frame version nibble before decoding.

---

## 🧾 Additional Resources

- Online decoder: [https://nexelec-support.fr/n/decoder/](https://nexelec-support.fr/n/decoder/)  
- Downlink builder: [https://nexelec-support.fr/n/downlink/](https://nexelec-support.fr/n/downlink/)  
- Technical documentation: [https://support.nexelec.fr](https://support.nexelec.fr)  
- Source document: **D1183C — FLOW Guide Technique**

---

## 🛠 Maintainer

**Nexelec Support Team**  
Contact: [support@nexelec.fr](mailto:support@nexelec.fr)
