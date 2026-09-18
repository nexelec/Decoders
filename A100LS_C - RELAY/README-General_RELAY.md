
# RELAY (A100LS_C) — Communication Overview (LoRaWAN)


This document summarizes the communication behavior and message structure of the **RELAY** connected relay module.  
It details all **uplink messages (0x01–0x05)** sent via **LoRaWAN Class C**, together with the product functions that drive them.

---

## 1. Scope

- Product: **RELAY** (A100LS_C) — switching and energy-metering module
- Network supported: **LoRaWAN Class C (EU868)**
- Protocol covered: LoRaWAN 1.0.4 (RP001 1.1 rev B / RP002 1.0.3)
- Frames described: 0x01–0x05 uplink, plus the downlink command set

> The shared decoder `decoderA100.js` also recognises product type **0xB0 (SAFECUT)**, a Class A product documented separately in guide D1189A.

---

## 2. Product Functions

| Function | Description |
|---|---|
| **Relay switching** | Opens or closes the supply of a connected appliance — remotely, by button, by NFC or on a timer. |
| **Energy metering** | Continuous consumption measurement, transmitted at regular intervals. |
| **Max power** | Highest instantaneous power measured over the last measurement period. |
| **Overcurrent protection** | Forces the relay OFF above a configured power threshold. Configurable 1–3680 W by NFC or downlink, disabled by default. |
| **Timed control** | A downlink can force the relay to a state for 1–1440 minutes; it then reverts to the opposite state. |
| **Power-cut frame** | A dedicated frame sent when mains power is lost. |

### Measurement accuracy

| Quantity | Accuracy |
|---|---|
| Max active power (W) | < 5 % |
| Energy (Wh) | < 5 % |

> The product measures current and converts to watts assuming a **230 V** mains voltage.

### Operating conditions

| Parameter | Value |
|---|---|
| Environment | Indoor |
| Temperature | -20 °C … +50 °C |
| Relative humidity | 0 % … 95 % RH (non-condensing) |
| Weight | 200 g |

---

## 3. Message Taxonomy

| Function | Message Type | ID (Hex) | Transmission | Configurable |
|---|---|---|---|---|
| Periodic data | Relay state, max power, energy | **0x01** | Periodic + on event | Yes |
| Product status | Hardware, firmware, overpower flag | **0x02** | Every 24 h + on event | No |
| Product configuration | Operating parameters | **0x03** | Every 7 days + on event | No |
| Relay state | Relay state + change source | **0x04** | On change | No |
| Power-cut frame | Mains loss notification | **0x05** | On event | No |

---

## 4. LoRaWAN Parameters

| Parameter | Value |
|---|---|
| LoRaWAN version | 1.0.4 |
| Regional parameters | RP001 1.1 rev B / RP002 1.0.3 |
| Profile | **Class C** |
| Band | EU868 |
| Join type | OTAA |
| AppEUI | 70B3D540F00AA9A0 |
| AppKey / DevEUI | Unique per product |
| Application port (uplink / downlink) | 56 |
| ADR | Enabled |

Being a **Class C** device, RELAY keeps its receive window open outside transmissions: a downlink can be delivered at any time without waiting for an uplink.

### Join and Retry Behavior
- Two automatic join attempts at power-up. On success the product sends its configuration and status.
- On failure the retry interval doubles: 20 min, then 40 min, then 80 min.
- After that sequence, one join attempt per day.
- A daily **LinkCheck** is performed with the product status message; after 3 unanswered checks the product restarts the join procedure.
- A join can be scheduled remotely by downlink (`0x1C`); the acknowledgement appears as *Pending join = 1* in frame 0x03.

---

## 5. Relay Control

The relay state can be changed from several sources, each reported in frame 0x04:

| Source value | Origin |
|---|---|
| 0 | NFC |
| 1 | Downlink |
| 2 | Product startup |
| 3 | Interconnection |
| 4 | Button |
| 5 | Weekly frame |
| 6 | Overcurrent |
| 7 | Timer |

- **Button:** a short press toggles the relay; the button is reachable by removing the product cover. A double press triggers a manual join attempt.
- **Overcurrent:** when the configured threshold is exceeded, the relay is forced open and the overpower flag is raised in frame 0x02. The flag stays at 1 until the relay state is changed by an explicit action (NFC, downlink or button).
- **Timer:** downlink `0x89` sets a state for 1–1440 minutes, after which the relay switches to the opposite state.

---

## 6. Configuration Summary

| Parameter | Default | Configurable range |
|---|---|---|
| Transmission period | 10 min | 5–60 min |
| Relay forced state | 1 (ON) | 0–1 |
| Join request at next communication | 0 | 1 |
| Overcurrent protection | 0 (disabled) | 1–3680 W |

Configuration is available locally over **NFC** (Nexelec TOUCH application) and remotely by **downlink**. The NFC interface can itself be disabled remotely (`0x0A`) so the product can no longer be reconfigured from a phone once deployed.

---

## 7. Transmission Logic

| Event | Frame(s) sent |
|---|---|
| Power-up (after successful join) | 0x02 + 0x03 |
| Periodic measurement | 0x01 — every 5–60 min (10 min default) |
| Relay state change (any source) | 0x04 |
| Overcurrent trip | 0x04 + 0x02 |
| Mains power loss | 0x05 |
| Configuration change (NFC or downlink) | 0x03 |
| Every 7 days | 0x03 |
| Every 24 h | 0x02 + LinkCheck |

---

## 8. Remote Configuration

- Downlinks are sent on **FPort 56**.
- Frame layout: header **0x55** followed by one or more `Command ID + DATA` pairs.
- Command IDs should be sent in ascending order to stay forward compatible.
- After a reconfiguration the product returns an updated 0x03 frame with the source and the result.

The full command list is given in [README-Frames_RELAY.md](README-Frames_RELAY.md).

---

## 9. Decoder Notes

- Decoder file: `decoderA100.js` (version 1.0.2), LoRa Alliance `decodeUplink()` signature.
- Product byte 0xD3 is reported as `Relay`, 0xB0 as `Safecut`.
- Unlike the FLOW and X2 codecs, the message type occupies the **full byte 1** — there is no message version nibble.
- `thresholdOvercurrentProtection` returns `"off"` when the threshold is 0, and the wattage otherwise; `enableOvercurrentProtection` is derived from the same field.
- The cut-off frame (0x05) carries no payload beyond its header, so the decoder returns only the product and message type.

---

## 🧾 Additional Resources

- Online decoder: [https://nexelec-support.fr/n/decoder/](https://nexelec-support.fr/n/decoder/)  
- Downlink builder: [https://nexelec-support.fr/n/downlink/](https://nexelec-support.fr/n/downlink/)  
- TOUCH application documentation: [https://support.nexelec.fr/fr/support/solutions/folders/80000680573](https://support.nexelec.fr/fr/support/solutions/folders/80000680573)  
- Technical documentation: [https://support.nexelec.fr](https://support.nexelec.fr)  
- Source document: **D1161A — Relay Class C LoRa Guide Technique**

---

## 🛠 Maintainer

**Nexelec Support Team**  
Contact: [support@nexelec.fr](mailto:support@nexelec.fr)
