# 🧩 Decoders

Uplink decoders for **Nexelec** products — A3, A100, X2, X5, X8, X9 and other product families.

This repository centralizes all **payload decoding scripts** used to interpret uplink messages from Nexelec IoT devices (LoRaWAN, Sigfox), together with the **frame documentation** of each family.

---

## 📂 Project Structure

```
Decoders/
├── A100LS_C - RELAY/
│   ├── decoderA100.js
│   ├── decoderA100.txt
│   ├── README-General_RELAY.md
│   └── README-Frames_RELAY.md
├── A3 - FLOW CORE FLOW PRO/
│   ├── decoderFlow.js
│   ├── encoderFlow.js
│   ├── examples_FLOW.json
│   ├── README-Examples_FLOW.md
│   ├── README-General_FLOW.md
│   └── README-Frames_FLOW.md
├── X2 - FEEL+ RISE+ WAVE+ MOVE+ SIGN+ SENSE+ ATMO+/
│   ├── README_X2_General.md
│   ├── README_X2_Frames.md
│   ├── Compatible Milesight/
│   │   └── decoderX2Milesight.js
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
│   ├── README-General_X5.md
│   ├── README-Frames_X5.md
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
│   ├── decoderAir+.js
│   ├── LICENSE
│   ├── README-General_AIR.md
│   ├── README-Frames_AIR.md
│   └── BMS/
│       ├── decoderAir+_BMS.js
│       └── README-BMS_AIR.md
├── X8 - ORIGIN+ ORIGIN GUARD+ GUARD/
│   ├── decoderOrigin+.js
│   ├── README-General_ORIGIN-GUARD.md
│   └── README-Frames_ORIGIN-GUARD.md
└── X9 - TRACK+/
    ├── decoderTrack+.js
    ├── README-General_TRACK+.md
    └── README-Frames_TRACK+.md
```

Each subfolder corresponds to a **product reference** or **firmware variant**, and contains the specific decoder used to parse sensor payloads.  
Within the X2 and X5 families the per-reference decoder files are identical copies: the decoder branches on the product type byte, so a single file covers the whole range.

---

## 📚 Product Families

| Family | Products | Decoder | Documentation |
|---|---|---|---|
| **A100LS_C** | RELAY | `decoderA100.js` | [General](A100LS_C%20-%20RELAY/README-General_RELAY.md) · [Frames](A100LS_C%20-%20RELAY/README-Frames_RELAY.md) |
| **A3** | FLOW CORE, FLOW PRO | `decoderFlow.js`<br>`encoderFlow.js` (downlink encoder) | [General](A3%20-%20FLOW%20CORE%20FLOW%20PRO/README-General_FLOW.md) · [Frames](A3%20-%20FLOW%20CORE%20FLOW%20PRO/README-Frames_FLOW.md) · [Examples](A3%20-%20FLOW%20CORE%20FLOW%20PRO/README-Examples_FLOW.md) |
| **X2** | FEEL+, RISE+, WAVE+, MOVE+, SIGN+, SENSE+, ATMO+ | `decoderX2.js` (per reference)<br>`decoderX2Milesight.js` (Milesight-compatible output) | [General](X2%20-%20FEEL+%20RISE+%20WAVE+%20MOVE+%20SIGN+%20SENSE+%20ATMO+/README_X2_General.md) · [Frames](X2%20-%20FEEL+%20RISE+%20WAVE+%20MOVE+%20SIGN+%20SENSE+%20ATMO+/README_X2_Frames.md) |
| **X5** | SIGN, WAVE, MOVE, RISE, FEEL, ECHO, VIEW | `decoderLoRaSigfoxX5.js` (per reference) | [General](X5%20-%20SIGN%20WAVE%20MOVE%20RISE%20FEEL%20ECHO%20VIEW/README-General_X5.md) · [Frames](X5%20-%20SIGN%20WAVE%20MOVE%20RISE%20FEEL%20ECHO%20VIEW/README-Frames_X5.md) |
| **X8** | AIR+, AIR | `decoderAir+.js`<br>`BMS/decoderAir+_BMS.js` (one numeric type per field, for BMS integration) | [General](X8%20-%20AIR+%20AIR/README-General_AIR.md) · [Frames](X8%20-%20AIR+%20AIR/README-Frames_AIR.md) · [BMS](X8%20-%20AIR+%20AIR/BMS/README-BMS_AIR.md) |
| **X8** | ORIGIN+, ORIGIN, GUARD+, GUARD | `decoderOrigin+.js` | [General](X8%20-%20ORIGIN+%20ORIGIN%20GUARD+%20GUARD/README-General_ORIGIN-GUARD.md) · [Frames](X8%20-%20ORIGIN+%20ORIGIN%20GUARD+%20GUARD/README-Frames_ORIGIN-GUARD.md) |
| **X9** | TRACK+ | `decoderTrack+.js` | [General](X9%20-%20TRACK+/README-General_TRACK+.md) · [Frames](X9%20-%20TRACK+/README-Frames_TRACK+.md) |

---

## 🗂 Documentation Convention

Each family folder carries two Markdown files:

| File | Content |
|---|---|
| `README-General_<FAMILY>.md` | Product scope, network parameters, message taxonomy, transmission logic, product functions driving the frames. |
| `README-Frames_<FAMILY>.md` | Bit-level structure of every uplink frame, downlink command list, error codes and units. |

> The X2 family still uses the earlier `README_X2_General.md` / `README_X2_Frames.md` naming.

---

## 📡 Product Type Bytes

Byte 0 of every uplink identifies the product:

| Family | Product | ID |
|---|---|---|
| **A100LS_C** | RELAY | 0xD3 |
| **A100LS_C** | SAFECUT *(decoded by the same file)* | 0xB0 |
| **A3** | FLOW CORE | 0xD2 |
| **A3** | FLOW PRO | 0xD6 |
| **X2** | FEEL+ | 0xB9 |
| **X2** | RISE+ | 0xBA |
| **X2** | WAVE+ | 0xBB |
| **X2** | MOVE+ | 0xC6 |
| **X2** | SIGN+ | 0xC7 |
| **X2** | SENSE+ | 0xC8 |
| **X2** | ATMO+ | 0xCD |
| **X5** | FEEL | 0xA9 |
| **X5** | RISE | 0xAA |
| **X5** | MOVE | 0xAB |
| **X5** | WAVE | 0xAC |
| **X5** | SIGN | 0xAD |
| **X5** | ECHO | 0xC9 |
| **X5** | VIEW | 0xCA |
| **X8** | AIR+ | 0xAE |
| **X8** | AIR | 0xAF |
| **X8** | ORIGIN+ | 0xB1 |
| **X8** | ORIGIN | 0xB2 |
| **X8** | GUARD+ | 0xB3 |
| **X8** | GUARD | 0xB4 |
| **X8** | ORIGIN+ LoRa/Sigfox | 0xBD |
| **X9** | TRACK+ | 0xB5 |

---

## ⚙️ Usage

Each decoder file is a standalone JavaScript module following the **LoRa Alliance** `decodeUplink(input)` signature. It can be imported or executed independently.  
They are designed to be used by backend applications, IoT platforms (e.g. ChirpStack, The Things Stack), or test utilities.

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
- 🔋 **Autonomy Calculator (VOLT):** https://nexelec-support.fr/n/volt/  
- 📚 **Support & Documentation:** https://support.nexelec.fr  
- 📧 **Support Contact:** support@nexelec.fr

---

## 📝 Changelog

Every decoder change is recorded in [CHANGELOG.md](CHANGELOG.md). Changes that rename or remove an output field, or change its value or type, are flagged there and announced before publication.

---

## 📜 License

Each product family is released under the **MIT License**: see the `LICENSE` file in the family folder.  
You may use, modify and integrate the decoders in your own products, provided the copyright notice is kept.  
© Nexelec
