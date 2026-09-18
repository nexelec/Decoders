
# RELAY (A100LS_C) — Frame Decoding Reference (LoRaWAN Uplink 0x01–0x05)

This document details the **uplink frame structures** of RELAY for LoRaWAN operation, plus the downlink command set.

---

## 1. Conventions

- Product type: **0xD3 (RELAY)** — the same decoder also accepts **0xB0 (SAFECUT)**
- Message type occupies the **whole of byte 1** (no version nibble on this product)
- All offsets and sizes are expressed in **bits**, MSB first
- All messages are transmitted on **FPort 56**
- Power is derived from the measured current assuming a 230 V mains voltage

---

## 2. Frame 0x01 — Periodic Data

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-----------:|-------|-------------|-------|-------|------|
| 0 | 8 | Product Type | 0xD3 | — | — | — |
| 8 | 8 | Message Type | 0x01 | — | — | — |
| 16 | 1 | Relay State | 0 = open (off), 1 = closed (on) | 0–1 | — | — |
| 17 | 12 | Max Power | Highest instantaneous power over the period | 0–3680 | 1 | W |
| 29 | 14 | Measured Energy | Energy consumed between two transmissions | 0–16384 | 1 | Wh |

---

## 3. Frame 0x02 — Product Status

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-----------:|-------|-------------|-------|-------|------|
| 0 | 8 | Product Type | 0xD3 | — | — | — |
| 8 | 8 | Message Type | 0x02 | — | — | — |
| 16 | 8 | HW Version | Hardware version | 0–255 | — | — |
| 24 | 8 | SW Version | Software version | 0–255 | — | — |
| 32 | 1 | Product Status | 0 = OK, 1 = fault | 0–1 | — | — |
| 33 | 1 | Overpower Flag | 0 = no event, 1 = overcurrent occurred | 0–1 | — | — |

> The overpower flag stays at 1 until the relay state is changed by an explicit action (NFC, downlink or button).

---

## 4. Frame 0x03 — Product Configuration

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-----------:|-------|-------------|-------|-------|------|
| 0 | 8 | Product Type | 0xD3 | — | — | — |
| 8 | 8 | Message Type | 0x03 | — | — | — |
| 16 | 2 | Reconfiguration Status | 0 = total success, 1 = partial success, 2 = total failure, 3 = reserved | — | — | — |
| 18 | 8 | Transmission Period | Period between two measurement uplinks | 5–60 | 1 | min |
| 26 | 3 | Reconfiguration Source | 0 = NFC, 1 = downlink, 2 = product startup, 3 = interconnection, 4 = button, 5 = weekly frame, 6 = overcurrent, 7 = timer | — | — | — |
| 29 | 2 | NFC Status | 0 = modifiable (discoverable), 1 = not modifiable | — | — | — |
| 31 | 12 | Overcurrent Protection | Protection threshold, 0 = disabled | 0–3680 | 1 | W |
| 43 | 1 | Pending Join | 0 = no join scheduled, 1 = join scheduled | — | — | — |

---

## 5. Frame 0x04 — Relay State

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-----------:|-------|-------------|-------|-------|------|
| 0 | 8 | Product Type | 0xD3 | — | — | — |
| 8 | 8 | Message Type | 0x04 | — | — | — |
| 16 | 1 | Relay State | 0 = open (off), 1 = closed (on) | 0–1 | — | — |
| 17 | 3 | State Change Source | 0 = NFC, 1 = downlink, 2 = product startup, 3 = interconnection, 4 = button, 5 = weekly frame, 6 = overcurrent, 7 = timer | — | — | — |

---

## 6. Frame 0x05 — Power-Cut Frame

| Offset | Size (bit) | Field | Description |
|--------:|-----------:|-------|-------------|
| 0 | 8 | Product Type | 0xD3 |
| 8 | 8 | Message Type | 0x05 |

Sent when mains power is lost. The frame carries no further payload.

---

## 7. Downlink Commands (FPort 56)

Downlink layout: header **0x55**, then one or more `Command ID + DATA` pairs, sent in ascending ID order.  
RELAY is a **Class C** device: downlinks can be delivered at any time, without waiting for an uplink.

| ID | Length (bytes) | Range | Values | Description |
|---|---|---|---|---|
| 0x01 | 0 | — | — | Force an immediate configuration uplink |
| 0x0A | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable the NFC interface |
| 0x1C | 2 | 1–1008 | 10–10080 min | Schedule a deferred network join |
| 0x2F | 1 | 5–60 | 5–60 min | Period between two measurements |
| 0x61 | 1 | 0/1 | 0 = off, 1 = on | Relay ON / OFF |
| 0x88 | 2 | 0–3680 | 0–3680 W | Overcurrent protection threshold (0 = disabled) |
| 0x89 | 3 | 0–1 then 1–1440 | state, then duration in minutes | Force the relay to a state for 1–1440 min, then switch to the opposite state |

### Examples

| Downlink | Effect |
|---|---|
| `55 61 01` | Force the relay ON |
| `55 89 00 01 68` | Force the relay OFF for 360 min (6 h), then back ON |

---

## 8. Notes

- Frames 0x01 and 0x04 both report the relay state; 0x04 adds the origin of the change and is sent only on transition.
- An overcurrent trip produces a 0x04 frame with source = 6, and raises the overpower flag in the next 0x02 frame.
- Fields may vary slightly by firmware revision.

---

## 🧾 Additional Resources

- Online decoder: [https://nexelec-support.fr/n/decoder/](https://nexelec-support.fr/n/decoder/)  
- Downlink builder: [https://nexelec-support.fr/n/downlink/](https://nexelec-support.fr/n/downlink/)  
- Technical documentation: [https://support.nexelec.fr](https://support.nexelec.fr)  
- Source document: **D1161A — Relay Class C LoRa Guide Technique**

---

## 🛠 Maintainer

**Nexelec Support Team**  
Contact: [support@nexelec.fr](mailto:support@nexelec.fr)
