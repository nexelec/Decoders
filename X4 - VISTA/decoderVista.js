/*
* Payload Decoder LoRa Alliance for VISTA SPACE (X410LS), VISTA FEEL (X420LS), VISTA MOVE (X430LS),
* VISTA WAVE (X440LS), VISTA RISE (X450LS)
* Copyright 2026 Nexelec
* Version : 1.0.0
*
* Reference : D1196A - Guide technique VISTA LoRaWAN (21/10/2026)
* Uplink / downlink port : 56
*
* Frame layout reminder :
*   byte 0        : product type (0xDA SPACE, 0xD7 FEEL, 0xD8 MOVE, 0xD9 WAVE, 0xDB RISE)
*   byte 1 [7..4] : message type   byte 1 [3..0] : message version
*   next bits     : payload, MSB first, fields are NOT byte aligned
*
* Output field names follow the FLOW and X2 decoders.
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
    * Reads a bit field.
    * offset : position of the first bit of the field in the frame (bit 0 = MSB of byte 0),
    *          as given in the "Décalage" column of the technical guide
    * size   : field length in bits (1 to 16)
    */
    function bitsValue(offset, size) {
        var firstNibble = Math.floor(offset / 4);
        var lastNibble = Math.floor((offset + size - 1) / 4);
        var shift = ((lastNibble + 1) * 4) - (offset + size);

        return (parseInt(stringHex.substring(firstNibble, lastNibble + 1), 16) >>> shift) & ((1 << size) - 1);
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
        if (octetTypeProduit == 0xDA) { return "VISTA SPACE" }
        if (octetTypeProduit == 0xD7) { return "VISTA FEEL" }
        if (octetTypeProduit == 0xD8) { return "VISTA MOVE" }
        if (octetTypeProduit == 0xD9) { return "VISTA WAVE" }
        if (octetTypeProduit == 0xDB) { return "VISTA RISE" }
        return "Reserved";
    }

    function typeOfMessage(octetTypeMessage) {
        var message_name = ["Reserved", "Periodic Data", "CO2 Historical Data", "Temperature Historical Data",
            "Humidity Historical Data", "Product Status", "Product Configuration", "Presence Alert"]
        return message_name[octetTypeMessage];
    }

    function headerOutput() {
        return {
            "typeOfProduct": typeOfProduct(octetTypeProduit),
            "typeOfMessage": typeOfMessage(octetTypeMessage),
            "versionOfMessage": octetVersionMessage
        };
    }

    /* ------------------------------------------------------------------ */
    /* Measurements                                                        */
    /* ------------------------------------------------------------------ */

    function temperature(octetTemperatureValue) {
        if (octetTemperatureValue >= 1023) { return "error" }
        if (octetTemperatureValue >= 1022) { return "deconnected sensor" }
        if (octetTemperatureValue >= 1021) { return "desactivated sensor" }
        else { return { "value": Math.round(((octetTemperatureValue / 10) - 30) * 10) / 10, "unit": "°C" } }
    }

    function humidity(octetHumidityValue) {
        if (octetHumidityValue >= 1023) { return "error" }
        if (octetHumidityValue >= 1022) { return "deconnected sensor" }
        if (octetHumidityValue >= 1021) { return "desactivated sensor" }
        else { return { "value": octetHumidityValue / 10, "unit": "%RH" } }
    }

    /* Periodic data: 14 bits, 1 ppm */
    function co2(octetCO2Value) {
        if (octetCO2Value >= 16383) { return "error" }
        if (octetCO2Value >= 16382) { return "deconnected sensor" }
        if (octetCO2Value >= 16381) { return "desactivated sensor" }
        if (octetCO2Value >= 16380) { return "end of life sensor" }
        else { return { "value": octetCO2Value, "unit": "ppm" } }
    }

    function luminosity(octetLuminosityValue) {
        if (octetLuminosityValue >= 1023) { return "error" }
        if (octetLuminosityValue >= 1022) { return "deconnected sensor" }
        if (octetLuminosityValue >= 1021) { return "desactivated sensor" }
        else { return { "value": (octetLuminosityValue * 5), "unit": "lux" } }
    }

    function activityIndex(octetActivityIndex) {
        if (octetActivityIndex >= 127) { return "error" }
        if (octetActivityIndex >= 126) { return "deconnected sensor" }
        if (octetActivityIndex >= 125) { return "desactivated sensor" }
        else { return { "value": octetActivityIndex, "unit": "%" } }
    }

    /* Periodic data flag: 0 = absence, 1 = presence */
    function presence(octetPresence) {
        var message_name = ["absent", "presence"]
        return message_name[octetPresence];
    }

    /* Presence alert: 0 = occupied, 1 = vacant (inverted compared with the periodic flag) */
    function presenceAlert(octetPresence) {
        var message_name = ["presence", "absent"]
        return message_name[octetPresence];
    }

    /* Historical data: 10 bits per measure, values without unit (the unit is given once for the array) */
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
        else { return Math.round(((octetTemperatureValue / 10) - 30) * 10) / 10 }
    }

    function historicalHumidity(octetHumidityValue) {
        if (octetHumidityValue >= 1023) { return "error" }
        if (octetHumidityValue >= 1022) { return "deconnected sensor" }
        if (octetHumidityValue >= 1021) { return "desactivated sensor" }
        else { return octetHumidityValue / 10 }
    }

    /* ------------------------------------------------------------------ */
    /* Status                                                              */
    /* ------------------------------------------------------------------ */

    function batteryVoltage(octetbatteryVoltage) {
        if (octetbatteryVoltage === 1023) { return "error" }
        else if (octetbatteryVoltage === 1022) { return "Reserved" }
        else { return { "value": (octetbatteryVoltage * 5), "unit": "mV" } }
    }

    function batterieLevelArgument(octetBatteryLevel) {
        var message_name = ["high", "medium", "low", "critical", "Reserved", "Reserved", "Reserved", "Reserved"]
        return message_name[octetBatteryLevel];
    }

    function productHwStatusArgument(octetProductHwStatus) {
        var message_name = ["ok", "error"]
        return message_name[octetProductHwStatus];
    }

    function productActivationTimeCounter(octetTimeCounter) {
        if (octetTimeCounter === 1023) { return "error" }
        else { return { "value": octetTimeCounter, "unit": "month" } }
    }

    /* 255 = error, also always sent by the products without CO2 sensor (SPACE, FEEL, MOVE) */
    function co2LastCalibrationTime(octetDays) {
        if (octetDays === 255) { return "error" }
        else { return { "value": octetDays, "unit": "days" } }
    }

    function antiTearArgument(octetAntiTear) {
        var message_name = ["not detected", "detected", "just removed from the base", "just installed on the base"]
        return message_name[octetAntiTear];
    }

    /* ------------------------------------------------------------------ */
    /* Configuration                                                       */
    /* ------------------------------------------------------------------ */

    function reconfigurationSource(octetReconfigurationSource) {
        if (octetReconfigurationSource == 0) { return "nfc" }
        if (octetReconfigurationSource == 1) { return "downlink" }
        if (octetReconfigurationSource == 2) { return "start up" }
        if (octetReconfigurationSource == 5) { return "periodic" }
        else { return "Reserved" }
    }

    function reconfigurationState(octetReconfigurationState) {
        var message_name = ["total success", "partial success", "total failure", "Reserved"]
        return message_name[octetReconfigurationState];
    }

    function protocolAndRegion(octetRegion) {
        if (octetRegion == 1) { return "LR-EU868" }
        else { return "Reserved" }
    }

    function active(octetActive) {
        var message_name = ["off", "on"]
        return message_name[octetActive];
    }

    function trueFalse(octetTrue) {
        var message_name = ["false", "true"]
        return message_name[octetTrue];
    }

    function period(octetPeriod) {
        return { "value": octetPeriod, "unit": "minutes" };
    }

    /* Datalog: 10 minutes step */
    function transmissionPeriodHistorical(octetPeriodHistorical) {
        if (octetPeriodHistorical === 255) { return "error" }
        else { return { "value": (octetPeriodHistorical * 10), "unit": "minutes" } }
    }

    /* 4 ppm step */
    function deltaCO2(octetDeltaCO2) {
        if (octetDeltaCO2 === 255) { return "desactivated" }
        else { return { "value": (octetDeltaCO2 * 4), "unit": "ppm" } }
    }

    /* 0.1 °C step */
    function deltaTemp(octetDeltaTemp) {
        if (octetDeltaTemp === 127) { return "desactivated" }
        else { return { "value": octetDeltaTemp / 10, "unit": "°C" } }
    }

    /* 5 ppm step */
    function co2Threshold(octetCO2Threshold) {
        return { "value": octetCO2Threshold * 5, "unit": "ppm" };
    }

    function pendingJoin(octetPending) {
        var message_name = ["no join programmed", "join programmed"]
        return message_name[octetPending];
    }

    function nfcStatus(octetNfcStatus) {
        var message_name = ["discoverable", "no discoverable", "Reserved", "Reserved"]
        return message_name[octetNfcStatus];
    }

    /* ------------------------------------------------------------------ */
    /* 0x1 - Periodic data                                                 */
    /* ------------------------------------------------------------------ */

    function periodicDataOutput() {
        var data = headerOutput();

        if (octetTypeProduit == 0xDA) {                                 // SPACE
            var data_luminosity = bitsValue(16, 10);
            var data_activity_index = bitsValue(27, 7);
            var data_presence = bitsValue(34, 1);

            data.luminosity = luminosity(data_luminosity);
            data.activityIndex = activityIndex(data_activity_index);
            data.presence = presence(data_presence);
        }
        else if (octetTypeProduit == 0xD7) {                            // FEEL
            var data_temperature = bitsValue(16, 10);
            var data_humidity = bitsValue(26, 10);

            data.temperature = temperature(data_temperature);
            data.humidity = humidity(data_humidity);
        }
        else if (octetTypeProduit == 0xD8) {                            // MOVE
            var data_temperature = bitsValue(16, 10);
            var data_humidity = bitsValue(26, 10);
            var data_luminosity = bitsValue(36, 10);
            var data_activity_index = bitsValue(47, 7);
            var data_presence = bitsValue(54, 1);

            data.temperature = temperature(data_temperature);
            data.humidity = humidity(data_humidity);
            data.luminosity = luminosity(data_luminosity);
            data.activityIndex = activityIndex(data_activity_index);
            data.presence = presence(data_presence);
        }
        else if (octetTypeProduit == 0xD9) {                            // WAVE
            var data_temperature = bitsValue(16, 10);
            var data_humidity = bitsValue(26, 10);
            var data_co2 = bitsValue(36, 14);
            var data_luminosity = bitsValue(50, 10);
            var data_activity_index = bitsValue(61, 7);
            var data_presence = bitsValue(68, 1);

            data.temperature = temperature(data_temperature);
            data.humidity = humidity(data_humidity);
            data.co2 = co2(data_co2);
            data.luminosity = luminosity(data_luminosity);
            data.activityIndex = activityIndex(data_activity_index);
            data.presence = presence(data_presence);
        }
        else if (octetTypeProduit == 0xDB) {                            // RISE
            var data_temperature = bitsValue(16, 10);
            var data_humidity = bitsValue(26, 10);
            var data_co2 = bitsValue(36, 14);

            data.temperature = temperature(data_temperature);
            data.humidity = humidity(data_humidity);
            data.co2 = co2(data_co2);
        }
        return data;
    }

    /* ------------------------------------------------------------------ */
    /* 0x2 / 0x3 / 0x4 - Historical data (FEEL, MOVE, WAVE, RISE)          */
    /* Measures on 10 bits from bit 36, from the most recent to the oldest */
    /* ------------------------------------------------------------------ */

    function historicalDataOutput(name, convert, unit) {
        var data_nombre_mesures = bitsValue(16, 6);
        var data_time_between_measurement = bitsValue(22, 8);
        var data_repetition = bitsValue(30, 6);
        var mesure = [];

        for (var i = 0; i < data_nombre_mesures; i++) {
            var offset_binaire = 36 + (10 * i);
            if ((offset_binaire + 10) > (stringHex.length * 4)) { break }
            mesure.push(convert(bitsValue(offset_binaire, 10)));
        }

        var data = headerOutput();
        data.newMeasure = data_nombre_mesures;
        data.periodBetweenMeasure = { "value": data_time_between_measurement * 10, "unit": "minutes" };
        data.redundancy = data_repetition;
        data[name] = { "value": mesure, "unit": unit };
        return data;
    }

    function historicalCO2DataOutput() {
        return historicalDataOutput("co2", historicalCO2, "ppm");
    }

    function historicalTemperatureDataOutput() {
        return historicalDataOutput("temperature", historicalTemperature, "°C");
    }

    function historicalHumidityDataOutput() {
        return historicalDataOutput("humidity", historicalHumidity, "%RH");
    }

    /* ------------------------------------------------------------------ */
    /* 0x5 - Product status (all products)                                 */
    /* ------------------------------------------------------------------ */

    function productStatusDataOutput() {
        var data_hw_version = bitsValue(16, 8);
        var data_sw_version = bitsValue(24, 8);
        var data_battery_voltage = bitsValue(32, 10);
        var data_battery_level = bitsValue(42, 3);
        var data_hw_status = bitsValue(45, 1);
        var data_activation_time = bitsValue(46, 10);
        var data_co2_last_manual_calibration_time = bitsValue(56, 8);
        var data_hw_status_anti_tear = bitsValue(64, 2);
        var data_bootloader_version = bitsValue(74, 8);

        var data = headerOutput();
        data.hardwareVersion = data_hw_version;
        data.softwareVersion = data_sw_version;
        data.batteryVoltage = batteryVoltage(data_battery_voltage);
        data.batteryLevel = batterieLevelArgument(data_battery_level);
        data.statusProduct = productHwStatusArgument(data_hw_status);
        data.timeActivation = productActivationTimeCounter(data_activation_time);
        data.timeCo2LastCalibration = co2LastCalibrationTime(data_co2_last_manual_calibration_time);
        data.statusAntiTear = antiTearArgument(data_hw_status_anti_tear);
        data.bootloaderVersion = data_bootloader_version;
        return data;
    }

    /* ------------------------------------------------------------------ */
    /* 0x6 - Product configuration (layout depends on the product)        */
    /* ------------------------------------------------------------------ */

    function productConfigurationDataOutput() {
        if (octetTypeProduit == 0xDA) { return spaceConfigurationDataOutput() }
        if (octetTypeProduit == 0xD7) { return feelConfigurationDataOutput() }
        if (octetTypeProduit == 0xD8) { return moveConfigurationDataOutput() }
        if (octetTypeProduit == 0xD9) { return waveConfigurationDataOutput() }
        if (octetTypeProduit == 0xDB) { return riseConfigurationDataOutput() }
        return headerOutput();
    }

    function spaceConfigurationDataOutput() {
        var data_config_source = bitsValue(16, 3);
        var data_config_status = bitsValue(19, 2);
        var data_sensor_on_off_pir = bitsValue(21, 1);
        var data_lora_region = bitsValue(23, 4);
        var data_periodic_tx_on_off = bitsValue(27, 1);
        var data_periodic_tx_period = bitsValue(28, 6);
        var data_pending_join = bitsValue(34, 1);
        var data_nfc_status = bitsValue(35, 2);
        var data_downlink_fcnt = bitsValue(37, 16);
        var data_presence_alerte_on_off = bitsValue(53, 1);
        var data_period_without_presence_alerte = bitsValue(54, 6);
        var data_enable_fuota = bitsValue(60, 1);
        var data_fuota_pending = bitsValue(61, 1);

        var data = headerOutput();
        data.reconfigurationSource = reconfigurationSource(data_config_source);
        data.reconfigurationStatus = reconfigurationState(data_config_status);
        data.enableMotion = active(data_sensor_on_off_pir);
        data.protocolAndRegion = protocolAndRegion(data_lora_region);
        data.enablePeriodicData = active(data_periodic_tx_on_off);
        data.periodPeriodicTransmission = period(data_periodic_tx_period);
        data.pendingJoin = pendingJoin(data_pending_join);
        data.enableNfcDiscover = nfcStatus(data_nfc_status);
        data.downlinkFcnt = data_downlink_fcnt;
        data.enableRoomPresence = active(data_presence_alerte_on_off);
        data.periodWithoutMotion = period(data_period_without_presence_alerte);
        data.enableFuota = active(data_enable_fuota);
        data.isFuotaPending = trueFalse(data_fuota_pending);
        return data;
    }

    function feelConfigurationDataOutput() {
        var data_config_source = bitsValue(16, 3);
        var data_config_status = bitsValue(19, 2);
        var data_lora_region = bitsValue(22, 4);
        var data_periodic_tx_on_off = bitsValue(26, 1);
        var data_periodic_tx_period = bitsValue(27, 6);
        var data_periodic_delta_temp = bitsValue(33, 7);
        var data_datalog_temperature_on_off = bitsValue(40, 1);
        var data_datalog_new_measure = bitsValue(41, 6);
        var data_datalog_repetition = bitsValue(47, 5);
        var data_datalog_tx_period = bitsValue(52, 8);
        var data_pending_join = bitsValue(60, 1);
        var data_nfc_status = bitsValue(61, 2);
        var data_datalog_humidity_on_off = bitsValue(63, 1);
        var data_downlink_fcnt = bitsValue(64, 16);
        var data_enable_fuota = bitsValue(80, 1);
        var data_fuota_pending = bitsValue(81, 1);

        var data = headerOutput();
        data.reconfigurationSource = reconfigurationSource(data_config_source);
        data.reconfigurationStatus = reconfigurationState(data_config_status);
        data.protocolAndRegion = protocolAndRegion(data_lora_region);
        data.enablePeriodicData = active(data_periodic_tx_on_off);
        data.periodPeriodicTransmission = period(data_periodic_tx_period);
        data.deltaTemperature = deltaTemp(data_periodic_delta_temp);
        data.enableDatalogTemperature = active(data_datalog_temperature_on_off);
        data.enableDatalogHumidity = active(data_datalog_humidity_on_off);
        data.datalogNewValues = data_datalog_new_measure;
        data.datalogRepeatValues = data_datalog_repetition;
        data.periodDatalogTransmission = transmissionPeriodHistorical(data_datalog_tx_period);
        data.pendingJoin = pendingJoin(data_pending_join);
        data.enableNfcDiscover = nfcStatus(data_nfc_status);
        data.downlinkFcnt = data_downlink_fcnt;
        data.enableFuota = active(data_enable_fuota);
        data.isFuotaPending = trueFalse(data_fuota_pending);
        return data;
    }

    function moveConfigurationDataOutput() {
        var data_config_source = bitsValue(16, 3);
        var data_config_status = bitsValue(19, 2);
        var data_sensor_on_off_pir = bitsValue(21, 1);
        var data_lora_region = bitsValue(23, 4);
        var data_periodic_tx_on_off = bitsValue(27, 1);
        var data_periodic_tx_period = bitsValue(28, 6);
        var data_periodic_delta_temp = bitsValue(34, 7);
        var data_datalog_temperature_on_off = bitsValue(41, 1);
        var data_datalog_new_measure = bitsValue(42, 6);
        var data_datalog_repetition = bitsValue(48, 5);
        var data_datalog_tx_period = bitsValue(53, 8);
        var data_pending_join = bitsValue(61, 1);
        var data_nfc_status = bitsValue(62, 2);
        var data_datalog_humidity_on_off = bitsValue(64, 1);
        var data_downlink_fcnt = bitsValue(65, 16);
        var data_presence_alerte_on_off = bitsValue(81, 1);
        var data_period_without_presence_alerte = bitsValue(82, 6);
        var data_enable_fuota = bitsValue(88, 1);
        var data_fuota_pending = bitsValue(89, 1);

        var data = headerOutput();
        data.reconfigurationSource = reconfigurationSource(data_config_source);
        data.reconfigurationStatus = reconfigurationState(data_config_status);
        data.enableMotion = active(data_sensor_on_off_pir);
        data.protocolAndRegion = protocolAndRegion(data_lora_region);
        data.enablePeriodicData = active(data_periodic_tx_on_off);
        data.periodPeriodicTransmission = period(data_periodic_tx_period);
        data.deltaTemperature = deltaTemp(data_periodic_delta_temp);
        data.enableDatalogTemperature = active(data_datalog_temperature_on_off);
        data.enableDatalogHumidity = active(data_datalog_humidity_on_off);
        data.datalogNewValues = data_datalog_new_measure;
        data.datalogRepeatValues = data_datalog_repetition;
        data.periodDatalogTransmission = transmissionPeriodHistorical(data_datalog_tx_period);
        data.pendingJoin = pendingJoin(data_pending_join);
        data.enableNfcDiscover = nfcStatus(data_nfc_status);
        data.downlinkFcnt = data_downlink_fcnt;
        data.enableRoomPresence = active(data_presence_alerte_on_off);
        data.periodWithoutMotion = period(data_period_without_presence_alerte);
        data.enableFuota = active(data_enable_fuota);
        data.isFuotaPending = trueFalse(data_fuota_pending);
        return data;
    }

    function waveConfigurationDataOutput() {
        var data_config_source = bitsValue(16, 3);
        var data_config_status = bitsValue(19, 2);
        var data_sensor_on_off_co2 = bitsValue(21, 1);
        var data_sensor_on_off_pir = bitsValue(22, 1);
        var data_co2_auto_calibration = bitsValue(23, 1);
        var data_co2_medium_level = bitsValue(24, 10);
        var data_co2_high_level = bitsValue(34, 10);
        var data_led_on_off = bitsValue(44, 1);
        var data_led_orange_on_off = bitsValue(45, 1);
        var data_lora_region = bitsValue(47, 4);
        var data_periodic_tx_on_off = bitsValue(51, 1);
        var data_periodic_tx_period = bitsValue(52, 6);
        var data_periodic_delta_co2 = bitsValue(58, 8);
        var data_periodic_delta_temp = bitsValue(66, 7);
        var data_datalog_co2_on_off = bitsValue(73, 1);
        var data_datalog_temperature_on_off = bitsValue(74, 1);
        var data_datalog_new_measure = bitsValue(75, 6);
        var data_datalog_repetition = bitsValue(81, 5);
        var data_datalog_tx_period = bitsValue(86, 8);
        var data_pending_join = bitsValue(94, 1);
        var data_nfc_status = bitsValue(95, 2);
        var data_datalog_humidity_on_off = bitsValue(97, 1);
        var data_downlink_fcnt = bitsValue(98, 16);
        var data_presence_alerte_on_off = bitsValue(114, 1);
        var data_period_without_presence_alerte = bitsValue(115, 6);
        var data_enable_fuota = bitsValue(121, 1);
        var data_fuota_pending = bitsValue(122, 1);

        var data = headerOutput();
        data.reconfigurationSource = reconfigurationSource(data_config_source);
        data.reconfigurationStatus = reconfigurationState(data_config_status);
        data.enableCo2 = active(data_sensor_on_off_co2);
        data.enableMotion = active(data_sensor_on_off_pir);
        data.enableAutomaticCo2Calibration = active(data_co2_auto_calibration);
        data.thresholdCo2Medium = co2Threshold(data_co2_medium_level);
        data.thresholdCo2High = co2Threshold(data_co2_high_level);
        data.enableLedCo2 = active(data_led_on_off);
        data.enableLedMediumLevel = active(data_led_orange_on_off);
        data.protocolAndRegion = protocolAndRegion(data_lora_region);
        data.enablePeriodicData = active(data_periodic_tx_on_off);
        data.periodPeriodicTransmission = period(data_periodic_tx_period);
        data.deltaCo2 = deltaCO2(data_periodic_delta_co2);
        data.deltaTemperature = deltaTemp(data_periodic_delta_temp);
        data.enableDatalogCo2 = active(data_datalog_co2_on_off);
        data.enableDatalogTemperature = active(data_datalog_temperature_on_off);
        data.enableDatalogHumidity = active(data_datalog_humidity_on_off);
        data.datalogNewValues = data_datalog_new_measure;
        data.datalogRepeatValues = data_datalog_repetition;
        data.periodDatalogTransmission = transmissionPeriodHistorical(data_datalog_tx_period);
        data.pendingJoin = pendingJoin(data_pending_join);
        data.enableNfcDiscover = nfcStatus(data_nfc_status);
        data.downlinkFcnt = data_downlink_fcnt;
        data.enableRoomPresence = active(data_presence_alerte_on_off);
        data.periodWithoutMotion = period(data_period_without_presence_alerte);
        data.enableFuota = active(data_enable_fuota);
        data.isFuotaPending = trueFalse(data_fuota_pending);
        return data;
    }

    function riseConfigurationDataOutput() {
        var data_config_source = bitsValue(16, 3);
        var data_config_status = bitsValue(19, 2);
        var data_sensor_on_off_co2 = bitsValue(21, 1);
        var data_co2_auto_calibration = bitsValue(22, 1);
        var data_co2_medium_level = bitsValue(23, 10);
        var data_co2_high_level = bitsValue(33, 10);
        var data_led_on_off = bitsValue(43, 1);
        var data_led_orange_on_off = bitsValue(44, 1);
        var data_lora_region = bitsValue(46, 4);
        var data_periodic_tx_on_off = bitsValue(50, 1);
        var data_periodic_tx_period = bitsValue(51, 6);
        var data_periodic_delta_co2 = bitsValue(57, 8);
        var data_periodic_delta_temp = bitsValue(65, 7);
        var data_datalog_co2_on_off = bitsValue(72, 1);
        var data_datalog_temperature_on_off = bitsValue(73, 1);
        var data_datalog_new_measure = bitsValue(74, 6);
        var data_datalog_repetition = bitsValue(80, 5);
        var data_datalog_tx_period = bitsValue(85, 8);
        var data_pending_join = bitsValue(93, 1);
        var data_nfc_status = bitsValue(94, 2);
        var data_datalog_humidity_on_off = bitsValue(96, 1);
        var data_downlink_fcnt = bitsValue(97, 16);
        var data_enable_fuota = bitsValue(113, 1);
        var data_fuota_pending = bitsValue(114, 1);

        var data = headerOutput();
        data.reconfigurationSource = reconfigurationSource(data_config_source);
        data.reconfigurationStatus = reconfigurationState(data_config_status);
        data.enableCo2 = active(data_sensor_on_off_co2);
        data.enableAutomaticCo2Calibration = active(data_co2_auto_calibration);
        data.thresholdCo2Medium = co2Threshold(data_co2_medium_level);
        data.thresholdCo2High = co2Threshold(data_co2_high_level);
        data.enableLedCo2 = active(data_led_on_off);
        data.enableLedMediumLevel = active(data_led_orange_on_off);
        data.protocolAndRegion = protocolAndRegion(data_lora_region);
        data.enablePeriodicData = active(data_periodic_tx_on_off);
        data.periodPeriodicTransmission = period(data_periodic_tx_period);
        data.deltaCo2 = deltaCO2(data_periodic_delta_co2);
        data.deltaTemperature = deltaTemp(data_periodic_delta_temp);
        data.enableDatalogCo2 = active(data_datalog_co2_on_off);
        data.enableDatalogTemperature = active(data_datalog_temperature_on_off);
        data.enableDatalogHumidity = active(data_datalog_humidity_on_off);
        data.datalogNewValues = data_datalog_new_measure;
        data.datalogRepeatValues = data_datalog_repetition;
        data.periodDatalogTransmission = transmissionPeriodHistorical(data_datalog_tx_period);
        data.pendingJoin = pendingJoin(data_pending_join);
        data.enableNfcDiscover = nfcStatus(data_nfc_status);
        data.downlinkFcnt = data_downlink_fcnt;
        data.enableFuota = active(data_enable_fuota);
        data.isFuotaPending = trueFalse(data_fuota_pending);
        return data;
    }

    /* ------------------------------------------------------------------ */
    /* 0x7 - Presence / absence alert (SPACE, MOVE, WAVE)                  */
    /* ------------------------------------------------------------------ */

    function presenceAlertDataOutput() {
        var data_presence = bitsValue(16, 1);

        var data = headerOutput();
        data.presence = presenceAlert(data_presence);
        return data;
    }

} // end of decoder

/* Optional export for Node.js / unit tests, ignored by LoRaWAN network servers */
if (typeof module !== "undefined" && module.exports) { module.exports = { decodeUplink: decodeUplink }; }
