/*
* Payload Decoder LoRa Alliance for VISTA SPACE (X410LS), VISTA FEEL (X420LS), VISTA MOVE (X430LS), VISTA WAVE (X440LS)
* Copyright 2026 Nexelec
* Version : 1.0.0
*
* Reference : D1196 - Guide technique VISTA LoRaWAN - V3 (EU868)
* Uplink / downlink port : 56
*
* Frame layout reminder :
*   byte 0        : product type (0xDA SPACE, 0xD7 FEEL, 0xD8 MOVE, 0xD9 WAVE)
*   byte 1 [7..4] : message type   byte 1 [3..0] : message version
*   next bits     : payload, MSB first, fields are NOT byte aligned
*/

function decodeUplink(input) {

    var stringHex = bytesString(input.bytes);

    var octetTypeProduit = parseInt(stringHex.substring(0, 2), 16);
    var octetTypeMessage = parseInt(stringHex.substring(2, 3), 16);
    var octetVersionMessage = parseInt(stringHex.substring(3, 4), 16);

    var data = dataOutput(octetTypeMessage);
    return { data };

    function bytesString(input) {
        var bufferString = '';
        var decToString = '';

        for (var i = 0; i < input.length; i++) {
            decToString = input[i].toString(16).padStart(2, '0')
            bufferString = bufferString.concat(decToString)
        }
        return bufferString;
    }

    /*
    * Generic bit field reader.
    * offset : position of the first bit of the field in the frame (bit 0 = MSB of byte 0)
    * size   : field length in bits (1 to 16)
    * Handles fields spanning several bytes and several fields packed in one byte.
    */
    function bitsValue(offset, size) {
        var firstNibble = Math.floor(offset / 4);
        var lastNibble = Math.floor((offset + size - 1) / 4);

        if (lastNibble >= stringHex.length) { return null }

        var chunk = stringHex.substring(firstNibble, lastNibble + 1);
        var shift = ((lastNibble + 1) * 4) - (offset + size);

        return (parseInt(chunk, 16) >>> shift) & ((1 << size) - 1);
    }

    function frameBitLength() {
        return stringHex.length * 4;
    }

    function dataOutput(octetTypeMessage) {
        if (octetTypeMessage == 0x01) { return periodicDataOutput() }
        if (octetTypeMessage == 0x02) { return historicalCO2DataOutput() }
        if (octetTypeMessage == 0x03) { return historicalTemperatureDataOutput() }
        if (octetTypeMessage == 0x04) { return historicalHumidityDataOutput() }
        if (octetTypeMessage == 0x05) { return productStatusDataOutput() }
        if (octetTypeMessage == 0x06) { return productConfigurationDataOutput() }
        if (octetTypeMessage == 0x07) { return presenceAlertDataOutput() }
        return { "typeOfProduct": typeOfProduct(octetTypeProduit), "typeOfMessage": "Reserved" };
    }

    function typeOfProduct(octetTypeProduit) {
        if (octetTypeProduit == 0xD7) { return "VISTA FEEL LoRa" }
        if (octetTypeProduit == 0xD8) { return "VISTA MOVE LoRa" }
        if (octetTypeProduit == 0xD9) { return "VISTA WAVE LoRa" }
        if (octetTypeProduit == 0xDA) { return "VISTA SPACE LoRa" }
        return "unknown product";
    }

    function typeOfMessage(octetTypeMessage) {
        var message_name = ["Reserved", "Periodic Data", "CO2 Historical Data", "Temperature Historical Data",
            "Humidity Historical Data", "Product Status", "Product Configuration", "Presence Alert"]
        return message_name[octetTypeMessage];
    }

    /* ------------------------------------------------------------------ */
    /* Measurement formatting                                              */
    /* ------------------------------------------------------------------ */

    function temperature(octetTemperatureValue) {
        if (octetTemperatureValue === null) { return "missing data" }
        if (octetTemperatureValue >= 1023) { return "error" }
        if (octetTemperatureValue >= 1022) { return "deconnected sensor" }
        if (octetTemperatureValue >= 1021) { return "desactivated sensor" }
        else { return { "value": parseFloat(((octetTemperatureValue / 10) - 30).toFixed(1)), "unit": "°C" } }
    }

    function humidity(octetHumidityValue) {
        if (octetHumidityValue === null) { return "missing data" }
        if (octetHumidityValue >= 1023) { return "error" }
        if (octetHumidityValue >= 1022) { return "deconnected sensor" }
        if (octetHumidityValue >= 1021) { return "desactivated sensor" }
        else { return { "value": parseFloat((octetHumidityValue / 10).toFixed(1)), "unit": "%RH" } }
    }

    /* Periodic CO2 : 14 bits, 1 ppm resolution */
    function co2(octetCO2Value) {
        if (octetCO2Value === null) { return "missing data" }
        if (octetCO2Value >= 16383) { return "error" }
        if (octetCO2Value >= 16382) { return "deconnected sensor" }
        if (octetCO2Value >= 16381) { return "desactivated sensor" }
        if (octetCO2Value >= 16380) { return "end of life sensor" }
        else { return { "value": octetCO2Value, "unit": "ppm" } }
    }

    function luminosity(octetLuminosityValue) {
        if (octetLuminosityValue === null) { return "missing data" }
        if (octetLuminosityValue >= 1023) { return "error" }
        if (octetLuminosityValue >= 1022) { return "deconnected sensor" }
        if (octetLuminosityValue >= 1021) { return "desactivated sensor" }
        else { return { "value": (octetLuminosityValue * 5), "unit": "lux" } }
    }

    function activityIndex(octetActivityIndex) {
        if (octetActivityIndex === null) { return "missing data" }
        if (octetActivityIndex >= 127) { return "error" }
        if (octetActivityIndex >= 126) { return "deconnected sensor" }
        if (octetActivityIndex >= 125) { return "desactivated sensor" }
        else { return { "value": octetActivityIndex, "unit": "%" } }
    }

    function buttonPress(octetButtonValue) {
        if (octetButtonValue === null) { return "missing data" }
        if (octetButtonValue === 0) { return "none" }
        else { return "short" }
    }

    /* Periodic frame flag : 0 = absence, 1 = presence */
    function presence(octetPresence) {
        if (octetPresence === null) { return "missing data" }
        var message_name = ["absence", "presence"]
        return message_name[octetPresence];
    }

    /* Presence alert frame : 0 = occupied, 1 = vacant */
    function roomStatus(octetRoomStatus) {
        if (octetRoomStatus === null) { return "missing data" }
        var message_name = ["occupied", "vacant"]
        return message_name[octetRoomStatus];
    }

    /* ------------------------------------------------------------------ */
    /* Status formatting                                                   */
    /* ------------------------------------------------------------------ */

    function batteryVoltage(octetBatteryVoltage) {
        if (octetBatteryVoltage === null) { return "missing data" }
        if (octetBatteryVoltage >= 1023) { return "error" }
        if (octetBatteryVoltage >= 1022) { return "Reserved" }
        else { return { "value": (octetBatteryVoltage * 5), "unit": "mV" } }
    }

    function batterieLevelArgument(octetBatteryLevel) {
        if (octetBatteryLevel === null) { return "missing data" }
        var message_name = ["high", "medium", "low", "critical", "Reserved", "Reserved", "Reserved", "Reserved"]
        return message_name[octetBatteryLevel];
    }

    function productHwStatusArgument(octetProductHwStatus) {
        if (octetProductHwStatus === null) { return "missing data" }
        var message_name = ["ok", "error"]
        return message_name[octetProductHwStatus];
    }

    function productActivationTimeCounter(octetTimeCounter) {
        if (octetTimeCounter === null) { return "missing data" }
        if (octetTimeCounter >= 1023) { return "error" }
        else { return { "value": octetTimeCounter, "unit": "month" } }
    }

    function lastManualCalibration(octetDays) {
        if (octetDays === null) { return "missing data" }
        if (octetDays >= 255) { return "error" }
        else { return { "value": octetDays, "unit": "days" } }
    }

    function antiTearArgument(octetAntiTear) {
        if (octetAntiTear === null) { return "missing data" }
        var message_name = ["base not detected", "base detected", "just removed from the base", "just installed on the base"]
        return message_name[octetAntiTear];
    }

    function lowBatterieThreshold(octetLowBatterie) {
        if (octetLowBatterie === null) { return "missing data" }
        return { "value": (octetLowBatterie * 5) + 2000, "unit": "mV" };
    }

    /* ------------------------------------------------------------------ */
    /* Configuration formatting                                            */
    /* ------------------------------------------------------------------ */

    function reconfigurationSource(octetReconfigurationSource) {
        if (octetReconfigurationSource === null) { return "missing data" }
        if (octetReconfigurationSource == 0) { return "nfc" }
        if (octetReconfigurationSource == 1) { return "downlink" }
        if (octetReconfigurationSource == 2) { return "start-up" }
        if (octetReconfigurationSource == 5) { return "local" }
        else { return "Reserved" }
    }

    function reconfigurationState(octetReconfigurationState) {
        if (octetReconfigurationState === null) { return "missing data" }
        var message_name = ["total success", "partial success", "total failure", "Reserved"]
        return message_name[octetReconfigurationState];
    }

    function loraRegion(octetLoRaRegion) {
        if (octetLoRaRegion === null) { return "missing data" }
        if (octetLoRaRegion == 1) { return "lorawan-eu868" }
        if (octetLoRaRegion == 2) { return "lorawan-us915" }
        if (octetLoRaRegion == 4) { return "lorawan-au915" }
        if (octetLoRaRegion == 6) { return "lorawan-in865" }
        else { return "Reserved" }
    }

    function active(octetActive) {
        if (octetActive === null) { return "missing data" }
        var message_name = ["off", "on"]
        return message_name[octetActive];
    }

    function period(octetPeriod) {
        if (octetPeriod === null) { return "missing data" }
        return { "value": octetPeriod, "unit": "minutes" };
    }

    /* Datalog transmission period : 10 minutes step */
    function transmissionPeriodHistorical(octetPeriodHistorical) {
        if (octetPeriodHistorical === null) { return "missing data" }
        if (octetPeriodHistorical >= 255) { return "error" }
        else { return { "value": (octetPeriodHistorical * 10), "unit": "minutes" } }
    }

    /* Delta CO2 : 8 bits, 0-250 mapped on 0-1000 ppm (4 ppm step) */
    function deltaCO2(octetDeltaCO2) {
        if (octetDeltaCO2 === null) { return "missing data" }
        if (octetDeltaCO2 === 255) { return "desactivated" }
        else { return { "value": (octetDeltaCO2 * 4), "unit": "ppm" } }
    }

    /* Delta temperature : 7 bits, 0.1 °C step */
    function deltaTemp(octetDeltaTemp) {
        if (octetDeltaTemp === null) { return "missing data" }
        if (octetDeltaTemp === 127) { return "desactivated" }
        else { return { "value": parseFloat((octetDeltaTemp * 0.1).toFixed(1)), "unit": "°C" } }
    }

    /* CO2 LED thresholds : 10 bits, 5 ppm step */
    function co2Threshold(octetCO2Threshold) {
        if (octetCO2Threshold === null) { return "missing data" }
        return { "value": (octetCO2Threshold * 5), "unit": "ppm" };
    }

    function pendingJoin(octetPending) {
        if (octetPending === null) { return "missing data" }
        var message_name = ["no join programmed", "join programmed"]
        return message_name[octetPending];
    }

    function nfcStatus(octetNfcStatus) {
        if (octetNfcStatus === null) { return "missing data" }
        var message_name = ["discoverable", "no discoverable", "Reserved", "Reserved"]
        return message_name[octetNfcStatus];
    }

    function counter(octetCounter) {
        if (octetCounter === null) { return "missing data" }
        return octetCounter;
    }

    /* ------------------------------------------------------------------ */
    /* 0x01 - Periodic data                                                */
    /* ------------------------------------------------------------------ */

    function periodicDataOutput() {
        var data = {
            "typeOfProduct": typeOfProduct(octetTypeProduit),
            "typeOfMessage": typeOfMessage(octetTypeMessage),
            "versionOfMessage": octetVersionMessage
        };

        if (octetTypeProduit == 0xDA) {                                 // SPACE : 5 bytes
            data.luminosity = luminosity(bitsValue(16, 10));
            data.buttonPress = buttonPress(bitsValue(26, 1));
            data.activityIndex = activityIndex(bitsValue(27, 7));
            data.presence = presence(bitsValue(34, 1));
        }
        else if (octetTypeProduit == 0xD7) {                            // FEEL : 5 bytes
            data.temperature = temperature(bitsValue(16, 10));
            data.humidity = humidity(bitsValue(26, 10));
            data.buttonPress = buttonPress(bitsValue(36, 1));
        }
        else if (octetTypeProduit == 0xD8) {                            // MOVE : 7 bytes
            data.temperature = temperature(bitsValue(16, 10));
            data.humidity = humidity(bitsValue(26, 10));
            data.luminosity = luminosity(bitsValue(36, 10));
            data.buttonPress = buttonPress(bitsValue(46, 1));
            data.activityIndex = activityIndex(bitsValue(47, 7));
            data.presence = presence(bitsValue(54, 1));
        }
        else if (octetTypeProduit == 0xD9) {                            // WAVE : 9 bytes
            data.temperature = temperature(bitsValue(16, 10));
            data.humidity = humidity(bitsValue(26, 10));
            data.co2 = co2(bitsValue(36, 14));
            data.luminosity = luminosity(bitsValue(50, 10));
            data.buttonPress = buttonPress(bitsValue(60, 1));
            data.activityIndex = activityIndex(bitsValue(61, 7));
            data.presence = presence(bitsValue(68, 1));
        }
        return data;
    }

    /* ------------------------------------------------------------------ */
    /* 0x02 / 0x03 / 0x04 - Historical data (datalog)                      */
    /* Measures are 10 bits each, from the most recent to the oldest       */
    /* ------------------------------------------------------------------ */

    function historicalDataOutput(convert) {
        var numberOfMeasures = bitsValue(16, 6);
        var periodBetweenMeasures = bitsValue(22, 8);
        var repetition = bitsValue(30, 6);
        var measures = [];

        if (numberOfMeasures !== null) {
            for (var i = 0; i < numberOfMeasures; i++) {
                var offset = 36 + (10 * i);
                if ((offset + 10) > frameBitLength()) { break }
                measures.push(convert(bitsValue(offset, 10)));
            }
        }

        return {
            "typeOfProduct": typeOfProduct(octetTypeProduit),
            "typeOfMessage": typeOfMessage(octetTypeMessage),
            "versionOfMessage": octetVersionMessage,
            "numberOfMeasures": counter(numberOfMeasures),
            "periodBetweenMeasure": transmissionPeriodHistorical(periodBetweenMeasures),
            "redundancy": counter(repetition),
            "measures": measures
        };
    }

    /* Historical CO2 : 10 bits, 5 ppm resolution */
    function historicalCO2(octetCO2Value) {
        if (octetCO2Value >= 1023) { return "error" }
        if (octetCO2Value >= 1022) { return "deconnected sensor" }
        if (octetCO2Value >= 1021) { return "desactivated sensor" }
        if (octetCO2Value >= 1020) { return "end of life sensor" }
        else { return octetCO2Value * 5 }
    }

    function historicalTemperature(octetTemperatureValue) {
        if (octetTemperatureValue >= 1023) { return "error" }
        if (octetTemperatureValue >= 1022) { return "deconnected sensor" }
        if (octetTemperatureValue >= 1021) { return "desactivated sensor" }
        else { return parseFloat(((octetTemperatureValue / 10) - 30).toFixed(1)) }
    }

    function historicalHumidity(octetHumidityValue) {
        if (octetHumidityValue >= 1023) { return "error" }
        if (octetHumidityValue >= 1022) { return "deconnected sensor" }
        if (octetHumidityValue >= 1021) { return "desactivated sensor" }
        else { return parseFloat((octetHumidityValue / 10).toFixed(1)) }
    }

    function historicalCO2DataOutput() {
        var data = historicalDataOutput(historicalCO2);
        data.co2 = { "value": data.measures, "unit": "ppm" };
        delete data.measures;
        return data;
    }

    function historicalTemperatureDataOutput() {
        var data = historicalDataOutput(historicalTemperature);
        data.temperature = { "value": data.measures, "unit": "°C" };
        delete data.measures;
        return data;
    }

    function historicalHumidityDataOutput() {
        var data = historicalDataOutput(historicalHumidity);
        data.humidity = { "value": data.measures, "unit": "%RH" };
        delete data.measures;
        return data;
    }

    /* ------------------------------------------------------------------ */
    /* 0x05 - Product status (all products, 10 bytes)                      */
    /* ------------------------------------------------------------------ */

    function productStatusDataOutput() {
        return {
            "typeOfProduct": typeOfProduct(octetTypeProduit),
            "typeOfMessage": typeOfMessage(octetTypeMessage),
            "versionOfMessage": octetVersionMessage,
            "hardwareVersion": counter(bitsValue(16, 8)),
            "softwareVersion": counter(bitsValue(24, 8)),
            "batteryVoltage": batteryVoltage(bitsValue(32, 10)),
            "batteryLevel": batterieLevelArgument(bitsValue(42, 3)),
            "statusProduct": productHwStatusArgument(bitsValue(45, 1)),
            "timeActivation": productActivationTimeCounter(bitsValue(46, 10)),
            "timeCo2LastCalibration": lastManualCalibration(bitsValue(56, 8)),
            "statusAntiTear": antiTearArgument(bitsValue(64, 2)),
            "lowBatterieThreshold": lowBatterieThreshold(bitsValue(66, 8))
        };
    }

    /* ------------------------------------------------------------------ */
    /* 0x06 - Product configuration (layout depends on the product)        */
    /* ------------------------------------------------------------------ */

    function productConfigurationDataOutput() {
        if (octetTypeProduit == 0xDA) { return spaceConfigurationDataOutput() }
        if (octetTypeProduit == 0xD7) { return feelConfigurationDataOutput() }
        if (octetTypeProduit == 0xD8) { return moveConfigurationDataOutput() }
        if (octetTypeProduit == 0xD9) { return waveConfigurationDataOutput() }
        return { "typeOfProduct": typeOfProduct(octetTypeProduit), "typeOfMessage": typeOfMessage(octetTypeMessage) };
    }

    /* SPACE : 9 bytes */
    function spaceConfigurationDataOutput() {
        return {
            "typeOfProduct": typeOfProduct(octetTypeProduit),
            "typeOfMessage": typeOfMessage(octetTypeMessage),
            "versionOfMessage": octetVersionMessage,
            "reconfigurationSource": reconfigurationSource(bitsValue(16, 3)),
            "reconfigurationStatus": reconfigurationState(bitsValue(19, 2)),
            "periodMeasure": period(bitsValue(21, 5)),
            "enableMotion": active(bitsValue(26, 1)),
            "enableButtonPressNotification": active(bitsValue(27, 1)),
            "protocolAndRegion": loraRegion(bitsValue(28, 4)),
            "enablePeriodicData": active(bitsValue(32, 1)),
            "periodPeriodicTransmission": period(bitsValue(33, 6)),
            "pendingJoin": pendingJoin(bitsValue(39, 1)),
            "enableNfcDiscover": nfcStatus(bitsValue(40, 2)),
            "downlinkFcnt": counter(bitsValue(42, 16)),
            "enableRoomPresence": active(bitsValue(58, 1)),
            "periodWithoutMotion": period(bitsValue(59, 6))
        };
    }

    /* FEEL : 11 bytes */
    function feelConfigurationDataOutput() {
        return {
            "typeOfProduct": typeOfProduct(octetTypeProduit),
            "typeOfMessage": typeOfMessage(octetTypeMessage),
            "versionOfMessage": octetVersionMessage,
            "reconfigurationSource": reconfigurationSource(bitsValue(16, 3)),
            "reconfigurationStatus": reconfigurationState(bitsValue(19, 2)),
            "periodMeasure": period(bitsValue(21, 5)),
            "enableButtonPressNotification": active(bitsValue(26, 1)),
            "protocolAndRegion": loraRegion(bitsValue(27, 4)),
            "enablePeriodicData": active(bitsValue(31, 1)),
            "periodPeriodicTransmission": period(bitsValue(32, 6)),
            "deltaTemperature": deltaTemp(bitsValue(38, 7)),
            "enableDatalogTemperature": active(bitsValue(45, 1)),
            "datalogNewValues": counter(bitsValue(46, 6)),
            "datalogRepeatValues": counter(bitsValue(52, 5)),
            "periodDatalogTransmission": transmissionPeriodHistorical(bitsValue(57, 8)),
            "pendingJoin": pendingJoin(bitsValue(65, 1)),
            "enableNfcDiscover": nfcStatus(bitsValue(66, 2)),
            "enableDatalogHumidity": active(bitsValue(68, 1)),
            "downlinkFcnt": counter(bitsValue(69, 16))
        };
    }

    /* MOVE : 12 bytes */
    function moveConfigurationDataOutput() {
        return {
            "typeOfProduct": typeOfProduct(octetTypeProduit),
            "typeOfMessage": typeOfMessage(octetTypeMessage),
            "versionOfMessage": octetVersionMessage,
            "reconfigurationSource": reconfigurationSource(bitsValue(16, 3)),
            "reconfigurationStatus": reconfigurationState(bitsValue(19, 2)),
            "periodMeasure": period(bitsValue(21, 5)),
            "enableMotion": active(bitsValue(26, 1)),
            "enableButtonPressNotification": active(bitsValue(27, 1)),
            "protocolAndRegion": loraRegion(bitsValue(28, 4)),
            "enablePeriodicData": active(bitsValue(32, 1)),
            "periodPeriodicTransmission": period(bitsValue(33, 6)),
            "deltaTemperature": deltaTemp(bitsValue(39, 7)),
            "enableDatalogTemperature": active(bitsValue(46, 1)),
            "datalogNewValues": counter(bitsValue(47, 6)),
            "datalogRepeatValues": counter(bitsValue(53, 5)),
            "periodDatalogTransmission": transmissionPeriodHistorical(bitsValue(58, 8)),
            "pendingJoin": pendingJoin(bitsValue(66, 1)),
            "enableNfcDiscover": nfcStatus(bitsValue(67, 2)),
            "enableDatalogHumidity": active(bitsValue(69, 1)),
            "downlinkFcnt": counter(bitsValue(70, 16)),
            "enableRoomPresence": active(bitsValue(86, 1)),
            "periodWithoutMotion": period(bitsValue(87, 6))
        };
    }

    /* WAVE : 16 bytes */
    function waveConfigurationDataOutput() {
        return {
            "typeOfProduct": typeOfProduct(octetTypeProduit),
            "typeOfMessage": typeOfMessage(octetTypeMessage),
            "versionOfMessage": octetVersionMessage,
            "reconfigurationSource": reconfigurationSource(bitsValue(16, 3)),
            "reconfigurationStatus": reconfigurationState(bitsValue(19, 2)),
            "periodMeasure": period(bitsValue(21, 5)),
            "enableCo2": active(bitsValue(26, 1)),
            "enableMotion": active(bitsValue(27, 1)),
            "enableAutomaticCo2Calibration": active(bitsValue(28, 1)),
            "thresholdCo2Medium": co2Threshold(bitsValue(29, 10)),
            "thresholdCo2High": co2Threshold(bitsValue(39, 10)),
            "enableLedCo2": active(bitsValue(49, 1)),
            "enableLedMediumLevel": active(bitsValue(50, 1)),
            "enableButtonPressNotification": active(bitsValue(51, 1)),
            "protocolAndRegion": loraRegion(bitsValue(52, 4)),
            "enablePeriodicData": active(bitsValue(56, 1)),
            "periodPeriodicTransmission": period(bitsValue(57, 6)),
            "deltaCo2": deltaCO2(bitsValue(63, 8)),
            "deltaTemperature": deltaTemp(bitsValue(71, 7)),
            "enableDatalogCo2": active(bitsValue(78, 1)),
            "enableDatalogTemperature": active(bitsValue(79, 1)),
            "datalogNewValues": counter(bitsValue(80, 6)),
            "datalogRepeatValues": counter(bitsValue(86, 5)),
            "periodDatalogTransmission": transmissionPeriodHistorical(bitsValue(91, 8)),
            "pendingJoin": pendingJoin(bitsValue(99, 1)),
            "enableNfcDiscover": nfcStatus(bitsValue(100, 2)),
            "enableDatalogHumidity": active(bitsValue(102, 1)),
            "downlinkFcnt": counter(bitsValue(103, 16)),
            "enableRoomPresence": active(bitsValue(119, 1)),
            "periodWithoutMotion": period(bitsValue(120, 6))
        };
    }

    /* ------------------------------------------------------------------ */
    /* 0x07 - Presence / absence alert (SPACE, MOVE, WAVE)                 */
    /* ------------------------------------------------------------------ */

    function presenceAlertDataOutput() {
        return {
            "typeOfProduct": typeOfProduct(octetTypeProduit),
            "typeOfMessage": typeOfMessage(octetTypeMessage),
            "versionOfMessage": octetVersionMessage,
            "roomStatus": roomStatus(bitsValue(16, 1))
        };
    }

} // end of decoder

/* Optional export for Node.js / unit tests, ignored by LoRaWAN network servers */
if (typeof module !== "undefined" && module.exports) { module.exports = { decodeUplink: decodeUplink }; }