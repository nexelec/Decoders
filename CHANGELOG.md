# Changelog

All notable changes to the Nexelec decoders are recorded here, per product family.

## Versioning and output changes

Each decoder carries its own version in its header (`Version : X.Y.Z`).

| Change | Version bump | Announced |
|---|---|---|
| Bug fix that does not change the name, type or meaning of an output field | patch (`1.0.x`) | in this changelog |
| New output field, new frame type or new frame version | minor (`1.x.0`) | in this changelog |
| **Output field renamed or removed, value or type changed** (e.g. a label replaced, an error code turned into a string) | **major (`x.0.0`)** | in this changelog, **before publication** |

Changes that alter the output of a decoder are marked **⚠ Output change** below. Integrators should read those entries before updating a decoder.

> The entries up to 29/09/2026 below were released under patch versions although some of them change the output; they are flagged so that integrators can check them. From now on, output changes follow the rule above.

---

## A3 — FLOW CORE / FLOW PRO

### `decoderFlow.js` 1.1.0 — 2026-10-08
- New field `bootloaderVersion` in the product status frame, version 1 (bits 108–115). Technical guide D1183C draft of October 2026.
- New field `isFuotaPending` in the product configuration frame, version 3 (bit 200: deferred FUOTA activation scheduled by downlink `0x9B`). Only output when the frame carries it; the first version 3 frames (25 bytes) are decoded as before.
- New examples S4 (status v1) and C4 (configuration v3 with bit 200) in `README-Examples_FLOW.md` / `examples_FLOW.json`.

### `encoderFlow.js` 1.1.0 — 2026-10-08
- New command `0x9B` (`scheduleFuotaMode`): deferred FUOTA mode activation at a Unix epoch UTC date (seconds, or ISO 8601 string), `0` cancels the pending request. Technical guide D1183C draft of October 2026.
- New legacy entry points `Encode(fPort, obj)` (ChirpStack v3, Milesight gateways) and `Encoder(obj, port)` (TTN v2), same signatures as the Milesight codecs. They return the byte array and throw on invalid input. `encodeDownlink` / `decodeDownlink` are unchanged.

### `decoderFlow.js` 1.0.9 — 2026-09-29
- ⚠ **Output change:** error codes are returned as strings instead of raw numbers:
  - temperatures (1023), setpoints (63), motor position and motor stroke (8191), activation time (1023): `"Error"`;
  - battery voltages: `"No battery"` (1021), `"Reserved"` (1022), `"Error"` (1023). These codes were previously returned multiplied by 5 (e.g. `5115`), and 1022 as a 5110 mV reading.
- Fix: configuration version 0, `lowBatteryValveOpeningPercent` is read on bits 91–97 (it was read on the `temperatureModeAbsent` bits).

### `decoderFlow.js` 1.0.8 — 2026-09-29
- ⚠ **Output change:** `typeOfProduct` returns `"FLOW CORE"` for 0xD2 (was `"FLOW"`) and `"FLOW PRO"` for 0xD6 (was `"FLOW+"`).

### `encoderFlow.js` 1.0.0 — 2026-09-29
- New downlink encoder (`encodeDownlink` / `decodeDownlink`) covering the full revision C command set, including `0x97` (FUOTA mode) and `0x9A` (setpoint display orientation).

### Documentation — 2026-09-29
- RX2 default data rate: SF9. MAC commands documented: LinkCheckReq, DeviceTimeReq.
- New `README-Examples_FLOW.md` / `examples_FLOW.json`: example uplinks for every frame type and version.

---

## X2 — FEEL+ / RISE+ / WAVE+ / MOVE+ / SIGN+ / SENSE+ / ATMO+

### `decoderX2.js` 1.0.1 and `decoderX2Milesight.js` 1.0.1 — 2026-09-29
- ⚠ **Output change (fix):** `periodWithoutMotion` is read on 6 bits from bit 155. It was read on bits 154–159, shifted by one bit and including the Presence Alert flag (e.g. 30 min decoded as 15 min, or 47 min with the alert on).
- Fix: `decoderX2.js` no longer starts with a Node-RED test wrapper. Since 2026-04-27 the file failed to load on network servers (`SyntaxError: Illegal return statement`).

### 2025-11-17
- ⚠ **Output change:** output fields renamed (e.g. `productStatus` → `statusProduct`, `activationTime` → `timeActivation`), together with X5.

---

## X5 — SIGN / WAVE / MOVE / RISE / FEEL / ECHO / VIEW

### 2025-11-17
- ⚠ **Output change:** output fields renamed (e.g. `AirDrive` → `airDrive`, `hardwareStatus` → `statusProduct`), together with X2.

---

## X8 — AIR+ / AIR

### `decoderAir+.js` 1.0.2 and `BMS/decoderAir+_BMS.js` 1.0.2 — 2026-09-29
- The BMS decoder moves to `BMS/decoderAir+_BMS.js`, with its own documentation `BMS/README-BMS_AIR.md`.
- ⚠ **Output change (standard decoder):** measurement errors return strings again, as in 1.0.0 and in the technical guide (`"Error"`, `"Sensor not present"`).
- ⚠ **Output change (both):** `remainingProductLifetime` uses `"value"` instead of `"Value"`.
- ⚠ **Output change (standard decoder):** `swRevision` label is `"V"` + code × 0.1 for every code (e.g. 25 = `V2.5`).
- ⚠ **Output change (BMS decoder):** temperature above 1000 and humidity above 200 (outside the documented range) are returned as raw codes instead of converted values.
- A payload shorter than 2 bytes returns `"Payload too short"` instead of `"Unknown message type"`.

### `decoderAir+.js` 1.0.1 and `decoderAir+_BMS.js` 1.0.0 — 2026-09-28
- New BMS decoder (one numeric type per field).
- ⚠ **Output change:** measurement errors returned the raw error code as `{"value", "unit"}` (reverted in 1.0.2 for the standard decoder).
- ⚠ **Output change (fix):** `downlinkCounter` was halved by a wrong 1-bit shift; `hushStatus` returned hardware-fault labels.
- Fix: unmapped codes, unknown message types and truncated payloads no longer return `undefined`; frame 0x04 is decoded.

### 2026-09-17
- ⚠ **Output change:** `batteryVoltage`, `batteryResistanceThreshold` and `batteryLowVoltageThreshold` removed from the Product Status frame (the header version stayed 1.0.0); `magnetDetection` added.

---

## All families

### 2026-09-28
- MIT `LICENSE` added in each product family folder.
