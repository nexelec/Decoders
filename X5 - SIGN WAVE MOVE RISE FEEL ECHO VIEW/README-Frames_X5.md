
# X5 Family — Frame Decoding Reference (LoRaWAN & Sigfox Uplink)

This document details the **uplink frame structures** of the Nexelec X5 family:  
**SIGN, RISE, MOVE, WAVE, FEEL, ECHO, VIEW**.

---

## 1. Conventions

- Message type occupies the **whole of byte 1** (no version nibble on this range)
- All offsets and sizes are expressed in **bits**, MSB first
- LoRaWAN messages are transmitted on **FPort 56**
- Temperature is coded on 10 bits with a 30 °C offset (0 = -30 °C, 300 = 0 °C, 1000 = 70 °C)
- Two frame families coexist: **EU868 / IN865** (long payloads) and **US915 / AU915 / Sigfox** (reduced payloads)

### Product identifiers (byte 0)

| Model | Reference | Product ID |
|---|---|---|
| FEEL | X580 | **0xA9** |
| RISE | X520 | **0xAA** |
| MOVE | X590 | **0xAB** |
| WAVE | X530 | **0xAC** |
| SIGN | X565 | **0xAD** |
| ECHO | X570 | **0xC9** |
| VIEW | X575 | **0xCA** |

### Message identifiers (byte 1)

| Function | EU868 / IN865 | US915 / AU915 / Sigfox |
|---|---|---|
| Periodic data | **0x01** | **0x11** |
| Historical data — CO₂ | **0x02** | **0x02** |
| Historical data — Temperature | **0x03** | **0x03** |
| Historical data — Humidity | **0x04** | **0x04** |
| Product status | **0x05** | **0x15** |
| Product configuration | **0x06** | **0x16** (frame 1) + **0x17** (frame 2) |

---

## 2. Frame 0x01 — Periodic Data (LoRaWAN EU868 / IN865)

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-----------:|-------|-------------|-------|-------|------|
| 0 | 8 | Product Type | See product ID table | — | — | — |
| 8 | 8 | Message Type | 0x01 | — | — | — |
| 16 | 10 | Temperature | 30 °C offset | 0–1000<br>1021 : Sensor disabled<br>1022 : Sensor absent<br>1023 : Error | 0.1 | °C |
| 26 | 10 | Humidity | Relative humidity | 0–1000<br>1021 : Sensor disabled<br>1022 : Sensor absent<br>1023 : Error | 0.1 | %RH |
| 36 | 14 | CO₂ | CO₂ concentration | 0–10000<br>16381 : Sensor disabled<br>16382 : Sensor absent<br>16383 : Error | 1 | ppm |
| 50 | 14 | Reserved | — | — | — | — |
| 64 | 10 | Luminosity | Ambient light | 0–1020<br>1021 : Sensor disabled<br>1022 : Sensor absent<br>1023 : Error | 5 | lux |
| 74 | 1 | Button | 0 = no press detected, 1 = press detected | — | — | — |
| 75 | 7 | Average Noise | Mean sound level | 35–120<br>125 : Sensor disabled<br>126 : Sensor absent<br>127 : Error | 1 | dBA |
| 82 | 7 | Peak Noise | Maximum sound level | 35–120<br>125 : Sensor disabled<br>126 : Sensor absent<br>127 : Error | 1 | dBA |
| 89 | 7 | Occupancy Rate | Occupancy over the period | 0–100<br>125 : Sensor disabled<br>126 : Sensor absent<br>127 : Error | 1 | % |
| 96 | 3 | IAQ Global | iZiAIR level — 0 = very good, 2 = medium, 4 = warning, 7 = error (1, 3, 5–6 reserved) | — | — | — |
| 99 | 4 | IAQ Source | Main pollutant — 0 = none, 5 = CO₂, 6 = VOC, 15 = error (1–4, 7–14 reserved) | — | — | — |
| 103 | 3 | IAQ CO₂ | CO₂-specific iZiAIR level, same enumeration as IAQ Global | — | — | — |
| 106 | 3 | Reserved | — | — | — | — |
| 109 | 9 | AirDrive Index | AirDrive index | 0–500<br>509 : Sensor disabled<br>510 : Sensor absent<br>511 : Error | 1 | — |
| 118 | 14 | Estimated CO₂ | Estimated CO₂ concentration | 0–5000<br>16381 : Sensor disabled<br>16382 : Sensor absent<br>16383 : Error | 1 | ppm |

> `decoderLoRaSigfoxX5.js` 1.0.0 decodes up to the AirDrive index; the **Estimated CO₂** field is not exposed in the decoder output.

---

## 3. Frame 0x11 — Periodic Data (LoRaWAN US915 / AU915 / Sigfox)

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-----------:|-------|-------------|-------|-------|------|
| 0 | 8 | Product Type | See product ID table | — | — | — |
| 8 | 8 | Message Type | 0x11 | — | — | — |
| 16 | 10 | Temperature | 30 °C offset | 0–1000<br>1021 : Sensor disabled<br>1022 : Sensor absent<br>1023 : Error | 0.1 | °C |
| 26 | 8 | Humidity | Relative humidity | 0–200<br>253 : Sensor disabled<br>254 : Sensor absent<br>255 : Error | 0.5 | %RH |
| 34 | 14 | CO₂ | CO₂ concentration | 0–10000<br>16381 : Sensor disabled<br>16382 : Sensor absent<br>16383 : Error | 1 | ppm |
| 48 | 10 | Reserved | — | — | — | — |
| 58 | 8 | Luminosity | Ambient light | 0–200<br>253 : Sensor disabled<br>254 : Sensor absent<br>255 : Error | 20 | lux |
| 66 | 1 | Button | 0 = no press detected, 1 = press detected | — | — | — |
| 67 | 7 | Average Noise | Mean sound level | 35–120<br>125 : Sensor disabled<br>126 : Sensor absent<br>127 : Error | 1 | dBA |
| 74 | 7 | Peak Noise | Maximum sound level | 35–120<br>125 : Sensor disabled<br>126 : Sensor absent<br>127 : Error | 1 | dBA |
| 81 | 7 | Occupancy Rate | Occupancy over the period | 0–100<br>125 : Sensor disabled<br>126 : Sensor absent<br>127 : Error | 1 | % |

---

## 4. Frames 0x02 / 0x03 / 0x04 — Historical Data (Datalog)

Datalog measurements are ordered from the most recent to the oldest: measurement `[n]` is the current value, `[n-1]` the previous one, and so on. Each measurement is coded on **10 bits**.

| Measurement | Coding | Range | Scale | Unit |
|---|---|---|---|---|
| Temperature | 30 °C offset | 0–1000<br>1023 : Error | 0.1 | °C |
| CO₂ | 5 ppm resolution | 0–1000<br>1023 : Error | 5 | ppm |
| Humidity | 0.1 %RH resolution | 0–1000<br>1023 : Error | 0.1 | %RH |

### Frame layout

| Offset | Size (bit) | Field | Description | Range (EU868 / IN865) | Range (US915 / AU915 / Sigfox) |
|--------:|-----------:|-------|-------------|---|---|
| 0 | 8 | Product Type | See product ID table | — | — |
| 8 | 8 | Message Type | 0x02 = CO₂, 0x03 = Temperature, 0x04 = Humidity | — | — |
| 16 | 6 | Number of Measurements | Total measurements carried in the message | 1–36 | 1–6 |
| 22 | 8 | Period Between Measurements | Time between two measurements | 1–144 (× 10 min) | 1–144 (× 10 min) |
| 30 | 6 | Repeat | Number of repetitions of the same measurement | 1–24 | 1–5 |
| 36 | 10 | Measurement [n] | Most recent value | See coding table | See coding table |
| 46 | 10 | Measurement [n-1] | Previous value | See coding table | See coding table |
| … | 10 | Measurement [n-x] | … | — | — |
| … | — | Padding | Zero-filled to reach a whole number of bytes | 0 | 0 |

> The ratio *(transmission period / number of measurements)* must stay between **5 and 30**.  
> Example: with a 30-minute transmission period, a frame cannot carry more than 6 measurements.

---

## 5. Frame 0x05 — Product Status (LoRaWAN EU868 / IN865)

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-----------:|-------|-------------|-------|-------|------|
| 0 | 8 | Product Type | See product ID table | — | — | — |
| 8 | 8 | Message Type | 0x05 | — | — | — |
| 16 | 8 | HW Version | Hardware version | 0–250 | — | — |
| 24 | 8 | SW Version | Software version | 0–250 | — | — |
| 32 | 2 | Power Supply | 0 = battery, 1 = external 5 V, 2–3 = reserved | — | — | — |
| 34 | 10 | Battery Voltage | Battery voltage | 0–1000<br>1022 : External supply<br>1023 : Error | 5 | mV |
| 44 | 3 | Battery Level | 0 = High (>50 %), 1 = Medium (10–50 %), 2 = Low (1–10 %), 3 = Critical (<1 %), 4 = External supply, 5–7 = reserved | — | — | — |
| 47 | 1 | Global Product Status | 0 = hardware OK, 1 = hardware fault | — | — | — |
| 48 | 3 | Temperature / Humidity Sensor Status | See sensor status codes | — | — | — |
| 51 | 3 | CO₂ Sensor Status | See sensor status codes | — | — | — |
| 54 | 3 | VOC Sensor Status | See sensor status codes | — | — | — |
| 57 | 3 | PIR Sensor Status | See sensor status codes | — | — | — |
| 60 | 3 | Microphone Status | See sensor status codes | — | — | — |
| 63 | 3 | Luminosity Sensor Status | See sensor status codes | — | — | — |
| 66 | 3 | SD Card Status | 0 = OK, 1 = mount error, 2 = card missing, 3 = feature disabled, 4 = end of life | — | — | — |
| 69 | 10 | Activation Time Counter | Cumulated activation time | 0–1000<br>1023 : Error | 1 | months |
| 79 | 8 | Time Since Last Calibration | Days since the last CO₂ calibration | 0–250<br>255 : Error | 1 | days |
| 87 | 1 | Reserved | — | — | — | — |
| 88 | 8 | Reserved | — | — | — | — |
| 96 | 2 | Anti-Tear Status | 0 = base not detected, 1 = base detected, 2 = sensor just removed, 3 = sensor just installed | — | — | — |
| 98 | 6 | Reserved | — | — | — | — |

---

## 6. Frame 0x15 — Product Status (LoRaWAN US915 / AU915 / Sigfox)

Offsets 0 to 68 are identical to frame 0x05 (with message type **0x15**). The tail differs:

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-----------:|-------|-------------|-------|-------|------|
| 69 | 8 | Activation Time Counter | Cumulated activation time | 0–254<br>255 : Error | 1 | months |
| 77 | 6 | Time Since Last Calibration | Weeks since the last CO₂ calibration | 0–60<br>63 : Error | 1 | weeks |
| 83 | 2 | Anti-Tear Status | 0 = base not detected, 1 = base detected, 2 = sensor just removed, 3 = sensor just installed | — | — | — |
| 85 | — | Padding | Zero-filled | — | — | — |

---

## 7. Frame 0x06 — Product Configuration (LoRaWAN EU868 / IN865)

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-----------:|-------|-------------|-------|-------|------|
| 0 | 8 | Product Type | See product ID table | — | — | — |
| 8 | 8 | Message Type | 0x06 | — | — | — |
| 16 | 3 | Reconfiguration Source | 0 = NFC, 1 = application downlink, 2 = product startup, 3 = network, 4 = GPS, 5 = local, 6–7 = reserved | — | — | — |
| 19 | 2 | Reconfiguration Status | 0 = total success, 1 = partial success, 2 = total failure, 3 = reserved | — | — | — |
| 21 | 5 | Measurement Period | Time between two measurements | 5–30 | 1 | min |
| 26 | 1 | CO₂ Enable | 0 = disabled, 1 = enabled | — | — | — |
| 27 | 1 | VOC Enable | 0 = disabled, 1 = enabled | — | — | — |
| 28 | 1 | PIR Enable | 0 = disabled, 1 = enabled | — | — | — |
| 29 | 1 | Microphone Enable | 0 = disabled, 1 = enabled | — | — | — |
| 30 | 1 | Local Storage Enable | 0 = disabled, 1 = SD storage active | — | — | — |
| 31 | 1 | CO₂ Auto Calibration | 0 = disabled, 1 = enabled | — | — | — |
| 32 | 10 | CO₂ Medium Threshold | Boundary between good and medium level | 0–1000 | 5 | ppm |
| 42 | 10 | CO₂ High Threshold | Boundary between medium and high level | 0–1000 | 5 | ppm |
| 52 | 1 | CO₂ LED | 0 = inactive, 1 = active | — | — | — |
| 53 | 1 | Medium Level LED | LED indication for the medium level | — | — | — |
| 54 | 1 | Buzzer | General buzzer notification | — | — | — |
| 55 | 1 | Buzzer Confirmation | Buzzer notification confirmation | — | — | — |
| 56 | 2 | LED / Buzzer Source | 0 = CO₂, 1 = iZiAIR, 2–3 = reserved | — | — | — |
| 58 | 1 | Button Notification Enable | 0 = inactive, 1 = active | — | — | — |
| 59 | 4 | Protocol & Region | 01 = LR-EU868, 02 = LR-US915, 04 = LR-AU915, 06 = LR-IN865, 08 = SF-RC1 (03, 05, 07, 09–13 reserved) | — | — | — |
| 63 | 1 | Periodic Data Enable | 0 = inactive, 1 = active | — | — | — |
| 64 | 6 | Periodic Transmission Period | Periodic measurement transmission period | 10–60 | 1 | min |
| 70 | 8 | CO₂ Delta | CO₂ change triggering an instant transmission | 0–250<br>255 : Disabled | 4 | ppm |
| 78 | 7 | Temperature Delta | Temperature change triggering an instant transmission | 0–99<br>127 : Disabled | 0.1 | °C |
| 85 | 1 | CO₂ Datalog Enable | 0 = inactive, 1 = active | — | — | — |
| 86 | 1 | Temperature Datalog Enable | 0 = inactive, 1 = active | — | — | — |
| 87 | 6 | Number of New Measurements | New measurements per Datalog message | 1–36 | 1 | — |
| 93 | 5 | Number of Transmissions | Times the same measurement is retransmitted | 1–24 | 1 | — |
| 98 | 8 | Datalog Transmission Period | Historical measurement transmission period | 3–144<br>255 : Error | 10 | min |
| 106 | 1 | Deferred Network Connection | 0 = no request pending, 1 = join scheduled | — | — | — |
| 107 | 2 | NFC Status | 0 = discoverable, 1 = not discoverable, 2–3 = reserved | — | — | — |
| 109 | 6 | Product Date — Year | Year since 2000 | 0–63 | 1 | years |
| 115 | 4 | Product Date — Month | Month | 1–12 | 1 | month |
| 119 | 5 | Product Date — Day | Day | 1–31 | 1 | day |
| 124 | 5 | Product Date — Hour | Hour | 0–23 | 1 | h |
| 129 | 6 | Product Date — Minute | Minute | 0–59 | 1 | min |
| 135 | 1 | Humidity Datalog Enable | 0 = inactive, 1 = active | — | — | — |
| 136 | 16 | Downlink FCnt | FCnt of the downlink that triggered the reconfiguration | — | — | — |

---

## 8. Frames 0x16 / 0x17 — Product Configuration (LoRaWAN US915 / AU915 / Sigfox)

On the reduced-payload networks the configuration is split into **two frames**.

### Frame 1 — 0x16

Offsets 0 to 62 are identical to frame 0x06 (with message type **0x16**), up to and including *Protocol & Region*. The tail differs:

| Offset | Size (bit) | Field | Description |
|--------:|-----------:|-------|-------------|
| 63 | 2 | NFC Status | 0 = discoverable, 1 = not discoverable, 2–3 = reserved |
| 65 | — | Padding | Zero-filled |

### Frame 2 — 0x17

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-----------:|-------|-------------|-------|-------|------|
| 0 | 8 | Product Type | See product ID table | — | — | — |
| 8 | 8 | Message Type | 0x17 | — | — | — |
| 16 | 1 | Periodic Data Enable | 0 = inactive, 1 = active | — | — | — |
| 17 | 6 | Periodic Transmission Period | Periodic measurement transmission period | 10–60 | 1 | min |
| 23 | 8 | CO₂ Delta | CO₂ change triggering an instant transmission | 0–250<br>255 : Disabled | 4 | ppm |
| 31 | 7 | Temperature Delta | Temperature change triggering an instant transmission | 0–99<br>127 : Disabled | 0.1 | °C |
| 38 | 1 | CO₂ Datalog Enable | 0 = inactive, 1 = active | — | — | — |
| 39 | 1 | Temperature Datalog Enable | 0 = inactive, 1 = active | — | — | — |
| 40 | 3 | Number of New Measurements | New measurements per Datalog message | 1–5 | 1 | — |
| 43 | 3 | Number of Transmissions | Times the same measurement is retransmitted | 1–5 | 1 | — |
| 46 | 8 | Datalog Transmission Period | Historical measurement transmission period | 3–144<br>255 : Error | 10 | min |
| 54 | 1 | Deferred Network Connection | 0 = no request pending, 1 = join scheduled | — | — | — |
| 55 | 6 | Product Date — Year | Year since 2000 | 0–63 | 1 | years |
| 61 | 4 | Product Date — Month | Month | 1–12 | 1 | month |
| 65 | 5 | Product Date — Day | Day | 1–31 | 1 | day |
| 70 | 5 | Product Date — Hour | Hour | 0–23 | 1 | h |
| 75 | 6 | Product Date — Minute | Minute | 0–59 | 1 | min |
| 81 | 1 | Humidity Datalog Enable | 0 = inactive, 1 = active | — | — | — |
| 82 | — | Padding | Zero-filled | — | — | — |

> Guide D948N prints the *Humidity Datalog Enable* field at offset 76, which overlaps the preceding minute field (75 + 6 = 81). The offset above follows the field sequence.

---

## 9. Downlink Commands (LoRaWAN, FPort 56)

Downlink layout: header **0x55**, then one or more `Command ID + DATA` pairs, sent in ascending ID order.

| ID | Length (bytes) | Range | Values | Description |
|---|---|---|---|---|
| 0x01 | 0 | — | — | Force an immediate configuration uplink |
| 0x03 | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable the CO₂ LED |
| 0x04 | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable periodic data transmission on button press |
| 0x05 | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable periodic data transmission |
| 0x08 | 1 | 0–99 | 0–9.9 °C | Temperature delta triggering an instant transmission (0.1 °C steps) |
| 0x0A | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable the NFC interface |
| 0x10 | 1 | 0–50 | 0–1000 ppm | CO₂ delta triggering an instant transmission (20 ppm steps) |
| 0x12 | 1 | 0–250 | 0–5000 ppm | CO₂ "orange" threshold (20 ppm steps) |
| 0x13 | 1 | 0–250 | 0–5000 ppm | CO₂ "red" threshold (20 ppm steps) |
| 0x19 | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable CO₂ measurement |
| 0x1C | 2 | 1–1008 | 10–10080 min | Schedule a deferred network join |
| 0x1D | 2 | 0–5000 | 0–5000 ppm | Manual CO₂ sensor calibration to the given value |
| 0x28 | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable temperature datalog transmission |
| 0x29 | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable humidity datalog transmission |
| 0x2D | 1 | 0–3 | 0 = CO₂, 1 = iZiAIR, 2–3 = reserved | Source of the visual and audible indicators |
| 0x2E | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable the "orange" level LED indication |
| 0x2F | 1 | 5–30 | 5–30 min | Period between two measurements |
| 0x33 | — | — | — | Reserved (Nexelec) |
| 0x46 | — | — | — | Reserved (Nexelec) |
| 0x47 | — | — | — | Reserved (Nexelec) |
| 0x48 | — | — | — | Reserved (Nexelec) |
| 0x49 | 1 | 10–60 | 10–60 min | Periodic data transmission period |
| 0x4A | 1 | 1 | 1 | Reboot the product |
| 0x4B | 1 | 1 | 1 | Restore factory configuration |
| 0x4C | — | — | — | Reserved (Nexelec) |
| 0x54 | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable the motion sensor (PIR) |
| 0x55 | — | — | — | Reserved (Nexelec) |
| 0x56 | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable sound level measurement (microphone) |
| 0x57 | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable VOC measurement |
| 0x58 | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable local storage on the SD card |
| 0x59 | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable CO₂ auto-calibration |
| 0x5A | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable the buzzer level-change notification |
| 0x5B | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable the buzzer level confirmation |
| 0x5C | 1 | 0/1 | 0 = disabled, 1 = enabled | Enable / disable CO₂ datalog transmission |
| 0x5D | 1 | 1–36 | 1–36 | New measurements included in a Datalog message |
| 0x5E | 1 | 3–144 | 30–1440 min | Datalog transmission period |
| 0x5F | 1 | 1–24 | 1–24 | Number of transmissions of the same measurement |

### Examples

| Downlink | Effect |
|---|---|
| `55 03 01 2D 01 2E 00` | Enable the LED, drive it from the CO₂ level, disable the medium-level indication |
| `55 12 28 13 4D` | CO₂ threshold 1 = 800 ppm, CO₂ threshold 2 = 1500 ppm |

---

## 10. Annexes

### Sensor status codes (frames 0x05 / 0x15)

| Value | Meaning |
|---|---|
| 0 | Sensor OK |
| 1 | Sensor faulty |
| 2 | Sensor absent |
| 3 | Sensor disabled |
| 4 | Sensor end of life |

### Measurement error codes (periodic frames)

| Field width | Disabled | Absent | Error |
|---|---|---|---|
| 14 bits (CO₂) | 16381 | 16382 | 16383 |
| 10 bits (temperature, humidity, luminosity) | 1021 | 1022 | 1023 |
| 9 bits (AirDrive) | 509 | 510 | 511 |
| 8 bits (humidity, luminosity — US/Sigfox) | 253 | 254 | 255 |
| 7 bits (noise, occupancy) | 125 | 126 | 127 |

### Main units

| Quantity | Unit | Coding |
|---|---|---|
| Temperature | °C | 10 bits, 0.1 °C step, 30 °C offset |
| Humidity | %RH | 10 bits (0.1 %RH) or 8 bits (0.5 %RH) |
| CO₂ | ppm | 14 bits, 1 ppm |
| Luminosity | lux | 10 bits (×5) or 8 bits (×20) |
| Noise | dBA | 7 bits, 35–120 |
| Occupancy | % | 7 bits |
| Battery voltage | mV | 10 bits, ×5 |

---

## 🧾 Additional Resources

- Online decoder: [https://nexelec-support.fr/n/decoder/](https://nexelec-support.fr/n/decoder/)  
- Downlink builder: [https://nexelec-support.fr/n/downlink/](https://nexelec-support.fr/n/downlink/)  
- Technical documentation: [https://support.nexelec.fr](https://support.nexelec.fr)  
- Source document: **D948N — SIGN RISE FEEL MOVE WAVE ECHO VIEW LoRa/Sigfox Technical Guide**

---

## 🛠 Maintainer

**Nexelec Support Team**  
Contact: [support@nexelec.fr](mailto:support@nexelec.fr)
