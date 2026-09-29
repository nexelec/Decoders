
# AIR / AIR+ — BMS Decoder (`decoderAir+_BMS.js`)

Decoder variant for **Building Management Systems** (Tridium Niagara, etc.).  
It decodes the same frames as [`../decoderAir+.js`](../decoderAir+.js), with the bit layout described in [`../README-Frames_AIR.md`](../README-Frames_AIR.md), but its output follows one rule:

> **Every field keeps a single type for its whole life**, so it can be mapped to a single BMS point, trended and alarmed.

| Field kind | Type | Example |
|------------|------|---------|
| Status and configuration | number (raw code) | `"energyStatus": 2` |
| Measurement | `{"value": number, "unit": string}` | `"temperature": {"value": 22.4, "unit": "°C"}` |
| Measurement not available | same object, `value` = raw code | `"temperature": {"value": 1023, "unit": "°C"}` |

No field ever returns a string, `null` or `undefined`.

For a human-readable output (English labels, error strings), use [`../decoderAir+.js`](../decoderAir+.js).

---

## 1. Measurements

Only the values carrying an offset or a scale are converted; every other field is returned as its raw value.

| Field | Conversion | Unit |
|-------|-----------|------|
| `coConcentration` | raw | ppm |
| `temperature` | raw / 10 − 30 | °C |
| `relativeHumidity` | raw × 0.5 | %RH |
| `deltaTemperature` | raw × 0.1 | °C |
| `deltaCO` | raw × 5 | ppm |
| `realtimePeriod` | raw × 10 | min |
| `remainingProductLifetime` | raw | month |
| `timeSinceLastTest` | raw | week |

---

## 2. Measurement codes (not a reading)

When a measurement is not available or outside its documented range, `value` holds the **raw code** instead of a converted value.

| Field | Documented range (raw) | Out of range | Sensor not present | Error |
|-------|------------------------|--------------|--------------------|-------|
| `coConcentration` | 0–1000 | — | — | 1023 |
| `temperature` | 0–1000 (−30 … +70 °C) | 1001–1021 | 1022 | 1023 |
| `relativeHumidity` | 0–200 (0 … 100 %RH) | 201–253 | 254 | 255 |

Rule of thumb for the BMS:

- `temperature.value` > 70 → code, not a temperature
- `relativeHumidity.value` > 100 → code, not a humidity
- `coConcentration.value` = 1023 → error (1001–1022 are returned as ppm, as sent by the product)

`remainingProductLifetime`, `timeSinceLastTest`, `deltaTemperature`, `deltaCO` and `realtimePeriod` have no error code.

---

## 3. Status and configuration codes

| Field | Codes |
|-------|-------|
| `typeOfProduct` | 174 (0xAE) = AIR+, 175 (0xAF) = AIR |
| `typeOfMessage` | 0 = Product Status, 1 = CO Alarm Status, 2 = Real Time, 3 = Product Function Configuration, 4 = SAV Information |
| `hwRevision` | revision = "V" + code on 3 digits (e.g. 3 = V003) |
| `swRevision` | revision = "V" + code × 0.1 (e.g. 10 = V1.0, 25 = V2.5) |
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

`d2dID` and `downlinkCounter` are plain numbers.

---

## 4. Examples — Real Time frame (0x02)

Normal reading, `AE0200A0C8C880`:

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

Temperature sensor in error, `AE0200BFF8C880`:

```json
{
  "data": {
    "typeOfProduct": 174,
    "typeOfMessage": 2,
    "coConcentration": { "value": 2, "unit": "ppm" },
    "temperature": { "value": 1023, "unit": "°C" },
    "relativeHumidity": { "value": 70, "unit": "%RH" },
    "iaqGlobal": 4,
    "iaqSource": 4
  }
}
```

---

## 5. Decoding errors

A payload shorter than 2 bytes, an unknown message type or a payload shorter than its frame returns an `errors` array instead of `data` (LoRa Alliance TS013):

```json
{ "errors": ["Payload too short for message type 2: 2 bytes, 7 expected"] }
```

Minimum payload length: 0x00 = 6 bytes, 0x01 = 5 bytes, 0x02 = 7 bytes, 0x03 = 11 bytes, 0x04 = 2 bytes.

---

## 🛠 Maintainer

**Nexelec Support Team**  
Contact: [support@nexelec.fr](mailto:support@nexelec.fr)
