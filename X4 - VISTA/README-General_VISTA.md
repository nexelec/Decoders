
# VISTA SPACE / FEEL / MOVE / WAVE / RISE — Communication Overview (LoRaWAN)


This document summarizes the communication behavior and message structure of the **VISTA** connected ambient sensors.  
It details all **uplink messages (0x1–0x7)** sent via **LoRaWAN**, together with the product functions that drive them.  
Reference: technical guide **D1196A — revision A** (21/10/2026).

---

## 1. Scope

- Products: **VISTA SPACE, VISTA FEEL, VISTA MOVE, VISTA WAVE, VISTA RISE** (battery-powered indoor ambient sensors, configurable by NFC)
- Network supported: **LoRaWAN Class A (EU868)**
- Protocol covered: LoRaWAN 1.0.4 (RP002 1.0.4)
- Frames described: 0x1–0x7 uplink, plus the downlink command set

---

## 2. Product Variants

| Model | Product | Product ID (uplink byte 0) | Temperature / Humidity | CO2 | Motion (PIR) | Luminosity |
|---|---|---|:-:|:-:|:-:|:-:|
| X410LS | VISTA SPACE | **0xDA** | | | ● | ● |
| X420LS | VISTA FEEL | **0xD7** | ● | | | |
| X430LS | VISTA MOVE | **0xD8** | ● | | ● | ● |
| X440LS | VISTA WAVE | **0xD9** | ● | ● | ● | ● |
| X450LS | VISTA RISE | **0xDB** | ● | ● | | |

- Power supply: 1 × CR123 lithium battery.
- Operating temperature: 0 … 50 °C for WAVE and RISE, -20 … 60 °C for SPACE, FEEL and MOVE. Indoor use, 0–99 %RH without condensation.
- CO2 sensor lifetime: 15 years (WAVE and RISE).
- Every product is fitted with an **anti-tear detection**: a frame is sent as soon as the product is placed on or removed from its base.

---

## 3. Message Taxonomy

| Function | Products | ID (Hex) | Transmission | Can be disabled | Configurable |
|---|---|---|---|---|---|
| Periodic data | All | **0x1** | Periodic + on event | Yes | Yes |
| Historical data (datalog) — CO2 | WAVE, RISE | **0x2** | Periodic | Yes | Yes |
| Historical data (datalog) — temperature | FEEL, MOVE, WAVE, RISE | **0x3** | Periodic | Yes | Yes |
| Historical data (datalog) — humidity | FEEL, MOVE, WAVE, RISE | **0x4** | Periodic | Yes | Yes |
| Product status | All | **0x5** | Startup + every 24 h + on event | No | No |
| Product configuration | All | **0x6** | Startup + every 7 days + on change | No | No |
| Presence alert | SPACE, MOVE, WAVE | **0x7** | On event | Yes | Yes |

The message type is coded on the high nibble of byte 1, the message version on the low nibble.

---

## 4. LoRaWAN Parameters

| Parameter | Value |
|---|---|
| LoRaWAN version | 1.0.4 |
| Regional parameters | RP002 1.0.4 |
| Profile | Class A (RX2 SF9 or SF12) |
| Band | EU868 |
| Join type | OTAA |
| AppEUI | 70B3D540F2AC826D |
| AppKey / DevEUI | Unique per product |
| Application port (uplink / downlink) | 56 |
| ADR | Enabled |

### Join and Retry Behavior
- Two automatic join attempts at power-up. On success the product immediately sends its configuration and status.
- On failure the retry interval doubles: 20 min, then 40 min, then 80 min, and so on.
- After that sequence, one join attempt per day.
- A daily **LinkCheck** is performed together with the product status message; after 3 unanswered checks the product restarts the join procedure.
- A join can be scheduled remotely by downlink (`0x1C`); the acknowledgement appears as *Deferred network connection = 1* in frame 0x6.
- A short press on the command button triggers a manual join attempt.

### L2D1 Direct Radio Link
VISTA also supports **L2D1**, the Nexelec direct radio protocol, used for example to send the room temperature straight to a FLOW thermostatic head without gateway. The product enters L2D1 pairing mode for about 1 minute after power-up, or after a short press on the command button. L2D1 traffic is not visible on LoRaWAN.

---

## 5. Measurements

| Measure | Unit | Range | Resolution | Accuracy (typ.) |
|---|---|---|---|---|
| CO2 | ppm | 0 – 10 000 | 1 | 0–5000 ppm: ±(50 ppm + 3 % of reading); 5001–10 000 ppm: ±10 % of reading |
| Temperature | °C | -30 – +70 | 0.1 | ±0.2 °C (max ±0.4 °C) |
| Humidity | %RH | 0 – 100 | 0.5 | ±2 %RH (max ±3 %RH) |
| Luminosity | lux | 0 – 5100 | 5 | ±5 lux |
| Presence | presence / absence | 0 / 1 | — | — |
| Activity index | % | 0 – 100 | 1 | — |

- Default measurement period: **10 minutes**. CO2, temperature, humidity and luminosity are measured just before each transmission.
- **CO2 speed-up:** when the CO2 level is medium or high, the CO2 measurement period drops to 5 minutes; it returns to 10 minutes once the level is good again. This has no effect on the LoRaWAN transmission rate.

---

## 6. Product Functions

### CO2 measurement (WAVE, RISE)
- NDIR sensor with **automatic baseline correction (ABC)**, enabled by default. It needs fresh air (around 400 ppm) at least once every 8 days; disable it in rooms with permanent occupancy or poor air renewal.
- **Manual calibration:** remove the product from its base, expose it to fresh air for at least 10 minutes, then press the anti-tear button 6 times. Orange LED = calibration running, green = success, red = failure. The number of days since the last manual calibration is reported in frame 0x5.

### CO2 LED indicator (WAVE, RISE)
| Air quality | LED |
|---|---|
| Good | No blinking |
| Medium, ventilation advised | Orange blinking |
| High, ventilation required | Red blinking |

- Thresholds: **800 ppm** (good / medium) and **1500 ppm** (medium / high) by default, configurable 0–5000 ppm.
- LED indicator and orange level are both disabled by default and can be enabled separately.

### Motion detection (SPACE, MOVE, WAVE)
- PIR sensor, range up to 5.5 m, 120° coverage, continuous measurement.
- **Presence alert:** a frame 0x7 "occupied" is sent as soon as motion is detected; after **30 minutes** (configurable 5–60 min) without motion, a frame 0x7 "vacant" is sent.
- **Activity index:** 0 (no activity) to 100 (high activity), reported in the periodic frame.

### NFC
- Configuration, last measurements and firmware update through the **NFC TOUCH** application (Android, iOS). Works through the packaging and when the product is off.
- The NFC interface can be made non-discoverable by downlink to prevent local reconfiguration after deployment.

---

## 7. Transmission Modes

### Periodic data
- Frame 0x1 every **30 minutes** by default (configurable 10–60 min).
- Between two periodic frames, a frame is sent immediately when a measure changes by more than its **delta**: **150 ppm** for CO2, **0.5 °C** for temperature by default.

### Historical data (datalog) and redundancy
- Groups several measures in one frame. One frame per measure type (CO2 0x2, temperature 0x3, humidity 0x4).
- Measures are ordered from the most recent to the oldest; the period between two measures is given in each frame.
- Three parameters: number of new measures per frame (default 6), transmission period (default 3 h, 30 min – 24 h), number of transmissions of a same measure (default 3).
- In Europe a frame holds at most **36 measures**: *new measures × repetitions ≤ 36*.
- Example: 12 new measures, 6 h period, 3 repetitions → one measure every 30 min, a frame every 6 h carrying 36 measures (12 new, 24 repeated).

---

## 8. Transmission Logic

| Event | Frame(s) sent |
|---|---|
| Power-up (after successful join) | 0x6 + 0x5 |
| Periodic | 0x1 — every 10–60 min (30 min default) |
| Measure change above its delta | 0x1 (immediate) |
| Datalog period elapsed | 0x2 / 0x3 / 0x4, one per enabled measure |
| Motion detected / no motion for the configured period | 0x7 |
| Product placed on / removed from its base, hardware status change, join request scheduled | 0x5 |
| Configuration change (NFC or downlink), join request | 0x6 |
| Every 7 days | 0x6 |
| Every 24 h | 0x5 + LinkCheck |

---

## 9. Remote Configuration

- Downlinks are sent on **FPort 56**, in response to an uplink (Class A).
- Frame layout: header **0x55** followed by one or more `Command ID + DATA` pairs.
- Command IDs should be sent in ascending order to stay forward compatible.
- After a reconfiguration the product returns an updated 0x6 frame carrying the source, the result and the downlink FCnt that triggered it.

The full command list is given in [README-Frames_VISTA.md](README-Frames_VISTA.md).

---

## 10. Decoder Notes

- Decoder file: `decoderVista.js` (version 1.0.0), LoRa Alliance `decodeUplink()` signature.
- Message type and message version share byte 1 (4 bits each). Fields are not byte aligned; the decoder reads each field at the offset given in the technical guide.
- The periodic and configuration frames have one layout per product; the decoder branches on the product byte.
- Output field names follow the FLOW and X2 decoders (`statusProduct`, `timeActivation`, `downlinkFcnt`, `enableFuota`, `isFuotaPending`, `bootloaderVersion`…).
- Error codes are returned as strings: `"error"`, `"deconnected sensor"` (sensor not present), `"desactivated sensor"`, `"end of life sensor"`; datalog arrays may mix numbers and these strings.
- The periodic presence flag (0 = absence, 1 = presence) and the presence alert (0 = occupied, 1 = vacant) are both output as `presence` with the values `"presence"` / `"absent"`.
- Software and bootloader versions are returned as raw values (e.g. 123 for V12.3).

---

## 🧾 Additional Resources

- Online decoder: [https://nexelec-support.fr/n/decoder/](https://nexelec-support.fr/n/decoder/)  
- Downlink builder: [https://nexelec-support.fr/n/downlink/](https://nexelec-support.fr/n/downlink/)  
- Autonomy calculator (VOLT): [https://nexelec-support.fr/n/volt/](https://nexelec-support.fr/n/volt/)  
- Technical documentation: [https://support.nexelec.fr](https://support.nexelec.fr)  
- Source document: **D1196A — VISTA Guide Technique, revision A**

---

## 🛠 Maintainer

**Nexelec Support Team**  
Contact: [support@nexelec.fr](mailto:support@nexelec.fr)
