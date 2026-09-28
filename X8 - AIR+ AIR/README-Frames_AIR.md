
# AIR / AIR+ — Frame Decoding Reference (LoRaWAN Uplink 0x00–0x04)

This document details the byte-level structure of all uplink messages for the AIR and AIR+ detectors.  
It covers message types 0x00 through 0x04, as defined in the D976A technical guide.

---

## 1. Conventions

- Product type codes: **AIR+ = 0xAE**, **AIR = 0xAF**  
- Temperature encoding: 0 = -30°C, 300 = 0°C, 1000 = 70°C (0.1°C step)  
- Humidity encoding: 0–200 = 0–100%RH (0.5%RH per step)  
- CO encoding: 1 ppm per LSB (0–1000 range)

---

## 2. Frame 0x00 — Product Status

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-------------:|--------|--------------|--------|--------|------|
| 0 | 8 | Product Type | AIR/AIR+ identifier | — | — | — |
| 8 | 8 | Message Type | 0x00 | — | — | — |
| 16 | 8 | HW Revision | Hardware version index | 1–255 | — | — |
| 24 | 8 | SW Revision | Software version index | 10–255 | — | — |
| 32 | 8 | Remaining Life | Remaining product life | 0–120 | 1 | Month |
| 40 | 1 | CO Sensor | 0=OK, 1=Fault | — | — | — |
| 41 | 1 | T°/Hum Sensor | 0=OK, 1=Fault | — | — | — |
| 42 | 1 | Memory Fault | 0=OK, 1=Fault | — | — | — |
| 43 | 1 | Default Hush | 0=Inactive, 1=Active | — | — | — |
| 44 | 2 | Battery Level | 0=High,1=Med,2=Low,3=Critical | — | — | — |
| 46 | 1 | Magnetic Base | 0=No,1=Detected | — | — | — |
| 47 | 1 | Reserved | — | — | — |

---

## 3. Frame 0x01 — Carbon Monoxide Alarm Status

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-------------:|--------|--------------|--------|--------|------|
| 0 | 8 | Product Type | AIR/AIR+ identifier | — | — | — |
| 8 | 8 | Message Type | 0x01 | — | — | — |
| 16 | 10 | CO Concentration | Measured CO concentration | 0–1000 | 1 | ppm |
| 26 | 1 | Pre-Alarm | 0=Inactive,1=Active | — | — | — |
| 27 | 1 | Alarm | 0=Off,1=Active | — | — | — |
| 28 | 1 | Alarm Hush | 0=Off,1=On | — | — | — |
| 29 | 1 | Reserved | — | — | — |
| 30 | 1 | Product Test | 0=Off,1=Running | — | — | — |
| 31 | 1 | Reserved | — | — | — |
| 32 | 8 | Time Since Last Test | Time elapsed since last test | 0–255 | 1 | weeks |

---

## 4. Frame 0x02 — Periodic Data

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-------------:|--------|--------------|--------|--------|------|
| 0 | 8 | Product Type | AIR/AIR+ identifier | — | — | — |
| 8 | 8 | Message Type | 0x02 | — | — | — |
| 16 | 10 | CO Concentration | CO value | 0–1000 | 1 | ppm |
| 26 | 10 | Temperature | Encoded temperature | 0–1000 | 0.1 | °C |
| 36 | 8 | Relative Humidity | Encoded RH | 0–200 | 0.5 | %RH |
| 44 | 3 | IAQ Level | 0=Excellent,1=Good,2=Fair,3=Poor,4=Bad,7=Error | — | — | — |
| 47 | 4 | IAQ Source | 0=None,4=CO,15=Error | — | — | — |
| 51 | 5 | Not used | — | — | — | — |

---

## 5. Frame 0x03 — Product Function Configuration

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-------------:|--------|--------------|--------|--------|------|
| 0 | 8 | Product Type | AIR/AIR+ identifier | — | — | — |
| 8 | 8 | Message Type | 0x03 | — | — | — |
| 16 | 3 | Reconfiguration Source | 0=NFC,1=Downlink,2=Startup,5=Local | — | — | — |
| 19 | 2 | Reconfiguration State | 0=Success,1=Partial,2=Fail | — | — | — |
| 21 | 1 | Periodic Data Active | 0=Off,1=On | — | — | — |
| 22 | 2 | NFC Status | 0=Discoverable,1=Not discoverable | — | — | — |
| 24 | 4 | Region Selection | 1=EU | — | — | — |
| 28 | 4 | Periodic Data Period | Value ×10 = minutes | 1–9 | ×10 | min |
| 32 | 8 | ΔTemperature | Trigger delta for periodic | 0–99 | 0.1 | °C |
| 40 | 8 | ΔCO | Trigger delta for periodic | 0–200 | 5 | ppm |
| 48 | 17 | D2D ID | Interconnection ID | 0–131071 | — | — |
| 65 | 1 | D2D Ping | 0=Incompatible,1=Compatible | — | — | — |
| 66 | 1 | Pending Join | 0=No,1=Yes | — | — | — |
| 72 | 16 | Downlink Counter | Last counter value | 0–65535 | — | — |

---

## 6. Frame 0x04 — SAV Information

| Offset | Size (bit) | Field | Description | Range | Scale | Unit |
|--------:|-------------:|--------|--------------|--------|--------|------|
| 0 | 8 | Product Type | AIR/AIR+ identifier | — | — | — |
| 8 | 8 | Message Type | 0x04 | — | — | — |
| 16 | — | Content TBD | Internal use / maintenance | — | — | — |

---

## 7. Notes

- AIR+: includes CO, temperature, humidity, and IAQ data.  
- AIR: includes CO only.  

---

## 8. Decoder Output

Two decoders are provided. They decode the same frames with the same bit layout and differ only in how status and configuration fields are returned.

| File | Intended for | Status / configuration fields | Measurements |
|------|--------------|-------------------------------|--------------|
| `decoderAir+.js` | IoT platforms, dashboards, scripts (human-readable output) | English string, e.g. `"energyStatus": "Low"` | `{"value": number, "unit": string}` |
| `decoderAir+_BMS.js` | Building Management Systems (Niagara, etc.) | Raw numeric code, e.g. `"energyStatus": 2` | `{"value": number, "unit": string}` |

In both decoders every field keeps a single type for its whole life, so it can be mapped to a single point.

### 8.1 Converted measurements

Only the values carrying an offset or a scale are converted; every other field is returned as its raw value.

| Field | Conversion | Unit |
|-------|-----------|------|
| `coConcentration` | raw | ppm |
| `temperature` | raw / 10 − 30 | °C |
| `relativeHumidity` | raw × 0.5 | %RH |
| `deltaTemperature` | raw × 0.1 | °C |
| `deltaCO` | raw × 5 | ppm |
| `realtimePeriod` | raw × 10 | min |

### 8.2 Measurement error codes

When a measurement is not available, `value` holds the **raw error code** instead of a converted value. These codes lie outside the measurement range and cannot be mistaken for a real value.

| Field | Sensor not present | Error |
|-------|--------------------|-------|
| `coConcentration` | — | 1023 |
| `temperature` | 1022 | 1023 |
| `relativeHumidity` | 254 | 255 |

### 8.3 Status and configuration codes (`decoderAir+_BMS.js`)

`decoderAir+.js` returns the label; `decoderAir+_BMS.js` returns the code. Codes not listed return `"Unknown"` in `decoderAir+.js`.

| Field | Codes |
|-------|-------|
| `typeOfProduct` | 174 (0xAE) = Air+ LoRa, 175 (0xAF) = Air LoRa |
| `typeOfMessage` | 0 = Product Status, 1 = CO Alarm Status, 2 = Real Time, 3 = Product Function Configuration, 4 = SAV Information |
| `hwRevision` | 0 = V000, 1 = V001, 2 = V002, 3 = V003 |
| `swRevision` | 0 = V0.0, 10 = V1.0 |
| `coSensorStatus`, `tempHumSensorStatus`, `memoryFault` | 0 = Hardware working correctly, 1 = Hardware fault detected |
| `hushStatus`, `preAlarm`, `localAlarm`, `coAlarmHush`, `realtimeStatus` | 0 = Not active, 1 = Active |
| `energyStatus` | 0 = High, 1 = Medium, 2 = Low, 3 = Critical |
| `magnetDetection` | 0 = No magnetic base detected, 1 = Magnetic base detected |
| `productTest` | 0 = Test Off, 1 = Product test is running |
| `iaqGlobal` | 0 = Excellent, 1 = Good, 2 = Fair, 3 = Poor, 4 = Bad, 5–6 = Not used, 7 = Error |
| `iaqSource` | 0 = None, 1 = Dryness Indicator, 2 = Mould Indicator, 3 = Dust mites Indicator, 4 = CO, 5–14 = Reserved, 15 = Error |
| `reconfigurationSource` | 0 = NFC, 1 = Applicative Downlink, 2 = Start-up product, 5 = Local, others = Reserved |
| `reconfigurationState` | 0 = Total success, 1 = Partial success, 2 = Total failure, 3 = Reserved |
| `nfcStatus` | 0 = Discoverable, 1 = Not Discoverable, 2–3 = RFU |
| `regionSelection` | 1 = EU, others = RFU |
| `d2dPing` | 0 = Not compatible, 1 = Compatible |
| `pendingJoin` | 0 = No join request scheduled, 1 = Join request scheduled |

### 8.4 Example — Real Time frame `AE0200A0C8C880`

`decoderAir+.js`
```json
{
  "data": {
    "typeOfProduct": "Air+ LoRa",
    "typeOfMessage": "Real Time",
    "coConcentration": { "value": 2, "unit": "ppm" },
    "temperature": { "value": 22.4, "unit": "°C" },
    "relativeHumidity": { "value": 70, "unit": "%RH" },
    "iaqGlobal": "Bad",
    "iaqSource": "CO"
  }
}
```

`decoderAir+_BMS.js`
```json
{
  "data": {
    "typeOfProduct": 174,
    "typeOfMessage": 2,
    "coConcentration": { "value": 2, "unit": "ppm" },
    "temperature": { "value": 22.4, "unit": "°C" },
    "relativeHumidity": { "value": 70, "unit": "%RH" },
    "iaqGlobal": 4,
    "iaqSource": 4
  }
}
```

### 8.5 Decoding errors

An unknown message type or a payload shorter than its frame returns an `errors` array instead of `data` (LoRa Alliance TS013), for example:

```json
{ "errors": ["Payload too short for message type 2: 2 bytes, 7 expected"] }
```

Minimum payload length: 0x00 = 6 bytes, 0x01 = 5 bytes, 0x02 = 7 bytes, 0x03 = 11 bytes, 0x04 = 2 bytes.

---

## 🧾 Additional Resources

- Online decoder: [https://nexelec-support.fr/n/decoder/](https://nexelec-support.fr/n/decoder/)  
- Downlink builder: [https://nexelec-support.fr/n/downlink/](https://nexelec-support.fr/n/downlink/)  
- Technical documentation: [https://support.nexelec.fr](https://support.nexelec.fr)

---

## 🛠 Maintainer

**Nexelec Support Team**  
Contact: [support@nexelec.fr](mailto:support@nexelec.fr)