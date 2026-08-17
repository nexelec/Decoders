# 🧩 Decoders

Uplink decoders for **Nexelec** products — A1, A3, X2, X5, X8, X9 and other product families.

This repository centralizes all **payload decoding scripts** used to interpret uplink messages from Nexelec IoT devices (LoRa, Sigfox, etc.).

---

## 📂 Project Structure

```
Decoders/
├── A100LS_C - RELAY/
│   └── decoderA100.js
├── A3 - FLOW CORE FLOW PRO/
│   └── decoderFlow.js
├── X2 - FEEL+ RISE+ WAVE+ MOVE+ SIGN+ SENSE+ ATMO+/
│   ├── X220 - RISE+/
│   │   └── decoderX2.js
│   ├── X230 - WAVE+/
│   │   └── decoderX2.js
│   ├── X255 - SENSE+/
│   │   └── decoderX2.js
│   ├── X260 - ATMO+/
│   │   └── decoderX2.js
│   ├── X265 - SIGN+/
│   │   └── decoderX2.js
│   ├── X280 - FEEL+/
│   │   └── decoderX2.js
│   └── X290 - MOVE+/
│       └── decoderX2.js
├── X5 - SIGN WAVE MOVE RISE FEEL ECHO VIEW/
│   ├── X520 - RISE/
│   │   └── decoderLoRaSigfoxX5.js
│   ├── X530 - WAVE/
│   │   └── decoderLoRaSigfoxX5.js
│   ├── X565 - SIGN/
│   │   └── decoderLoRaSigfoxX5.js
│   ├── X570 - ECHO/
│   │   └── decoderLoRaSigfoxX5.js
│   ├── X575 - VIEW/
│   │   └── decoderLoRaSigfoxX5.js
│   ├── X580 - FEEL/
│   │   └── decoderLoRaSigfoxX5.js
│   └── X590 - MOVE/
│       └── decoderLoRaSigfoxX5.js
├── X8 - AIR+ AIR/
│   └── decoderAir+.js
├── X8 - ORIGIN+ ORIGIN GUARD+ GUARD/
│   └── decoderOrigin+.js
└── X9 - TRACK+/
    └── decoderTrack+.js
```

Each subfolder corresponds to a **product reference** or **firmware variant**, and contains the specific decoder used to parse sensor payloads.

---

## 📚 Product Families

| Family | Products | Decoder |
|---|---|---|
| **A100LS_C** | RELAY | `decoderA100.js` |
| **A3** | FLOW CORE, FLOW PRO | `decoderFlow.js` |
| **X2** | FEEL+, RISE+, WAVE+, MOVE+, SIGN+, SENSE+, ATMO+ | `decoderX2.js` (per reference) |
| **X5** | SIGN, WAVE, MOVE, RISE, FEEL, ECHO, VIEW | `decoderLoRaSigfoxX5.js` (per reference) |
| **X8** | AIR+, AIR | `decoderAir+.js` |
| **X8** | ORIGIN+, ORIGIN, GUARD+, GUARD | `decoderOrigin+.js` |
| **X9** | TRACK+ | `decoderTrack+.js` |

---

## ⚙️ Usage

Each decoder file is a standalone JavaScript module that can be imported or executed independently.  
They are designed to be used by backend applications, IoT platforms (e.g., ChirpStack, The Things Stack), or test utilities.

### Example (Node.js)
```bash
node "X5 - SIGN WAVE MOVE RISE FEEL ECHO VIEW/X565 - SIGN/decoderLoRaSigfoxX5.js" <payload_hex>
```

### Integration
You can include these decoders in your IoT platform configuration to decode uplink payloads automatically.

---

## 🔗 Useful Links

- 🧮 **Online Frame Decoder:** https://nexelec-support.fr/n/decoder/  
- 🔁 **Downlink Tool:** https://nexelec-support.fr/n/downlink/  
- 📧 **Support Contact:** support@nexelec.fr

---

## 📜 License

© Nexelec — All rights reserved.  
Internal tools and scripts for product decoding and validation.
