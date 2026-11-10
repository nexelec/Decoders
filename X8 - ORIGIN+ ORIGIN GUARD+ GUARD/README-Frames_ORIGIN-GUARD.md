# ORIGIN / ORIGIN+ / GUARD / GUARD+ — Frame Decoding Reference (Uplink 0x00–0x05)

This document details the **bit-level structure** of all uplink messages (LoRaWAN & Sigfox) for ORIGIN, ORIGIN+, GUARD and GUARD+ devices.  
Reference: technical guide **D1035C** (05/12/2023) and decoder `decoderOrigin+.js` **2.0.0**. Uplink examples are listed in [README-Examples_ORIGIN-GUARD.md](README-Examples_ORIGIN-GUARD.md).

The *Decoder field* column gives the name of the field in the `decodeUplink` output.

---

## 1. Conventions

- Byte 0 is the **product type**, byte 1 the **message type** (0x00–0x05)
- All offsets and sizes are expressed in **bits**, MSB first; fields are not byte aligned
- LoRaWAN messages are transmitted on **FPort 56**
- Temperature: 10 bits, 0.1 °C step, 30 °C offset (0 → -30 °C, 300 → 0 °C, 1000 → 70 °C); **1023 = Error**, 1022 = Sensor not present
- Humidity: 8 bits, 0.5 %RH step (0–200 = 0–100 %RH); **255 = Error**
- Product type codes:

| Code | Product | Decoder `typeOfProduct` |
|------|---------|-------------------------|
| 0xBD | ORIGIN+ | `"ORIGIN+"` |
| 0xB2 | ORIGIN | `"ORIGIN"` |
| 0xB3 | GUARD+ | `"GUARD+"` |
| 0xB4 | GUARD | `"GUARD"` |
| 0xB1 | ORIGIN+ (first LoRa-only firmware, not listed in D1035C) | `"ORIGIN+"` |

---

## 2. Frame 0x00 — Product Status

Sent at power-up, every day, and immediately when the battery level, the sensor status or the magnetic base detection changes.

| Offset | Size (bit) | Field | Description | Range | Scale | Unit | Decoder field |
|--------:|-----------:|-------|-------------|-------|-------|------|---------------|
| 0 | 8 | Product type | Product model code | — | — | — | `typeOfProduct` |
| 8 | 8 | Message type | 0x00 | — | — | — | `typeOfMessage` |
| 16 | 8 | Hardware version | 1 = V001 … 255 = V255 | 1–255 | — | — | `hardwareVersion` |
| 24 | 8 | Software version | 10 = V01.0 … 255 = V25.5 | 10–255 | — | — | `softwareVersion` |
| 32 | 8 | Remaining product life | Countdown to product end-of-life | 0–120 | 1 | month | `remainingProductLifetime` |
| 40 | 1 | Smoke chamber | 0 = OK, 1 = faulty | — | — | — | `statusSmokeSensor` |
| 41 | 1 | Temperature / humidity sensor | 0 = OK, 1 = faulty | — | — | — | `statusTemperatureHumiditySensor` |
| 42 | 1 | Reserved | — | — | — | — | — |
| 43 | 3 | Magnetic base detection | 0 = not detected, 1 = detected, 2 = just removed from the base, 3 = just installed on the base, 4 = never detected | — | — | — | `statusAntiTear` |
| 46 | 2 | Battery level | 0 = high (> 50 %), 1 = medium (20–50 %), 2 = low (1–10 %), 3 = critical (< 1 %) | — | — | — | `batteryLevel` |
| 48 | 8 | Battery voltage | 5 mV steps, 2000 mV offset | 0–250 | ×5 + 2000 | mV | `batteryVoltage` |

---

## 3. Frame 0x01 — Product Configuration

Sent at start-up, after each reconfiguration and every 7 days.

| Offset | Size (bit) | Field | Description | Range | Scale | Unit | Decoder field |
|--------:|-----------:|-------|-------------|-------|-------|------|---------------|
| 0 | 8 | Product type | Product model code | — | — | — | `typeOfProduct` |
| 8 | 8 | Message type | 0x01 | — | — | — | `typeOfMessage` |
| 16 | 3 | Reconfiguration source | 0 = NFC, 1 = downlink, 2 = product start-up, 5 = local, others reserved | — | — | — | `reconfigurationSource` |
| 19 | 2 | Reconfiguration status | 0 = total success, 1 = partial success, 2 = total failure, 3 = reserved | — | — | — | `reconfigurationStatus` |
| 21 | 1 | Datalog temperature | 0 = off, 1 = on | — | — | — | `enableDatalogTemperature` |
| 22 | 1 | Daily air quality | 0 = off, 1 = on | — | — | — | `enableDailyAirQuality` |
| 23 | 1 | Reserved | — | — | — | — | — |
| 24 | 1 | Delayed network connection | 0 = no request programmed, 1 = connection request programmed | — | — | — | `pendingJoin` |
| 25 | 2 | NFC status | 0 = discoverable, 1 = non-discoverable, 2–3 = RFU | — | — | — | `enableNfcDiscover` |
| 27 | 4 | Reserved | — | — | — | — | — |
| 31 | 6 | Number of new data | New measures in a Datalog message | 1–36 | 1 | — | `datalogNewValues` |
| 37 | 5 | Number of transmissions | Repetitions of the same data (redundancy) | 1–24 | 1 | — | `datalogRepeatValues` |
| 42 | 8 | Transmission period | Datalog transmission period | 3–144 | ×10 | min | `periodDatalogTransmission` |
| 50 | 17 | D2D network ID | Interconnection network ID | 0–131071 | — | — | `d2dNetworkId` |
| 67 | 5 | Reserved | — | — | — | — | — |
| 72 | 16 | Downlink FCnt | FCnt of the downlink that caused the reconfiguration | 0–65535 | — | — | `downlinkFcnt` (only when the frame is 11 bytes long) |

---

## 4. Frame 0x02 — Alarm Status

Sent when the alarm status, the product test, the time since the last test or the time since the last maintenance changes.

| Offset | Size (bit) | Field | Description | Range | Scale | Unit | Decoder field |
|--------:|-----------:|-------|-------------|-------|-------|------|---------------|
| 0 | 8 | Product type | Product model code | — | — | — | `typeOfProduct` |
| 8 | 8 | Message type | 0x02 | — | — | — | `typeOfMessage` |
| 16 | 2 | Alarm status | 0 = no smoke detected, 1 = smoke detected, 2 = repeated alarm, 3 = not used | — | — | — | `smokeAlarm` |
| 18 | 2 | Pause alarm | 0 = stopped, no more smoke; 1 = stopped by the main button; 2 = stopped after all the smoke-detecting products were switched off | — | — | — | `smokeAlarmHush` |
| 20 | 2 | Product test | 0 = none, 1 = local test, 2 = remote test | — | — | — | `productTest` |
| 22 | 8 | Time since last product test | — | 0–255 | 1 | weeks | `timeSinceLastTest` |
| 30 | 1 | Maintenance | 0 = not performed, 1 = performed | — | — | — | `isMaintenanceDone` |
| 31 | 8 | Time since last maintenance | — | 0–255 | 1 | weeks | `timeSinceLastMaintenance` |
| 39 | 10 | Temperature | 30 °C offset | 0–1000<br>1022 : Sensor not present<br>1023 : Error | 0.1 | °C | `temperature` |
| 49 | 7 | Not used | — | — | — | — | — |

---

## 5. Frame 0x03 — Daily Air Quality

Minimum, maximum and average over 24 hours of the measures taken every 10 minutes. Sent when the function is enabled.

| Offset | Size (bit) | Field | Description | Range | Scale | Unit | Decoder field |
|--------:|-----------:|-------|-------------|-------|-------|------|---------------|
| 0 | 8 | Product type | Product model code | — | — | — | `typeOfProduct` |
| 8 | 8 | Message type | 0x03 | — | — | — | `typeOfMessage` |
| 16 | 10 | Min. temperature | 30 °C offset | 0–1000<br>1023 : Error | 0.1 | °C | `temperatureMin` |
| 26 | 10 | Max. temperature | 30 °C offset | 0–1000<br>1023 : Error | 0.1 | °C | `temperatureMax` |
| 36 | 10 | Average temperature | 30 °C offset | 0–1000<br>1023 : Error | 0.1 | °C | `temperatureAvg` |
| 46 | 8 | Min. relative humidity | — | 0–200<br>255 : Error | 0.5 | %RH | `humidityMin` |
| 54 | 8 | Max. relative humidity | — | 0–200<br>255 : Error | 0.5 | %RH | `humidityMax` |
| 62 | 8 | Average relative humidity | — | 0–200<br>255 : Error | 0.5 | %RH | `humidityAvg` |
| 70 | 2 | Not used | — | — | — | — | — |

---

## 6. Frame 0x04 — Periodic Data (LoRaWAN only)

| Offset | Size (bit) | Field | Description | Range | Scale | Unit | Decoder field |
|--------:|-----------:|-------|-------------|-------|-------|------|---------------|
| 0 | 8 | Product type | Product model code | — | — | — | `typeOfProduct` |
| 8 | 8 | Message type | 0x04 | — | — | — | `typeOfMessage` |
| 16 | 10 | Temperature | 30 °C offset | 0–1000<br>1023 : Error | 0.1 | °C | `temperature` |
| 26 | 8 | Relative humidity | — | 0–200<br>255 : Error | 0.5 | %RH | `humidity` |
| 34 | 6 | Not used | — | — | — | — | — |

---

## 7. Frame 0x05 — Historical Data (Datalog Temperature, LoRaWAN only)

Measures are ordered from the most recent (index n, the current value) to the oldest.

| Offset | Size (bit) | Field | Description | Range | Scale | Unit | Decoder field |
|--------:|-----------:|-------|-------------|-------|-------|------|---------------|
| 0 | 8 | Product type | Product model code | — | — | — | `typeOfProduct` |
| 8 | 8 | Message type | 0x05 | — | — | — | `typeOfMessage` |
| 16 | 6 | Number of measurements | Total number of measures in the message | 1–36 | 1 | — | `newMeasure` |
| 22 | 8 | Period between measurements | Time between two measures | 10–200 | 1 | min | `periodBetweenMeasure` |
| 30 | 6 | Repeat | Repetitions of the same measure | 1–24 | 1 | — | `redundancy` |
| 36 | 10 | Temperature [n] | Most recent measure, 30 °C offset | 0–1000<br>1023 : Error | 0.1 | °C | `temperature.value[0]` |
| 46 | 10 | Temperature [n-1] | Previous measure | 0–1000<br>1023 : Error | 0.1 | °C | `temperature.value[1]` |
| … | 10 | Temperature [n-x] | Older measures | 0–1000<br>1023 : Error | 0.1 | °C | `temperature.value[x]` |

If the frame holds fewer measures than announced, the decoder returns the measures present and a warning.

---

## 8. Notes

- Frames 0x00–0x03 apply to both LoRaWAN and Sigfox, with the same layout.
- Frames 0x04–0x05 apply **only to LoRaWAN**.
- All bit positions refer to the application payload, without the MAC headers.
- Following the LoRa Alliance TS013 codec API, a payload shorter than 2 bytes, an unknown message type or a frame shorter than its minimum length (0x00: 7 bytes, 0x01: 9, 0x02: 7, 0x03: 9, 0x04: 5, 0x05: 5) returns `errors` instead of `data`.

---

## 🧾 Additional Resources

- Online decoder: [https://nexelec-support.fr/n/decoder/](https://nexelec-support.fr/n/decoder/)  
- Downlink builder: [https://nexelec-support.fr/n/downlink/](https://nexelec-support.fr/n/downlink/)  
- Technical documentation: [https://support.nexelec.fr](https://support.nexelec.fr)

---

## 🛠 Maintainer

**Nexelec Support Team**  
Contact: [support@nexelec.fr](mailto:support@nexelec.fr)
