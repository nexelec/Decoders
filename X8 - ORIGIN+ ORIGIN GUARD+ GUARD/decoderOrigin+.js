/*
* Payload Decoder LoRa Alliance for ORIGIN+ (X870), ORIGIN (X865), GUARD+ (X860), GUARD (X855)
* Copyright 2026 Nexelec
* Version : 2.0.0
*
* Reference : D1035C - ORIGIN+ / ORIGIN / GUARD+ / GUARD LoRa Sigfox Technical Guide (05/12/2023)
* Uplink port : 56 (LoRaWAN). Frames 0x00 to 0x03 are also sent over Sigfox, with the same layout.
*
* Frame layout reminder :
*   byte 0    : product type (0xBD ORIGIN+, 0xB2 ORIGIN, 0xB3 GUARD+, 0xB4 GUARD)
*   byte 1    : message type (0x00 to 0x05)
*   next bits : payload, MSB first, fields are NOT byte aligned
*/

function decodeUplink(input) {

    var stringHex = bytesString(input.bytes);

    var octetTypeProduit = parseInt(stringHex.substring(0, 2), 16);
    var octetTypeMessage = parseInt(stringHex.substring(2, 4), 16);

    // Minimum payload length in bytes for each message type
    var frameLength = [7, 9, 7, 9, 5, 5];

    if (input.bytes.length < 2) {
        return { "errors": ["Payload too short: " + input.bytes.length + " bytes, at least 2 expected"] };
    }
    if (octetTypeMessage >= frameLength.length) {
        return { "errors": ["Unknown message type: " + octetTypeMessage] };
    }
    if (input.bytes.length < frameLength[octetTypeMessage]) {
        return {
            "errors": ["Payload too short for message type " + octetTypeMessage + ": " +
                input.bytes.length + " bytes, " + frameLength[octetTypeMessage] + " expected"]
        };
    }

    var warnings = [];
    var data = dataOutput(octetTypeMessage);

    if (warnings.length > 0) { return { "data": data, "warnings": warnings } }
    return { "data": data };

    function bytesString(input) {
        var bufferString = '';
        var decToString = '';

        for (var i = 0; i < input.length; i++) {
            decToString = ('0' + (input[i] & 0xFF).toString(16)).slice(-2);
            bufferString = bufferString.concat(decToString);
        }
        return bufferString;
    }

    /*
    * Reads a bit field.
    * offset : position of the first bit of the field in the frame (bit 0 = MSB of byte 0),
    *          as given in the "Offset" column of the technical guide
    * size   : field length in bits (1 to 24)
    */
    function bitsValue(offset, size) {
        var firstNibble = Math.floor(offset / 4);
        var lastNibble = Math.floor((offset + size - 1) / 4);
        var shift = ((lastNibble + 1) * 4) - (offset + size);

        return (parseInt(stringHex.substring(firstNibble, lastNibble + 1), 16) >>> shift) & ((1 << size) - 1);
    }

    function dataOutput(octetTypeMessage) {
        if (octetTypeMessage == 0x00) { return productStatusDataOutput() }
        if (octetTypeMessage == 0x01) { return productConfigurationDataOutput() }
        if (octetTypeMessage == 0x02) { return alarmStatusDataOutput() }
        if (octetTypeMessage == 0x03) { return dailyAirQualityDataOutput() }
        if (octetTypeMessage == 0x04) { return periodicDataOutput() }
        if (octetTypeMessage == 0x05) { return historicalTemperatureDataOutput() }
    }

    function typeOfProduct(octetTypeProduit) {
        if (octetTypeProduit == 0xBD) { return "ORIGIN+" }
        if (octetTypeProduit == 0xB2) { return "ORIGIN" }
        if (octetTypeProduit == 0xB3) { return "GUARD+" }
        if (octetTypeProduit == 0xB4) { return "GUARD" }
        // 0xB1: code sent by the first ORIGIN+ LoRa firmware, not listed in D1035C
        if (octetTypeProduit == 0xB1) { return "ORIGIN+" }
        return "Reserved";
    }

    function typeOfMessage(octetTypeMessage) {
        var message_name = ["Product Status", "Product Configuration", "Alarm Status", "Daily Air Quality",
            "Periodic Data", "Historical Data"]
        return message_name[octetTypeMessage];
    }

    function headerOutput() {
        return {
            "typeOfProduct": typeOfProduct(octetTypeProduit),
            "typeOfMessage": typeOfMessage(octetTypeMessage)
        };
    }

    /* ------------------------------------------------------------------ */
    /* Measurements                                                        */
    /* ------------------------------------------------------------------ */

    /* 10 bits, 0.1 °C step, 30 °C offset (0 = -30 °C, 300 = 0 °C, 1000 = 70 °C) */
    function temperature(octetTemperatureValue) {
        if (octetTemperatureValue >= 1023) { return "Error" }
        if (octetTemperatureValue >= 1022) { return "Sensor not present" }
        else { return { "value": Math.round(((octetTemperatureValue / 10) - 30) * 10) / 10, "unit": "°C" } }
    }

    /* Historical data: value without unit (the unit is given once for the array) */
    function historicalTemperature(octetTemperatureValue) {
        if (octetTemperatureValue >= 1023) { return "Error" }
        if (octetTemperatureValue >= 1022) { return "Sensor not present" }
        else { return Math.round(((octetTemperatureValue / 10) - 30) * 10) / 10 }
    }

    /* 8 bits, 0.5 %RH step (0 to 200 = 0 to 100 %RH) */
    function humidity(octetHumidityValue) {
        if (octetHumidityValue >= 255) { return "Error" }
        else { return { "value": octetHumidityValue / 2, "unit": "%RH" } }
    }

    /* ------------------------------------------------------------------ */
    /* Status                                                              */
    /* ------------------------------------------------------------------ */

    function okError(octetOk) {
        var message_name = ["ok", "error"]
        return message_name[octetOk];
    }

    function remainingProductLifetime(octetMonths) {
        return { "value": octetMonths, "unit": "month" };
    }

    function antiTearStatus(octetAntiTear) {
        var message_name = ["not detected", "detected", "just removed from the base", "just installed on the base",
            "never detected", "Reserved", "Reserved", "Reserved"]
        return message_name[octetAntiTear];
    }

    function batteryLevel(octetBatteryLevel) {
        var message_name = ["high", "medium", "low", "critical"]
        return message_name[octetBatteryLevel];
    }

    /* 5 mV step, 2000 mV offset */
    function batteryVoltage(octetBatteryVoltage) {
        return { "value": (octetBatteryVoltage * 5) + 2000, "unit": "mV" };
    }

    /* ------------------------------------------------------------------ */
    /* Configuration                                                       */
    /* ------------------------------------------------------------------ */

    function reconfigurationSource(octetReconfigurationSource) {
        if (octetReconfigurationSource == 0) { return "nfc" }
        if (octetReconfigurationSource == 1) { return "downlink" }
        if (octetReconfigurationSource == 2) { return "start up" }
        if (octetReconfigurationSource == 5) { return "local" }
        else { return "Reserved" }
    }

    function reconfigurationState(octetReconfigurationState) {
        var message_name = ["total success", "partial success", "total failure", "Reserved"]
        return message_name[octetReconfigurationState];
    }

    function active(octetActive) {
        var message_name = ["off", "on"]
        return message_name[octetActive];
    }

    function pendingJoin(octetPending) {
        var message_name = ["no join programmed", "join programmed"]
        return message_name[octetPending];
    }

    function nfcStatus(octetNfcStatus) {
        var message_name = ["discoverable", "no discoverable", "Reserved", "Reserved"]
        return message_name[octetNfcStatus];
    }

    /* Datalog: 10 minutes step */
    function transmissionPeriodHistorical(octetPeriodHistorical) {
        return { "value": octetPeriodHistorical * 10, "unit": "minutes" };
    }

    /* ------------------------------------------------------------------ */
    /* Alarm                                                               */
    /* ------------------------------------------------------------------ */

    function smokeAlarm(octetAlarm) {
        var message_name = ["no smoke detected", "smoke detected", "repeated alarm", "Reserved"]
        return message_name[octetAlarm];
    }

    function smokeAlarmHush(octetHush) {
        var message_name = ["stopped, no more smoke", "stopped by the main button",
            "stopped by all the smoke-detecting products", "Reserved"]
        return message_name[octetHush];
    }

    function productTest(octetTest) {
        var message_name = ["none", "local", "remote", "Reserved"]
        return message_name[octetTest];
    }

    function trueFalse(octetTrue) {
        var message_name = ["false", "true"]
        return message_name[octetTrue];
    }

    function weeks(octetWeeks) {
        return { "value": octetWeeks, "unit": "weeks" };
    }

    /* ------------------------------------------------------------------ */
    /* 0x00 - Product status                                               */
    /* ------------------------------------------------------------------ */

    function productStatusDataOutput() {
        var data_hw_version = bitsValue(16, 8);
        var data_sw_version = bitsValue(24, 8);
        var data_remaining_lifetime = bitsValue(32, 8);
        var data_smoke_sensor = bitsValue(40, 1);
        var data_temp_hum_sensor = bitsValue(41, 1);
        var data_anti_tear = bitsValue(43, 3);
        var data_battery_level = bitsValue(46, 2);
        var data_battery_voltage = bitsValue(48, 8);

        var data = headerOutput();
        data.hardwareVersion = data_hw_version;
        data.softwareVersion = data_sw_version;
        data.remainingProductLifetime = remainingProductLifetime(data_remaining_lifetime);
        data.statusSmokeSensor = okError(data_smoke_sensor);
        data.statusTemperatureHumiditySensor = okError(data_temp_hum_sensor);
        data.statusAntiTear = antiTearStatus(data_anti_tear);
        data.batteryLevel = batteryLevel(data_battery_level);
        data.batteryVoltage = batteryVoltage(data_battery_voltage);
        return data;
    }

    /* ------------------------------------------------------------------ */
    /* 0x01 - Product configuration                                        */
    /* ------------------------------------------------------------------ */

    function productConfigurationDataOutput() {
        var data_config_source = bitsValue(16, 3);
        var data_config_status = bitsValue(19, 2);
        var data_datalog_temperature_on_off = bitsValue(21, 1);
        var data_daily_air_on_off = bitsValue(22, 1);
        var data_pending_join = bitsValue(24, 1);
        var data_nfc_status = bitsValue(25, 2);
        var data_datalog_new_measure = bitsValue(31, 6);
        var data_datalog_repetition = bitsValue(37, 5);
        var data_datalog_tx_period = bitsValue(42, 8);
        var data_d2d_network_id = bitsValue(50, 17);

        var data = headerOutput();
        data.reconfigurationSource = reconfigurationSource(data_config_source);
        data.reconfigurationStatus = reconfigurationState(data_config_status);
        data.enableDatalogTemperature = active(data_datalog_temperature_on_off);
        data.enableDailyAirQuality = active(data_daily_air_on_off);
        data.pendingJoin = pendingJoin(data_pending_join);
        data.enableNfcDiscover = nfcStatus(data_nfc_status);
        data.datalogNewValues = data_datalog_new_measure;
        data.datalogRepeatValues = data_datalog_repetition;
        data.periodDatalogTransmission = transmissionPeriodHistorical(data_datalog_tx_period);
        data.d2dNetworkId = data_d2d_network_id;

        // Downlink FCnt on bits 72-87, only when the frame carries it (11 bytes)
        if (stringHex.length >= 22) {
            data.downlinkFcnt = bitsValue(72, 16);
        }
        return data;
    }

    /* ------------------------------------------------------------------ */
    /* 0x02 - Alarm status                                                 */
    /* ------------------------------------------------------------------ */

    function alarmStatusDataOutput() {
        var data_smoke_alarm = bitsValue(16, 2);
        var data_smoke_hush = bitsValue(18, 2);
        var data_product_test = bitsValue(20, 2);
        var data_time_since_last_test = bitsValue(22, 8);
        var data_maintenance = bitsValue(30, 1);
        var data_time_since_last_maintenance = bitsValue(31, 8);
        var data_temperature = bitsValue(39, 10);

        var data = headerOutput();
        data.smokeAlarm = smokeAlarm(data_smoke_alarm);
        data.smokeAlarmHush = smokeAlarmHush(data_smoke_hush);
        data.productTest = productTest(data_product_test);
        data.timeSinceLastTest = weeks(data_time_since_last_test);
        data.isMaintenanceDone = trueFalse(data_maintenance);
        data.timeSinceLastMaintenance = weeks(data_time_since_last_maintenance);
        data.temperature = temperature(data_temperature);
        return data;
    }

    /* ------------------------------------------------------------------ */
    /* 0x03 - Daily air quality                                            */
    /* ------------------------------------------------------------------ */

    function dailyAirQualityDataOutput() {
        var data_temperature_min = bitsValue(16, 10);
        var data_temperature_max = bitsValue(26, 10);
        var data_temperature_avg = bitsValue(36, 10);
        var data_humidity_min = bitsValue(46, 8);
        var data_humidity_max = bitsValue(54, 8);
        var data_humidity_avg = bitsValue(62, 8);

        var data = headerOutput();
        data.temperatureMin = temperature(data_temperature_min);
        data.temperatureMax = temperature(data_temperature_max);
        data.temperatureAvg = temperature(data_temperature_avg);
        data.humidityMin = humidity(data_humidity_min);
        data.humidityMax = humidity(data_humidity_max);
        data.humidityAvg = humidity(data_humidity_avg);
        return data;
    }

    /* ------------------------------------------------------------------ */
    /* 0x04 - Periodic data (LoRaWAN only)                                 */
    /* ------------------------------------------------------------------ */

    function periodicDataOutput() {
        var data_temperature = bitsValue(16, 10);
        var data_humidity = bitsValue(26, 8);

        var data = headerOutput();
        data.temperature = temperature(data_temperature);
        data.humidity = humidity(data_humidity);
        return data;
    }

    /* ------------------------------------------------------------------ */
    /* 0x05 - Historical temperature data (LoRaWAN only)                   */
    /* Measures on 10 bits from bit 36, from the most recent to the oldest */
    /* ------------------------------------------------------------------ */

    function historicalTemperatureDataOutput() {
        var data_nombre_mesures = bitsValue(16, 6);
        var data_time_between_measurement = bitsValue(22, 8);
        var data_repetition = bitsValue(30, 6);
        var mesure = [];

        for (var i = 0; i < data_nombre_mesures; i++) {
            var offset_binaire = 36 + (10 * i);
            if ((offset_binaire + 10) > (stringHex.length * 4)) {
                warnings.push("Historical data truncated: " + i + " measures decoded, " + data_nombre_mesures + " announced");
                break;
            }
            mesure.push(historicalTemperature(bitsValue(offset_binaire, 10)));
        }

        var data = headerOutput();
        data.newMeasure = data_nombre_mesures;
        data.periodBetweenMeasure = { "value": data_time_between_measurement, "unit": "minutes" };
        data.redundancy = data_repetition;
        data.temperature = { "value": mesure, "unit": "°C" };
        return data;
    }

} // end of decoder

/* -------------------------------------------------------------------------
 * Legacy entry points (no errors/warnings channel: invalid input returns the errors object).
 * ---------------------------------------------------------------------- */

// ChirpStack v3
function Decode(fPort, bytes, variables) {
    var result = decodeUplink({ "bytes": bytes, "fPort": fPort });
    return result.data !== undefined ? result.data : { "errors": result.errors };
}

// The Things Network v2
function Decoder(bytes, port) {
    return Decode(port, bytes);
}

/* Optional export for Node.js / unit tests, ignored by LoRaWAN network servers */
if (typeof module !== "undefined" && module.exports) {
    module.exports = { decodeUplink: decodeUplink, Decode: Decode, Decoder: Decoder };
}
