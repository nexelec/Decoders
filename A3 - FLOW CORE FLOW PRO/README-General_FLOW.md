
# FLOW CORE / FLOW PRO — Communication Overview (LoRaWAN)


This document summarizes the communication behavior and message structure of the **FLOW** connected thermostatic valve head.  
It details all **uplink messages (0x01–0x07)** sent via **LoRaWAN**, together with the product functions that drive them.  
Reference: technical guide **D1183C — revision C**.

---

## 1. Scope

- Product: **FLOW CORE** and **FLOW PRO** (LoRaWAN thermostatic radiator valve head)
- Network supported: **LoRaWAN Class A (EU868)**
- Protocol covered: LoRaWAN 1.0.4 (RP002 1.0.4)
- Frames described: 0x01–0x07 uplink, plus the downlink command set
- Companion device covered: **NODE One** remote temperature probe (reported through FLOW)

---

## 2. Product Variants

| Characteristic | FLOW CORE | FLOW PRO |
|---|---|---|
| Product ID (uplink byte 0) | **0xD2** | **0xD6** |
| Power supply | 2 × AA lithium 1.5 V | 4 × AA lithium 1.5 V |
| Mounting base | Standard base supplied (RUG compatible) | Reinforced RUG base supplied |

Both variants share the same firmware functions, the same frame formats and the same LoRaWAN profile.

**Compatible accessories:** NODE One (remote temperature probe), CASE+ (anti-vandalism shell), RUG (reinforced base), ADAPT (valve adapter kit).

---

## 3. Message Taxonomy

| Function | Message Type | ID (Hex) | Transmission | Configurable |
|---|---|---|---|---|
| Periodic data | Measurements & regulation state | **0x01** | Periodic + on event | Yes |
| Product status | Hardware, battery, motor, base | **0x02** | Startup + every 24 h + on change | No |
| NODE One status | Remote probe state | **0x03** | Startup + pairing + every 24 h + on change | No |
| Product configuration | Operating parameters | **0x04** | Startup + every 7 days + on change | No |
| Daily profile n°1 | Heating schedule profile 1 | **0x05** | Startup + every 7 days + on change | No |
| Daily profile n°2 | Heating schedule profile 2 | **0x06** | Startup + every 7 days + on change | No |
| Daily profile n°3 | Heating schedule profile 3 | **0x07** | Startup + every 7 days + on change | No |

Frame 0x03 is transmitted only when a NODE One probe is paired.  
Frames 0x05–0x07 are repeated every 7 days only when scheduling is enabled and the product is inside the heating season.

---

## 4. LoRaWAN Parameters

| Parameter | Value |
|---|---|
| LoRaWAN version | 1.0.4 |
| Regional parameters | RP002 1.0.4 |
| Profile | Class A |
| RX2 default data rate | SF9 (DR3) |
| Band | EU868 |
| Join type | OTAA |
| AppEUI | 70B3D540F70CE4D2 |
| AppKey / DevEUI | Unique per product |
| Application port (uplink / downlink) | 56 |
| ADR | Enabled |

### Join and Retry Behavior
- Two automatic join attempts at power-up. On success the product immediately sends its configuration and status.
- On failure the retry interval doubles: 20 min, then 40 min, then 80 min, and so on.
- After that sequence, one join attempt per day.
- A daily **LinkCheck** is performed together with the product status message; after 3 unanswered checks the product restarts the join procedure.
- A join can be scheduled remotely by downlink (`0x1C`); the acknowledgement appears as *Deferred network connection = 1* in frame 0x04.

### MAC Commands

| Command | When | Purpose |
|---|---|---|
| **LinkCheckReq** | Once a day, with the Product Status frame (0x02) | Network connection check; after 3 unanswered checks the product restarts the join procedure. |
| **DeviceTimeReq** | At start-up, with every frame of the post-join burst (5 to 6 frames: 0x02, 0x03 if a NODE One is paired, 0x04, 0x05–0x07); then once a day, with the Product Status frame (0x02) | Date and time synchronization (UTC) used by the heating schedules and the heating season. |

---

## 5. Temperature Measurement

| Characteristic | Internal sensor | NODE One remote probe |
|---|---|---|
| Typical accuracy | ± 0.4 °C | ± 0.4 °C |
| Maximum accuracy | ± 0.6 °C | ± 0.6 °C |
| Resolution | 0.1 °C | 0.1 °C |
| Measurement range | -20 °C … +60 °C | -20 °C … +60 °C |
| Measurement period | 1 minute | 10 minutes |

- A configurable offset of **-5 °C … +5 °C** can be applied to the internal sensor measurement.
- When a NODE One probe is paired and available, FLOW regulates on the probe value and falls back to the internal sensor automatically if the probe becomes unavailable.
- The measurement source actually in use is reported in every periodic frame (*Source of ambient temperature measurement*).
- Recommended maximum distance between FLOW and NODE One: about 20 m, same room.

---

## 6. Regulation and Scheduling

Setpoints are configurable from **0 °C to 31 °C in 0.5 °C steps**. Four temperature modes are available:

| Mode | Usage |
|---|---|
| **Comfort** | Occupied room |
| **Eco** | Night or short absence (a few hours to two days) |
| **Extended absence** | Long absence (holidays, unoccupied premises) |
| **Frost protection** | Minimum protection temperature (7 °C by default) |

- Up to **3 daily profiles** can be defined; each day is split into **48 slots of 30 minutes**, each slot carrying one of the four modes.
- Each weekday is mapped to one of the three profiles (frame 0x04, *Weekly planning* field).
- A manual change (wheel, NFC or downlink) is **temporary**: it holds until the next scheduled slot change.
- Scheduling requires a valid date and time. Without it, schedules are disabled, the product falls back to a 19.5 °C setpoint and displays error code **F4**.
- Date and time are synchronized automatically from the LoRaWAN network (UTC, MAC command `DeviceTimeReq`, see section 4); the time zone is configurable by downlink (`0x63`) or NFC.

### Manual setpoint and Child Lock
- Wheel adjustment in 0.5 °C steps, default range **15 °C … 26 °C**, configurable.
- **Child Lock** disables wheel adjustment. Its behavior when the product loses network coverage is configurable (lock kept, or automatically released).

### Setpoint display orientation
- The setpoint display can be switched between **horizontal** and **vertical** mode to match the valve mounting orientation.
- Local change: wheel pressed 6 times. Remote change: downlink `0x9A` (0 = horizontal, 1 = vertical).
- The current orientation is reported in frame 0x04 version 3 (bit 199).

---

## 7. Protective and Maintenance Functions

| Function | Default | Range | Behavior |
|---|---|---|---|
| **BOOST** | 30 min | 10–120 min, 10 min steps | Fully opens the valve, whether regulation is enabled or disabled. Holding the button 2 to 10 s makes "UP" blink; releasing it activates BOOST and "UP" is displayed for 5 s as confirmation. A new press restarts the full duration. Reported in frame 0x01. |
| **Frost protection** | 7 °C | 0–31 °C | Applies when regulation is disabled; opens the valve below the threshold. Can be disabled. |
| **Open-window detection** | 1 °C/min drop, 30 min pause | 0.1–3.0 °C/min, 1–60 min | Pauses regulation and closes the valve on a rapid temperature drop. |
| **Anti-seize cycle** | Monthly | — | Full close / full open / return to previous position, while regulation is inactive. Sends no frame of its own. |

Open-window detection ends when the pause duration expires, the setpoint is reached, or the temperature holds or rises for 10 consecutive minutes. It is also cancelled by a wheel change, a BOOST press or removal from the base. A periodic frame is sent immediately at the end of the detection.

---

## 8. Heating Season (Winter / Summer Mode)

A heating period can be defined by start and end date (for example 1 October → 30 April).

| Mode | Behavior |
|---|---|
| **Winter** (inside the heating period) | Normal regulation, schedules applied, advanced functions enabled, periodic data every 10 min by default. |
| **Summer** (outside the heating period) | Regulation disabled, valve held at the configured "regulation off" opening percentage, anti-seize cycle still active, reduced transmission rate. |

---

## 9. Battery Modes

| State | Threshold | Behavior |
|---|---|---|
| **Normal** | > 3000 mV | All functions available. |
| **Low battery** | < 3000 mV | Status frame sent, low-battery icon displayed. All functions still available. |
| **Critical battery** | < 2800 mV | Regulation disabled, valve forced to a partial opening (50 % by default, configurable), periodic data reduced to once per day, FUOTA disabled. |

Battery voltage is reported per slot in frame 0x02, together with a coarse battery level.

---

## 10. Transmission Logic

| Event | Frame(s) sent |
|---|---|
| Power-up (after successful join) | 0x02 + 0x03 (if paired) + 0x04 + 0x05–0x07 |
| Periodic, regulation ON | 0x01 — every 10–60 min (10 min default) |
| Periodic, regulation OFF | 0x01 — every 10–1440 min |
| End of open-window detection | 0x01 (immediate) |
| Head removed from / refitted on its base | 0x02 |
| Motor calibration status change | 0x02 |
| NODE One pairing or probe state change | 0x03 |
| Configuration change (NFC or downlink) | 0x04 (+ 0x05–0x07 if schedules changed) |
| Every 7 days | 0x04 (+ 0x05–0x07 when scheduling is active) |
| Every 24 h | 0x02 (+ 0x03 if paired) + LinkCheck |

---

## 11. Remote Configuration

- Downlinks are sent on **FPort 56**, in response to an uplink (Class A).
- Frame layout: header **0x55** followed by one or more `Command ID + DATA` pairs.
- Command IDs should be sent in ascending order to stay forward compatible.
- After a reconfiguration the product returns an updated 0x04 frame carrying the source, the result and the downlink FCnt that triggered it.
- Commands added in revision C: `0x97` (enable / disable FUOTA mode) and `0x9A` (setpoint display orientation).

The full command list is given in [README-Frames_FLOW.md](README-Frames_FLOW.md).

---

## 12. Decoder Notes

- Decoder file: `decoderFlow.js` (version 1.0.9), LoRa Alliance `decodeUplink()` signature.
- Downlink encoder: `encoderFlow.js` (version 1.0.0), LoRa Alliance `encodeDownlink()` / `decodeDownlink()` signatures, full revision C command set.
- Example uplinks for every frame type and version: [README-Examples_FLOW.md](README-Examples_FLOW.md) / `examples_FLOW.json`.
- Product byte 0xD2 is reported as `FLOW CORE`, 0xD6 as `FLOW PRO` (before version 1.0.8: `FLOW` and `FLOW+`).
- Message type and message version share byte 1 (4 bits each); the decoder branches on both.
- Frame versions found on products in the field: periodic data **version 1**, product configuration **versions 1, 2 and 3**. Version 0 of both frames is still decoded for completeness.
- Periodic frame: versions **0** and **1** supported. Version 0 carries open-window and frost-protection flags; version 1 replaces them with the 4-bit *Regulation mode* field, and the decoder no longer outputs `isWindowOpenActive` / `isFrostProtectActive` for version 1.
- Temperatures are rounded to 0.1 °C. Setpoint change source 5 is reported as `product time not up to date, degraded mode`; RFU values are reported as `reserved`.
- Configuration frame: versions **0, 1, 2 and 3** supported. Version 3 adds `enableFuota` (bit 198) and `setpointDisplayOrientation` (bit 199).
- Error codes are returned as English strings (since 1.0.9): `"Error"` for temperatures (1023), setpoints (63), motor position and stroke (8191) and activation time (1023); battery voltages return `"No battery"` (1021), `"Reserved"` (1022) or `"Error"` (1023).
- Version 1.0.9 also fixes the reading of the low-battery valve opening percentage in configuration version 0.
- Version 1.0.7 fixes the reading of the Wednesday and Friday weekly planning entries and of the low-battery valve opening percentage (configuration versions 1, 2 and 3).

---

## 🧾 Additional Resources

- Online decoder: [https://nexelec-support.fr/n/decoder/](https://nexelec-support.fr/n/decoder/)  
- Downlink builder: [https://nexelec-support.fr/n/downlink/](https://nexelec-support.fr/n/downlink/)  
- Autonomy calculator (VOLT): [https://nexelec-support.fr/n/volt/](https://nexelec-support.fr/n/volt/)  
- Technical documentation: [https://support.nexelec.fr](https://support.nexelec.fr)  
- Source document: **D1183C — FLOW Guide Technique, revision C**

---

## 🛠 Maintainer

**Nexelec Support Team**  
Contact: [support@nexelec.fr](mailto:support@nexelec.fr)
