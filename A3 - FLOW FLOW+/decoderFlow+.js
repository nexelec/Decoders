/* 
* Payload Decoder LoRa Alliance for FLOW(A300LS) & FLOW+(A310LS)
* Copyright 2026 Nexelec
* Version : 1.0.1
*/

function decodeUplink(input) {

    var stringHex = bytesString(input.bytes);

    var octetTypeProduit = parseInt(stringHex.substring(0, 2), 16);
    var octetTypeMessage = parseInt(stringHex.substring(2, 3), 16);
    var octetVersionMessage = parseInt(stringHex.substring(3, 4), 16);

    var data = dataOutput(octetTypeMessage)
    return { data }

    function bytesString(input) {
        var bufferString = '';
        var decToString = '';

        for (var i = 0; i < input.length; i++) {
            decToString = input[i].toString(16).padStart(2, '0')
            bufferString = bufferString.concat(decToString)

        }
        return bufferString;
    }


    function dataOutput(octetTypeMessage) {
        var outputTypeMessage = ["Reserved", periodicOutput(stringHex), productStatusOutput(stringHex), externalProbeStatusOutput(stringHex), productConfigurationOutput(stringHex), dailyProfil1Output(stringHex), dailyProfil2Output(stringHex),dailyProfil3Output(stringHex)]
        return outputTypeMessage[octetTypeMessage]
    }

    function typeOfProduct(octetTypeProduit) {
        if (octetTypeProduit == 0xD2) { return "FLOW" }
        if (octetTypeProduit == 0xD6) { return "FLOW+" }
    }

    function typeOfMessage(octetTypeMessage) {
        var message_name = ["Reserved", "Periodic", "Product Status", "External Probe Status","Product Configuration" ,"Daily profil n°1", "Daily profil n°2","Daily profil n°3"]

        return message_name[octetTypeMessage]
    }

    function onOff(octeton) {
        data = ["off", "on"];
        return data[octeton];
    }

    function okError(octetok) {
        data = ["ok", "error"];
        return data[octetok];
    }

    function trueFalse(octetTrue) {
        data = ["false", "true"];
        return data[octetTrue];
    }

    function period(octetPeriod) {
        return { "value": parseFloat(octetPeriod), "unit": "min" }
    }

    function distance_µm(octetdistance)
    {
        return { "value": octetdistance, "unit": "µm" }
    }

    function percentage(octetpercentage)
    {
        return { "value": octetpercentage, "unit": "%" }
    }

    function month(octetmonth)
    {
        if (octetmonth == 1023) { return "error" }
        else { return {"value": octetmonth, "unit": "month"}}
    }

    function fctSourceReconfiguration(octetReconfigurationSource) {
        if (octetReconfigurationSource == 0) { return "nfc" }
        if (octetReconfigurationSource == 1) { return "downlink" }
        if (octetReconfigurationSource == 2) { return "start-up" }
        if (octetReconfigurationSource == 5) { return "local" }
        else { return "Reserved" }
    }

    function fctStatusReconfiguration(octetReconfigurationState) {
        if (octetReconfigurationState == 0) { return "total success" }
        if (octetReconfigurationState == 1) { return "partial success" }
        if (octetReconfigurationState == 2) { return "total failure" }
        else { return "Reserved" }
    }

    function temperature(octetTemperatureValue)
    {
        if(octetTemperatureValue>=1023){return "Error"}
        else{return {"value":((octetTemperatureValue/10)-30), "unit":"°C" }}
    }

    function regulationTemperature(octetTemperatureValue)
    {
        if(octetTemperatureValue>=62){return "Error"}
        else{return {"value":octetTemperatureValue*0.5, "unit":"°C" }}
    }

    function sourceRegulationTemperature(octetSource)
    {
        if (octetSource == 0) { return "internal" }
        if (octetSource == 1) { return "external node" }
        if (octetSource == 2) { return "external lorawan" }
    }

    function sourceTemperatureSetPointChange(octetSource)
    {
        if (octetSource == 0) { return "none" }
        if (octetSource == 1) { return "planning" }
        if (octetSource == 2) { return "startup" }
        if (octetSource == 3) { return "local network" }
        if (octetSource == 4) { return "button" }
    }
    
    function statusMotorCalibration(octetSource)
    {
        if (octetSource == 0) { return "calibration done" }
        if (octetSource == 1) { return "calibration failure" }
        if (octetSource == 2) { return "calibration not done, product not on the base" }
        if (octetSource == 3) { return "calibration erase, product remove from the base" }
    }

    function motorDistance(octetMotor)
    {
        if(octetMotor>=8191){return "Error"}
        return {"value":octetMotor, "unit":"µm" }
    }

    function batteryVoltage(octetbatteryVoltage)
    {
        if(octetbatteryVoltage===1023){return "Error"}
        else if(octetbatteryVoltage === 1021){return "No batteries"}
        else{return {"value":(octetbatteryVoltage*5), "unit":"mV" }}
    }

     function batteryLevel(octetbatteryLevel)
    {
        if (octetbatteryLevel == 0) { return "High" }
        if (octetbatteryLevel == 1) { return "Medium" }
        if (octetbatteryLevel == 2) { return "Low" }
        if (octetbatteryLevel == 3) { return "Critical" }
    }

    function antiTearStatus(octetAntiTear)
    {
        if (octetAntiTear == 0) { return "not detected" }
        if (octetAntiTear == 1) { return "detected" }
        if (octetAntiTear == 2) { return "just removed from the base" }
        if (octetAntiTear == 3) { return "just placed on the base" }
    }

    function networkLevel(octetNetwork)
    {
        return {"value":octetNetwork, "unit":"dBm" }
    }

    function temperatureRegulation(octetTemp)
    {
        if(octetTemp===63){return "Error"}
         else{return {"value":(octetTemp*0.5), "unit":"°C" }}
    }

     function temperatureDrop(octetTemp)
    {
        return {"value":(octetTemp*0.1), "unit":"°C/min" }
    }

      function temperatureOffset(octetTemp)
    {
        return {"value":((octetTemp*0.1)-5), "unit":"°C" }
    }

      function protocolAndRegion(octetRegion)
    {
       if (octetRegion == 1) { return "LR-EU868" } 
    }

      function timeZone(octetTime)
    {
        var message_name = [
            "UTC -12", "UTC -11", "UTC -10", "UTC -9", "UTC -8", "UTC -7", "UTC -6",
            "UTC -5", "UTC -4", "UTC -3", "UTC -2", "UTC -1", "UTC", "UTC +1",
            "UTC +2", "UTC +3", "UTC +4", "UTC +5", "UTC +6", "UTC +7", "UTC +8",
            "UTC +9", "UTC +10", "UTC +11", "UTC +12", "UTC +13", "UTC +14"
          ]
        return message_name[octetTime]
    }
    
    function decodeWeeklySchedule(decimalValue) 
    {
        var days = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday"
        ];

        var profiles = {
            0: "Profil 1",
            1: "Profil 2",
            2: "Profil 3"
        };

        var result = {};

        for (let i = 0; i < days.length; i++) {
            const shift = 14 - (i * 2);
            const rawValue = (decimalValue >> shift) & 0b11;

            result[days[i]] = profiles[rawValue] !== undefined
            ?  profiles[rawValue]
            : "Valeur invalide";
        }

        return result;
    }

    function temperatureSlotProfile(octetTemperatureProfile)
    {
        if (octetTemperatureProfile == 0) { return "Frost protect temperature" }
        if (octetTemperatureProfile == 1) { return "Confort temperature" }
        if (octetTemperatureProfile == 2) { return "Eco temperature" }
        if (octetTemperatureProfile == 3) { return "Absent temperature" }
    }

    function periodicOutput(stringHex) {

        var data_temperature = (parseInt(stringHex.substring(4, 7), 16) >> 2) & 0x3FF;
        var data_regulation_temperature = (parseInt(stringHex.substring(6, 8), 16)) & 0x3F;
        var data_source_regulation_temperature = (parseInt(stringHex.substring(8, 9), 16)>>2) & 0x3;
        var data_internal_temperature = (parseInt(stringHex.substring(8, 11), 16)) & 0x3FF;
        var data_source_temperature_set_point_change = (parseInt(stringHex.substring(11, 12), 16)>>1) & 0x7;
        var data_open_window_detection = (parseInt(stringHex.substring(11, 12), 16)) & 0x1;
        var data_anti_freeze = (parseInt(stringHex.substring(12, 13), 16)>>3) & 0x1;
        var data_motor_position = (parseInt(stringHex.substring(12, 16), 16)>>2) & 0x1FFF;
        var data_valve_opening_percentage = (parseInt(stringHex.substring(15, 18), 16)>>3) & 0x7F;

        let data = {
            "typeOfProduct": typeOfProduct(octetTypeProduit),
            "typeOfMessage": typeOfMessage(octetTypeMessage),
            "versionOfMessage" : octetVersionMessage,
            "temperature" : temperature(data_temperature),
            "regulationTemperature" : regulationTemperature(data_regulation_temperature),
            "sourceRegulationTemperature" : sourceRegulationTemperature(data_source_regulation_temperature),
            "internalTemperature" : temperature(data_internal_temperature),
            "sourceTemperatureSetPointChange" : sourceTemperatureSetPointChange(data_source_temperature_set_point_change),
            "isWindowOpenActive" : trueFalse(data_open_window_detection),
            "isFrostProtectActive" : trueFalse(data_anti_freeze),
            "motorDistance" : motorDistance(data_motor_position),
            "valveOpeningPercentage" : percentage(data_valve_opening_percentage)
        };
        return data;
    }

    function productStatusOutput(stringHex) {
        var data_hardware_version = (parseInt(stringHex.substring(4, 6), 16));
        var data_software_version = (parseInt(stringHex.substring(6, 8), 16));
        var data_battery_voltage1 = (parseInt(stringHex.substring(8, 11), 16)>>2) & 0x3FF;
        var data_battery_voltage2 = (parseInt(stringHex.substring(10, 13), 16)) & 0x3FF;
        var data_battery_level = (parseInt(stringHex.substring(13, 14), 16)>>2) & 0x3;
        var data_product_status = (parseInt(stringHex.substring(13, 14), 16)>>1) & 0x1;
        var data_anti_tear = (parseInt(stringHex.substring(13, 15), 16)>>3) & 0x3;
        var data_motor_calibration_status = (parseInt(stringHex.substring(14, 15), 16)) & 0x7;
        var data_motor_stroke_distance = (parseInt(stringHex.substring(15, 19), 16)>>3) & 0x1FFF;
        var data_activation_time = (parseInt(stringHex.substring(18, 21), 16)>>1) & 0x3FF;
        var data_date_of_product = (parseInt(stringHex.substring(20, 27), 16)>>1) & 0xFFFFFF;
        var data_interco_with_node = (parseInt(stringHex.substring(26, 27), 16)) & 0x1;

        let data = {
            "typeOfProduct": typeOfProduct(octetTypeProduit),
            "typeOfMessage": typeOfMessage(octetTypeMessage),
            "versionOfMessage" : octetVersionMessage,
            "hardwareVersion": data_hardware_version,
            "softwareVersion": data_software_version,
            "batteryVoltageSlot1": batteryVoltage(data_battery_voltage1),
            "batteryVoltageSlot2": batteryVoltage(data_battery_voltage2),
            "batteryLevel":batteryLevel(data_battery_level),
            "statusProduct": okError(data_product_status),
            "statusAntiTear": antiTearStatus(data_anti_tear),
            "statusMotorCalibration": statusMotorCalibration(data_motor_calibration_status),
            "motorStrokeDistance": distance_µm(data_motor_stroke_distance),
            "timeActivation":month(data_activation_time),
            "productDate" : data_date_of_product,
            "isD2Dactive": trueFalse(data_interco_with_node)
        };
        return data;
    }

    function externalProbeStatusOutput(stringHex) {
        var data_d2d_id = (parseInt(stringHex.substring(4, 10), 16)) & 0xFFFFFF;
        var data_status_external_product = (parseInt(stringHex.substring(10, 11), 16)>>3) & 0x1;
        var data_anti_tear = (parseInt(stringHex.substring(10, 11), 16)>>1) & 0x3;
        var data_status_temperature = (parseInt(stringHex.substring(10, 11), 16)) & 0x1;
        var data_batterie_level= (parseInt(stringHex.substring(11, 12), 16)>>2) & 0x3;
        var data_batterie_voltage =(parseInt(stringHex.substring(11, 14), 16)) & 0x3FF;
        var data_node_message_received =(parseInt(stringHex.substring(14, 16), 16)) & 0xFF
        var data_node_network_level = (parseInt(stringHex.substring(16, 18), 16)) & 0xFF

        let data = {
            "typeOfProduct": typeOfProduct(octetTypeProduit),
            "typeOfMessage": typeOfMessage(octetTypeMessage),
            "versionOfMessage" : octetVersionMessage,
            "euiExternalProbe" : data_d2d_id,
            "statusExternalc" : okError(data_status_external_product),
            "statusExternalProbeAntiTear" : antiTearStatus(data_anti_tear),
            "statusExternalProbeTemperature" : okError(data_status_temperature),
            "statusExternalProbeBatteryLevel" : batteryLevel(data_batterie_level),
            "statusExternalProbeBatteryVoltage" : batteryVoltage(data_batterie_voltage),
            "ExternalProbeMessageReceived": data_node_message_received,
            "ExternalProbeNetworkLevel" : networkLevel(data_node_network_level)
        };
        return data;
    }

    function productConfigurationOutput(stringHex) {
        var data_source_reconfig = (parseInt(stringHex.substring(4, 5), 16)>>1)&0x7;
        var data_status_reconfig = (parseInt(stringHex.substring(4, 6), 16)>>3)&0x3;
        var data_period_Periodic_Transmission_regulation_on = (parseInt(stringHex.substring(5, 6), 16))&0x7;
        var data_period_Periodic_Transmission_regulation_off = (parseInt(stringHex.substring(6, 8), 16))&0xFF;
        var data_child_lock = (parseInt(stringHex.substring(8, 9), 16)>>3)&0x1;
        var data_child_lock_without_connection = (parseInt(stringHex.substring(8, 9), 16)>>2)&0x1;
        var data_general_regulation = (parseInt(stringHex.substring(8, 9), 16)>>1)&0x1;
        var data_regulation_minimal_temp = (parseInt(stringHex.substring(8, 11), 16)>>3)& 0x3F;
        var data_regulation_maximal_temp = (parseInt(stringHex.substring(10, 12), 16)>>1)& 0x3F;
        var data_anti_freeze = (parseInt(stringHex.substring(11, 12), 16))& 0x1;
        var data_anti_freeze_temperature_threshold = (parseInt(stringHex.substring(12, 14), 16)>>2)& 0x3F;
        var data_open_window_detection=(parseInt(stringHex.substring(13, 14), 16)>>1)& 0x1;
        var data_open_window_temperature_drop = (parseInt(stringHex.substring(13, 15), 16))& 0x1F;
        var data_open_window_pause_duration=(parseInt(stringHex.substring(15, 17), 16)>>2)& 0x3F;
        var data_internal_temperature_offset = (parseInt(stringHex.substring(16, 19), 16)>>3)& 0x7F;
        var data_temperature_confort_mode = (parseInt(stringHex.substring(18, 20), 16)>>1)& 0x3F;
        var data_temperature_eco_mode = (parseInt(stringHex.substring(19, 22), 16)>>3)& 0x3F;
        var data_temperature_absent_mode = (parseInt(stringHex.substring(21, 23), 16)>>1)& 0x3F;
        var data_low_battery_valve_opening_percent = (parseInt(stringHex.substring(21, 23), 16)>>1)& 0x7F;
        var data_protocol_and_region = (parseInt(stringHex.substring(24, 26), 16)>>2)& 0xF;
        var data_time_zone = (parseInt(stringHex.substring(25, 27), 16)>>1)& 0x1F;
        var data_join_scheduled = (parseInt(stringHex.substring(26, 27), 16))& 0x1;
        var data_nfc_status = (parseInt(stringHex.substring(27, 28), 16)>>2)& 0x1F;
        var data_kp = (parseInt(stringHex.substring(27, 30), 16)>>3)& 0x7F;
        var data_ki = (parseInt(stringHex.substring(29, 31), 16)>>3)& 0x7F;
        var data_heating_period = (parseInt(stringHex.substring(31, 32), 16)>>3)& 0x1;
        var data_heating_start_month = (parseInt(stringHex.substring(31, 33), 16)>>3)& 0xF;
        var data_heating_start_day = (parseInt(stringHex.substring(32, 34), 16)>>2)& 0x1F;
        var data_heating_end_month = (parseInt(stringHex.substring(33, 35), 16)>>2)& 0xF;
        var data_heating_end_day = (parseInt(stringHex.substring(34, 36), 16)>>1)& 0x1F;
        var data_planning = (parseInt(stringHex.substring(35, 36), 16))& 0x01; 
        var data_daily_planning = (parseInt(stringHex.substring(36, 40), 16)>>1)& 0xFFFF;
        var data_downling_counter = (parseInt(stringHex.substring(40, 44), 16)>>1)& 0xFFFF;

        
        let data = {
            "typeOfProduct": typeOfProduct(octetTypeProduit),
            "typeOfMessage": typeOfMessage(octetTypeMessage),
            "versionOfMessage" : octetVersionMessage,
            "sourceReconfiguration": fctSourceReconfiguration(data_source_reconfig),
            "statusReconfiguration": fctStatusReconfiguration(data_status_reconfig),
            "periodPeriodicTransmissionRegulationOn" : period(data_period_Periodic_Transmission_regulation_on),
            "periodPeriodicTransmissionRegulationOff" : period(data_period_Periodic_Transmission_regulation_off),
            "enableChildLock":onOff(data_child_lock),
            "childLockOfflineBehavior":onOff(data_child_lock_without_connection),
            "enableRegulation":onOff(data_general_regulation),
            "minimumRegulationTemperature":temperatureRegulation(data_regulation_minimal_temp),
            "maximumRegulationTemperature":temperatureRegulation(data_regulation_maximal_temp),
            "enableFrostProtect":onOff(data_anti_freeze),
            "frostProtectActivationThreshold":temperatureRegulation(data_anti_freeze_temperature_threshold),
            "enableOpenWindowDetection":onOff(data_open_window_detection),
            "openWindowDetectionTemperatureDrop":temperatureDrop(data_open_window_temperature_drop),
            "openWindowDetectionPauseDuration" : data_open_window_pause_duration,
            "temperatureInternalOffset":temperatureOffset(data_internal_temperature_offset),
            "temperatureModeConfort": temperatureRegulation(data_temperature_confort_mode),
            "temperatureModeEco": temperatureRegulation(data_temperature_eco_mode),
            "temperatureModeAbsent": temperatureRegulation(data_temperature_absent_mode),
            "lowBatteryValveOpeningPercent" : percentage(data_low_battery_valve_opening_percent),
            "protocolAndRegion": protocolAndRegion(data_protocol_and_region),
            "timeZone": timeZone(data_time_zone),
            "isJoinPending": trueFalse(data_join_scheduled),
            "enableNfcDiscover" : onOff(data_nfc_status),
            "kp":data_kp,
            "ki":data_ki,
            "enableHeatingPeriod":onOff(data_heating_period),
            "heatingStartMonth": data_heating_start_month,
            "heatingStartDay": data_heating_start_day,
            "heatingEndMonth": data_heating_end_month,
            "heatingEndDay":data_heating_end_day,
            "enablePlanningMode":onOff(data_planning),
            "dailyPlanning":decodeWeeklySchedule(data_daily_planning),
            "downlinkFcnt":data_downling_counter,

        };
        return data;
    }

    function dailyProfil1Output(stringHex) {

        var data_source_reconfig = (parseInt(stringHex.substring(4, 5), 16)>>1)&0x7;
        var data_status_reconfig = (parseInt(stringHex.substring(4, 6), 16)>>3)&0x3;

        var data_slot_00h00_00h30 = (parseInt(stringHex.substring(5, 6), 16) >> 1) & 0x3;
        var data_slot_00h30_01h00 = (parseInt(stringHex.substring(5, 7), 16) >> 3) & 0x3;
        var data_slot_01h00_01h30 = (parseInt(stringHex.substring(6, 7), 16) >> 1) & 0x3;
        var data_slot_01h30_02h00 = (parseInt(stringHex.substring(6, 8), 16) >> 3) & 0x3;

        var data_slot_02h00_02h30 = (parseInt(stringHex.substring(7, 8), 16) >> 1) & 0x3;
        var data_slot_02h30_03h00 = (parseInt(stringHex.substring(7, 9), 16) >> 3) & 0x3;
        var data_slot_03h00_03h30 = (parseInt(stringHex.substring(8, 9), 16) >> 1) & 0x3;
        var data_slot_03h30_04h00 = (parseInt(stringHex.substring(8, 10), 16) >> 3) & 0x3;

        var data_slot_04h00_04h30 = (parseInt(stringHex.substring(9, 10), 16) >> 1) & 0x3;
        var data_slot_04h30_05h00 = (parseInt(stringHex.substring(9, 11), 16) >> 3) & 0x3;
        var data_slot_05h00_05h30 = (parseInt(stringHex.substring(10, 11), 16) >> 1) & 0x3;
        var data_slot_05h30_06h00 = (parseInt(stringHex.substring(10, 12), 16) >> 3) & 0x3;

        var data_slot_06h00_06h30 = (parseInt(stringHex.substring(11, 12), 16) >> 1) & 0x3;
        var data_slot_06h30_07h00 = (parseInt(stringHex.substring(11, 13), 16) >> 3) & 0x3;
        var data_slot_07h00_07h30 = (parseInt(stringHex.substring(12, 13), 16) >> 1) & 0x3;
        var data_slot_07h30_08h00 = (parseInt(stringHex.substring(12, 14), 16) >> 3) & 0x3;

        var data_slot_08h00_08h30 = (parseInt(stringHex.substring(13, 14), 16) >> 1) & 0x3;
        var data_slot_08h30_09h00 = (parseInt(stringHex.substring(13, 15), 16) >> 3) & 0x3;
        var data_slot_09h00_09h30 = (parseInt(stringHex.substring(14, 15), 16) >> 1) & 0x3;
        var data_slot_09h30_10h00 = (parseInt(stringHex.substring(14, 16), 16) >> 3) & 0x3;

        var data_slot_10h00_10h30 = (parseInt(stringHex.substring(15, 16), 16) >> 1) & 0x3;
        var data_slot_10h30_11h00 = (parseInt(stringHex.substring(15, 17), 16) >> 3) & 0x3;
        var data_slot_11h00_11h30 = (parseInt(stringHex.substring(16, 17), 16) >> 1) & 0x3;
        var data_slot_11h30_12h00 = (parseInt(stringHex.substring(16, 18), 16) >> 3) & 0x3;

        var data_slot_12h00_12h30 = (parseInt(stringHex.substring(17, 18), 16) >> 1) & 0x3;
        var data_slot_12h30_13h00 = (parseInt(stringHex.substring(17, 19), 16) >> 3) & 0x3;
        var data_slot_13h00_13h30 = (parseInt(stringHex.substring(18, 19), 16) >> 1) & 0x3;
        var data_slot_13h30_14h00 = (parseInt(stringHex.substring(18, 20), 16) >> 3) & 0x3;

        var data_slot_14h00_14h30 = (parseInt(stringHex.substring(19, 20), 16) >> 1) & 0x3;
        var data_slot_14h30_15h00 = (parseInt(stringHex.substring(19, 21), 16) >> 3) & 0x3;
        var data_slot_15h00_15h30 = (parseInt(stringHex.substring(20, 21), 16) >> 1) & 0x3;
        var data_slot_15h30_16h00 = (parseInt(stringHex.substring(20, 22), 16) >> 3) & 0x3;

        var data_slot_16h00_16h30 = (parseInt(stringHex.substring(21, 22), 16) >> 1) & 0x3;
        var data_slot_16h30_17h00 = (parseInt(stringHex.substring(21, 23), 16) >> 3) & 0x3;
        var data_slot_17h00_17h30 = (parseInt(stringHex.substring(22, 23), 16) >> 1) & 0x3;
        var data_slot_17h30_18h00 = (parseInt(stringHex.substring(22, 24), 16) >> 3) & 0x3;

        var data_slot_18h00_18h30 = (parseInt(stringHex.substring(23, 24), 16) >> 1) & 0x3;
        var data_slot_18h30_19h00 = (parseInt(stringHex.substring(23, 25), 16) >> 3) & 0x3;
        var data_slot_19h00_19h30 = (parseInt(stringHex.substring(24, 25), 16) >> 1) & 0x3;
        var data_slot_19h30_20h00 = (parseInt(stringHex.substring(24, 26), 16) >> 3) & 0x3;

        var data_slot_20h00_20h30 = (parseInt(stringHex.substring(25, 26), 16) >> 1) & 0x3;
        var data_slot_20h30_21h00 = (parseInt(stringHex.substring(25, 27), 16) >> 3) & 0x3;
        var data_slot_21h00_21h30 = (parseInt(stringHex.substring(26, 27), 16) >> 1) & 0x3;
        var data_slot_21h30_22h00 = (parseInt(stringHex.substring(26, 28), 16) >> 3) & 0x3;

        var data_slot_22h00_22h30 = (parseInt(stringHex.substring(27, 28), 16) >> 1) & 0x3;
        var data_slot_22h30_23h00 = (parseInt(stringHex.substring(27, 29), 16) >> 3) & 0x3;
        var data_slot_23h00_23h30 = (parseInt(stringHex.substring(28, 29), 16) >> 1) & 0x3;
        var data_slot_23h30_00h00 = (parseInt(stringHex.substring(28, 30), 16) >> 3) & 0x3;


        let data = {
            "typeOfProduct": typeOfProduct(octetTypeProduit),
            "typeOfMessage": typeOfMessage(octetTypeMessage),
            "versionOfMessage" : octetVersionMessage,
            "sourceReconfiguration": fctSourceReconfiguration(data_source_reconfig),
            "statusReconfiguration": fctStatusReconfiguration(data_status_reconfig),
            "temperatureSlot00h00_00h30": temperatureSlotProfile(data_slot_00h00_00h30),
            "temperatureSlot00h30_01h00": temperatureSlotProfile(data_slot_00h30_01h00),
            "temperatureSlot01h00_01h30": temperatureSlotProfile(data_slot_01h00_01h30),
            "temperatureSlot01h30_02h00": temperatureSlotProfile(data_slot_01h30_02h00),
            "temperatureSlot02h00_02h30": temperatureSlotProfile(data_slot_02h00_02h30),
            "temperatureSlot02h30_03h00": temperatureSlotProfile(data_slot_02h30_03h00),
            "temperatureSlot03h00_03h30": temperatureSlotProfile(data_slot_03h00_03h30),
            "temperatureSlot03h30_04h00": temperatureSlotProfile(data_slot_03h30_04h00),
            "temperatureSlot04h00_04h30": temperatureSlotProfile(data_slot_04h00_04h30),
            "temperatureSlot04h30_05h00": temperatureSlotProfile(data_slot_04h30_05h00),
            "temperatureSlot05h00_05h30": temperatureSlotProfile(data_slot_05h00_05h30),
            "temperatureSlot05h30_06h00": temperatureSlotProfile(data_slot_05h30_06h00),
            "temperatureSlot06h00_06h30": temperatureSlotProfile(data_slot_06h00_06h30),
            "temperatureSlot06h30_07h00": temperatureSlotProfile(data_slot_06h30_07h00),
            "temperatureSlot07h00_07h30": temperatureSlotProfile(data_slot_07h00_07h30),
            "temperatureSlot07h30_08h00": temperatureSlotProfile(data_slot_07h30_08h00),
            "temperatureSlot08h00_08h30": temperatureSlotProfile(data_slot_08h00_08h30),
            "temperatureSlot08h30_09h00": temperatureSlotProfile(data_slot_08h30_09h00),
            "temperatureSlot09h00_09h30": temperatureSlotProfile(data_slot_09h00_09h30),
            "temperatureSlot09h30_10h00": temperatureSlotProfile(data_slot_09h30_10h00),
            "temperatureSlot10h00_10h30": temperatureSlotProfile(data_slot_10h00_10h30),
            "temperatureSlot10h30_11h00": temperatureSlotProfile(data_slot_10h30_11h00),
            "temperatureSlot11h00_11h30": temperatureSlotProfile(data_slot_11h00_11h30),
            "temperatureSlot11h30_12h00": temperatureSlotProfile(data_slot_11h30_12h00),
            "temperatureSlot12h00_12h30": temperatureSlotProfile(data_slot_12h00_12h30),
            "temperatureSlot12h30_13h00": temperatureSlotProfile(data_slot_12h30_13h00),
            "temperatureSlot13h00_13h30": temperatureSlotProfile(data_slot_13h00_13h30),
            "temperatureSlot13h30_14h00": temperatureSlotProfile(data_slot_13h30_14h00),
            "temperatureSlot14h00_14h30": temperatureSlotProfile(data_slot_14h00_14h30),
            "temperatureSlot14h30_15h00": temperatureSlotProfile(data_slot_14h30_15h00),
            "temperatureSlot15h00_15h30": temperatureSlotProfile(data_slot_15h00_15h30),
            "temperatureSlot15h30_16h00": temperatureSlotProfile(data_slot_15h30_16h00),
            "temperatureSlot16h00_16h30": temperatureSlotProfile(data_slot_16h00_16h30),
            "temperatureSlot16h30_17h00": temperatureSlotProfile(data_slot_16h30_17h00),
            "temperatureSlot17h00_17h30": temperatureSlotProfile(data_slot_17h00_17h30),
            "temperatureSlot17h30_18h00": temperatureSlotProfile(data_slot_17h30_18h00),
            "temperatureSlot18h00_18h30": temperatureSlotProfile(data_slot_18h00_18h30),
            "temperatureSlot18h30_19h00": temperatureSlotProfile(data_slot_18h30_19h00),
            "temperatureSlot19h00_19h30": temperatureSlotProfile(data_slot_19h00_19h30),
            "temperatureSlot19h30_20h00": temperatureSlotProfile(data_slot_19h30_20h00),
            "temperatureSlot20h00_20h30": temperatureSlotProfile(data_slot_20h00_20h30),
            "temperatureSlot20h30_21h00": temperatureSlotProfile(data_slot_20h30_21h00),
            "temperatureSlot21h00_21h30": temperatureSlotProfile(data_slot_21h00_21h30),
            "temperatureSlot21h30_22h00": temperatureSlotProfile(data_slot_21h30_22h00),
            "temperatureSlot22h00_22h30": temperatureSlotProfile(data_slot_22h00_22h30),
            "temperatureSlot22h30_23h00": temperatureSlotProfile(data_slot_22h30_23h00),
            "temperatureSlot23h00_23h30": temperatureSlotProfile(data_slot_23h00_23h30),
            "temperatureSlot23h30_00h00": temperatureSlotProfile(data_slot_23h30_00h00),
        }
        return data;
    }

    function dailyProfil2Output(stringHex) {

        var data_source_reconfig = (parseInt(stringHex.substring(4, 5), 16)>>1)&0x7;
        var data_status_reconfig = (parseInt(stringHex.substring(4, 6), 16)>>3)&0x3;

        var data_slot_00h00_00h30 = (parseInt(stringHex.substring(5, 6), 16) >> 1) & 0x3;
        var data_slot_00h30_01h00 = (parseInt(stringHex.substring(5, 7), 16) >> 3) & 0x3;
        var data_slot_01h00_01h30 = (parseInt(stringHex.substring(6, 7), 16) >> 1) & 0x3;
        var data_slot_01h30_02h00 = (parseInt(stringHex.substring(6, 8), 16) >> 3) & 0x3;

        var data_slot_02h00_02h30 = (parseInt(stringHex.substring(7, 8), 16) >> 1) & 0x3;
        var data_slot_02h30_03h00 = (parseInt(stringHex.substring(7, 9), 16) >> 3) & 0x3;
        var data_slot_03h00_03h30 = (parseInt(stringHex.substring(8, 9), 16) >> 1) & 0x3;
        var data_slot_03h30_04h00 = (parseInt(stringHex.substring(8, 10), 16) >> 3) & 0x3;

        var data_slot_04h00_04h30 = (parseInt(stringHex.substring(9, 10), 16) >> 1) & 0x3;
        var data_slot_04h30_05h00 = (parseInt(stringHex.substring(9, 11), 16) >> 3) & 0x3;
        var data_slot_05h00_05h30 = (parseInt(stringHex.substring(10, 11), 16) >> 1) & 0x3;
        var data_slot_05h30_06h00 = (parseInt(stringHex.substring(10, 12), 16) >> 3) & 0x3;

        var data_slot_06h00_06h30 = (parseInt(stringHex.substring(11, 12), 16) >> 1) & 0x3;
        var data_slot_06h30_07h00 = (parseInt(stringHex.substring(11, 13), 16) >> 3) & 0x3;
        var data_slot_07h00_07h30 = (parseInt(stringHex.substring(12, 13), 16) >> 1) & 0x3;
        var data_slot_07h30_08h00 = (parseInt(stringHex.substring(12, 14), 16) >> 3) & 0x3;

        var data_slot_08h00_08h30 = (parseInt(stringHex.substring(13, 14), 16) >> 1) & 0x3;
        var data_slot_08h30_09h00 = (parseInt(stringHex.substring(13, 15), 16) >> 3) & 0x3;
        var data_slot_09h00_09h30 = (parseInt(stringHex.substring(14, 15), 16) >> 1) & 0x3;
        var data_slot_09h30_10h00 = (parseInt(stringHex.substring(14, 16), 16) >> 3) & 0x3;

        var data_slot_10h00_10h30 = (parseInt(stringHex.substring(15, 16), 16) >> 1) & 0x3;
        var data_slot_10h30_11h00 = (parseInt(stringHex.substring(15, 17), 16) >> 3) & 0x3;
        var data_slot_11h00_11h30 = (parseInt(stringHex.substring(16, 17), 16) >> 1) & 0x3;
        var data_slot_11h30_12h00 = (parseInt(stringHex.substring(16, 18), 16) >> 3) & 0x3;

        var data_slot_12h00_12h30 = (parseInt(stringHex.substring(17, 18), 16) >> 1) & 0x3;
        var data_slot_12h30_13h00 = (parseInt(stringHex.substring(17, 19), 16) >> 3) & 0x3;
        var data_slot_13h00_13h30 = (parseInt(stringHex.substring(18, 19), 16) >> 1) & 0x3;
        var data_slot_13h30_14h00 = (parseInt(stringHex.substring(18, 20), 16) >> 3) & 0x3;

        var data_slot_14h00_14h30 = (parseInt(stringHex.substring(19, 20), 16) >> 1) & 0x3;
        var data_slot_14h30_15h00 = (parseInt(stringHex.substring(19, 21), 16) >> 3) & 0x3;
        var data_slot_15h00_15h30 = (parseInt(stringHex.substring(20, 21), 16) >> 1) & 0x3;
        var data_slot_15h30_16h00 = (parseInt(stringHex.substring(20, 22), 16) >> 3) & 0x3;

        var data_slot_16h00_16h30 = (parseInt(stringHex.substring(21, 22), 16) >> 1) & 0x3;
        var data_slot_16h30_17h00 = (parseInt(stringHex.substring(21, 23), 16) >> 3) & 0x3;
        var data_slot_17h00_17h30 = (parseInt(stringHex.substring(22, 23), 16) >> 1) & 0x3;
        var data_slot_17h30_18h00 = (parseInt(stringHex.substring(22, 24), 16) >> 3) & 0x3;

        var data_slot_18h00_18h30 = (parseInt(stringHex.substring(23, 24), 16) >> 1) & 0x3;
        var data_slot_18h30_19h00 = (parseInt(stringHex.substring(23, 25), 16) >> 3) & 0x3;
        var data_slot_19h00_19h30 = (parseInt(stringHex.substring(24, 25), 16) >> 1) & 0x3;
        var data_slot_19h30_20h00 = (parseInt(stringHex.substring(24, 26), 16) >> 3) & 0x3;

        var data_slot_20h00_20h30 = (parseInt(stringHex.substring(25, 26), 16) >> 1) & 0x3;
        var data_slot_20h30_21h00 = (parseInt(stringHex.substring(25, 27), 16) >> 3) & 0x3;
        var data_slot_21h00_21h30 = (parseInt(stringHex.substring(26, 27), 16) >> 1) & 0x3;
        var data_slot_21h30_22h00 = (parseInt(stringHex.substring(26, 28), 16) >> 3) & 0x3;

        var data_slot_22h00_22h30 = (parseInt(stringHex.substring(27, 28), 16) >> 1) & 0x3;
        var data_slot_22h30_23h00 = (parseInt(stringHex.substring(27, 29), 16) >> 3) & 0x3;
        var data_slot_23h00_23h30 = (parseInt(stringHex.substring(28, 29), 16) >> 1) & 0x3;
        var data_slot_23h30_00h00 = (parseInt(stringHex.substring(28, 30), 16) >> 3) & 0x3;


        let data = {
            "typeOfProduct": typeOfProduct(octetTypeProduit),
            "typeOfMessage": typeOfMessage(octetTypeMessage),
            "versionOfMessage" : octetVersionMessage,
            "sourceReconfiguration": fctSourceReconfiguration(data_source_reconfig),
            "statusReconfiguration": fctStatusReconfiguration(data_status_reconfig),
            "temperatureSlot00h00_00h30": temperatureSlotProfile(data_slot_00h00_00h30),
            "temperatureSlot00h30_01h00": temperatureSlotProfile(data_slot_00h30_01h00),
            "temperatureSlot01h00_01h30": temperatureSlotProfile(data_slot_01h00_01h30),
            "temperatureSlot01h30_02h00": temperatureSlotProfile(data_slot_01h30_02h00),
            "temperatureSlot02h00_02h30": temperatureSlotProfile(data_slot_02h00_02h30),
            "temperatureSlot02h30_03h00": temperatureSlotProfile(data_slot_02h30_03h00),
            "temperatureSlot03h00_03h30": temperatureSlotProfile(data_slot_03h00_03h30),
            "temperatureSlot03h30_04h00": temperatureSlotProfile(data_slot_03h30_04h00),
            "temperatureSlot04h00_04h30": temperatureSlotProfile(data_slot_04h00_04h30),
            "temperatureSlot04h30_05h00": temperatureSlotProfile(data_slot_04h30_05h00),
            "temperatureSlot05h00_05h30": temperatureSlotProfile(data_slot_05h00_05h30),
            "temperatureSlot05h30_06h00": temperatureSlotProfile(data_slot_05h30_06h00),
            "temperatureSlot06h00_06h30": temperatureSlotProfile(data_slot_06h00_06h30),
            "temperatureSlot06h30_07h00": temperatureSlotProfile(data_slot_06h30_07h00),
            "temperatureSlot07h00_07h30": temperatureSlotProfile(data_slot_07h00_07h30),
            "temperatureSlot07h30_08h00": temperatureSlotProfile(data_slot_07h30_08h00),
            "temperatureSlot08h00_08h30": temperatureSlotProfile(data_slot_08h00_08h30),
            "temperatureSlot08h30_09h00": temperatureSlotProfile(data_slot_08h30_09h00),
            "temperatureSlot09h00_09h30": temperatureSlotProfile(data_slot_09h00_09h30),
            "temperatureSlot09h30_10h00": temperatureSlotProfile(data_slot_09h30_10h00),
            "temperatureSlot10h00_10h30": temperatureSlotProfile(data_slot_10h00_10h30),
            "temperatureSlot10h30_11h00": temperatureSlotProfile(data_slot_10h30_11h00),
            "temperatureSlot11h00_11h30": temperatureSlotProfile(data_slot_11h00_11h30),
            "temperatureSlot11h30_12h00": temperatureSlotProfile(data_slot_11h30_12h00),
            "temperatureSlot12h00_12h30": temperatureSlotProfile(data_slot_12h00_12h30),
            "temperatureSlot12h30_13h00": temperatureSlotProfile(data_slot_12h30_13h00),
            "temperatureSlot13h00_13h30": temperatureSlotProfile(data_slot_13h00_13h30),
            "temperatureSlot13h30_14h00": temperatureSlotProfile(data_slot_13h30_14h00),
            "temperatureSlot14h00_14h30": temperatureSlotProfile(data_slot_14h00_14h30),
            "temperatureSlot14h30_15h00": temperatureSlotProfile(data_slot_14h30_15h00),
            "temperatureSlot15h00_15h30": temperatureSlotProfile(data_slot_15h00_15h30),
            "temperatureSlot15h30_16h00": temperatureSlotProfile(data_slot_15h30_16h00),
            "temperatureSlot16h00_16h30": temperatureSlotProfile(data_slot_16h00_16h30),
            "temperatureSlot16h30_17h00": temperatureSlotProfile(data_slot_16h30_17h00),
            "temperatureSlot17h00_17h30": temperatureSlotProfile(data_slot_17h00_17h30),
            "temperatureSlot17h30_18h00": temperatureSlotProfile(data_slot_17h30_18h00),
            "temperatureSlot18h00_18h30": temperatureSlotProfile(data_slot_18h00_18h30),
            "temperatureSlot18h30_19h00": temperatureSlotProfile(data_slot_18h30_19h00),
            "temperatureSlot19h00_19h30": temperatureSlotProfile(data_slot_19h00_19h30),
            "temperatureSlot19h30_20h00": temperatureSlotProfile(data_slot_19h30_20h00),
            "temperatureSlot20h00_20h30": temperatureSlotProfile(data_slot_20h00_20h30),
            "temperatureSlot20h30_21h00": temperatureSlotProfile(data_slot_20h30_21h00),
            "temperatureSlot21h00_21h30": temperatureSlotProfile(data_slot_21h00_21h30),
            "temperatureSlot21h30_22h00": temperatureSlotProfile(data_slot_21h30_22h00),
            "temperatureSlot22h00_22h30": temperatureSlotProfile(data_slot_22h00_22h30),
            "temperatureSlot22h30_23h00": temperatureSlotProfile(data_slot_22h30_23h00),
            "temperatureSlot23h00_23h30": temperatureSlotProfile(data_slot_23h00_23h30),
            "temperatureSlot23h30_00h00": temperatureSlotProfile(data_slot_23h30_00h00),
        }
        return data;
    }

    function dailyProfil3Output(stringHex) {

        var data_source_reconfig = (parseInt(stringHex.substring(4, 5), 16)>>1)&0x7;
        var data_status_reconfig = (parseInt(stringHex.substring(4, 6), 16)>>3)&0x3;

        var data_slot_00h00_00h30 = (parseInt(stringHex.substring(5, 6), 16) >> 1) & 0x3;
        var data_slot_00h30_01h00 = (parseInt(stringHex.substring(5, 7), 16) >> 3) & 0x3;
        var data_slot_01h00_01h30 = (parseInt(stringHex.substring(6, 7), 16) >> 1) & 0x3;
        var data_slot_01h30_02h00 = (parseInt(stringHex.substring(6, 8), 16) >> 3) & 0x3;

        var data_slot_02h00_02h30 = (parseInt(stringHex.substring(7, 8), 16) >> 1) & 0x3;
        var data_slot_02h30_03h00 = (parseInt(stringHex.substring(7, 9), 16) >> 3) & 0x3;
        var data_slot_03h00_03h30 = (parseInt(stringHex.substring(8, 9), 16) >> 1) & 0x3;
        var data_slot_03h30_04h00 = (parseInt(stringHex.substring(8, 10), 16) >> 3) & 0x3;

        var data_slot_04h00_04h30 = (parseInt(stringHex.substring(9, 10), 16) >> 1) & 0x3;
        var data_slot_04h30_05h00 = (parseInt(stringHex.substring(9, 11), 16) >> 3) & 0x3;
        var data_slot_05h00_05h30 = (parseInt(stringHex.substring(10, 11), 16) >> 1) & 0x3;
        var data_slot_05h30_06h00 = (parseInt(stringHex.substring(10, 12), 16) >> 3) & 0x3;

        var data_slot_06h00_06h30 = (parseInt(stringHex.substring(11, 12), 16) >> 1) & 0x3;
        var data_slot_06h30_07h00 = (parseInt(stringHex.substring(11, 13), 16) >> 3) & 0x3;
        var data_slot_07h00_07h30 = (parseInt(stringHex.substring(12, 13), 16) >> 1) & 0x3;
        var data_slot_07h30_08h00 = (parseInt(stringHex.substring(12, 14), 16) >> 3) & 0x3;

        var data_slot_08h00_08h30 = (parseInt(stringHex.substring(13, 14), 16) >> 1) & 0x3;
        var data_slot_08h30_09h00 = (parseInt(stringHex.substring(13, 15), 16) >> 3) & 0x3;
        var data_slot_09h00_09h30 = (parseInt(stringHex.substring(14, 15), 16) >> 1) & 0x3;
        var data_slot_09h30_10h00 = (parseInt(stringHex.substring(14, 16), 16) >> 3) & 0x3;

        var data_slot_10h00_10h30 = (parseInt(stringHex.substring(15, 16), 16) >> 1) & 0x3;
        var data_slot_10h30_11h00 = (parseInt(stringHex.substring(15, 17), 16) >> 3) & 0x3;
        var data_slot_11h00_11h30 = (parseInt(stringHex.substring(16, 17), 16) >> 1) & 0x3;
        var data_slot_11h30_12h00 = (parseInt(stringHex.substring(16, 18), 16) >> 3) & 0x3;

        var data_slot_12h00_12h30 = (parseInt(stringHex.substring(17, 18), 16) >> 1) & 0x3;
        var data_slot_12h30_13h00 = (parseInt(stringHex.substring(17, 19), 16) >> 3) & 0x3;
        var data_slot_13h00_13h30 = (parseInt(stringHex.substring(18, 19), 16) >> 1) & 0x3;
        var data_slot_13h30_14h00 = (parseInt(stringHex.substring(18, 20), 16) >> 3) & 0x3;

        var data_slot_14h00_14h30 = (parseInt(stringHex.substring(19, 20), 16) >> 1) & 0x3;
        var data_slot_14h30_15h00 = (parseInt(stringHex.substring(19, 21), 16) >> 3) & 0x3;
        var data_slot_15h00_15h30 = (parseInt(stringHex.substring(20, 21), 16) >> 1) & 0x3;
        var data_slot_15h30_16h00 = (parseInt(stringHex.substring(20, 22), 16) >> 3) & 0x3;

        var data_slot_16h00_16h30 = (parseInt(stringHex.substring(21, 22), 16) >> 1) & 0x3;
        var data_slot_16h30_17h00 = (parseInt(stringHex.substring(21, 23), 16) >> 3) & 0x3;
        var data_slot_17h00_17h30 = (parseInt(stringHex.substring(22, 23), 16) >> 1) & 0x3;
        var data_slot_17h30_18h00 = (parseInt(stringHex.substring(22, 24), 16) >> 3) & 0x3;

        var data_slot_18h00_18h30 = (parseInt(stringHex.substring(23, 24), 16) >> 1) & 0x3;
        var data_slot_18h30_19h00 = (parseInt(stringHex.substring(23, 25), 16) >> 3) & 0x3;
        var data_slot_19h00_19h30 = (parseInt(stringHex.substring(24, 25), 16) >> 1) & 0x3;
        var data_slot_19h30_20h00 = (parseInt(stringHex.substring(24, 26), 16) >> 3) & 0x3;

        var data_slot_20h00_20h30 = (parseInt(stringHex.substring(25, 26), 16) >> 1) & 0x3;
        var data_slot_20h30_21h00 = (parseInt(stringHex.substring(25, 27), 16) >> 3) & 0x3;
        var data_slot_21h00_21h30 = (parseInt(stringHex.substring(26, 27), 16) >> 1) & 0x3;
        var data_slot_21h30_22h00 = (parseInt(stringHex.substring(26, 28), 16) >> 3) & 0x3;

        var data_slot_22h00_22h30 = (parseInt(stringHex.substring(27, 28), 16) >> 1) & 0x3;
        var data_slot_22h30_23h00 = (parseInt(stringHex.substring(27, 29), 16) >> 3) & 0x3;
        var data_slot_23h00_23h30 = (parseInt(stringHex.substring(28, 29), 16) >> 1) & 0x3;
        var data_slot_23h30_00h00 = (parseInt(stringHex.substring(28, 30), 16) >> 3) & 0x3;


        let data = {
            "typeOfProduct": typeOfProduct(octetTypeProduit),
            "typeOfMessage": typeOfMessage(octetTypeMessage),
            "versionOfMessage" : octetVersionMessage,
            "sourceReconfiguration": fctSourceReconfiguration(data_source_reconfig),
            "statusReconfiguration": fctStatusReconfiguration(data_status_reconfig),
            "temperatureSlot00h00_00h30": temperatureSlotProfile(data_slot_00h00_00h30),
            "temperatureSlot00h30_01h00": temperatureSlotProfile(data_slot_00h30_01h00),
            "temperatureSlot01h00_01h30": temperatureSlotProfile(data_slot_01h00_01h30),
            "temperatureSlot01h30_02h00": temperatureSlotProfile(data_slot_01h30_02h00),
            "temperatureSlot02h00_02h30": temperatureSlotProfile(data_slot_02h00_02h30),
            "temperatureSlot02h30_03h00": temperatureSlotProfile(data_slot_02h30_03h00),
            "temperatureSlot03h00_03h30": temperatureSlotProfile(data_slot_03h00_03h30),
            "temperatureSlot03h30_04h00": temperatureSlotProfile(data_slot_03h30_04h00),
            "temperatureSlot04h00_04h30": temperatureSlotProfile(data_slot_04h00_04h30),
            "temperatureSlot04h30_05h00": temperatureSlotProfile(data_slot_04h30_05h00),
            "temperatureSlot05h00_05h30": temperatureSlotProfile(data_slot_05h00_05h30),
            "temperatureSlot05h30_06h00": temperatureSlotProfile(data_slot_05h30_06h00),
            "temperatureSlot06h00_06h30": temperatureSlotProfile(data_slot_06h00_06h30),
            "temperatureSlot06h30_07h00": temperatureSlotProfile(data_slot_06h30_07h00),
            "temperatureSlot07h00_07h30": temperatureSlotProfile(data_slot_07h00_07h30),
            "temperatureSlot07h30_08h00": temperatureSlotProfile(data_slot_07h30_08h00),
            "temperatureSlot08h00_08h30": temperatureSlotProfile(data_slot_08h00_08h30),
            "temperatureSlot08h30_09h00": temperatureSlotProfile(data_slot_08h30_09h00),
            "temperatureSlot09h00_09h30": temperatureSlotProfile(data_slot_09h00_09h30),
            "temperatureSlot09h30_10h00": temperatureSlotProfile(data_slot_09h30_10h00),
            "temperatureSlot10h00_10h30": temperatureSlotProfile(data_slot_10h00_10h30),
            "temperatureSlot10h30_11h00": temperatureSlotProfile(data_slot_10h30_11h00),
            "temperatureSlot11h00_11h30": temperatureSlotProfile(data_slot_11h00_11h30),
            "temperatureSlot11h30_12h00": temperatureSlotProfile(data_slot_11h30_12h00),
            "temperatureSlot12h00_12h30": temperatureSlotProfile(data_slot_12h00_12h30),
            "temperatureSlot12h30_13h00": temperatureSlotProfile(data_slot_12h30_13h00),
            "temperatureSlot13h00_13h30": temperatureSlotProfile(data_slot_13h00_13h30),
            "temperatureSlot13h30_14h00": temperatureSlotProfile(data_slot_13h30_14h00),
            "temperatureSlot14h00_14h30": temperatureSlotProfile(data_slot_14h00_14h30),
            "temperatureSlot14h30_15h00": temperatureSlotProfile(data_slot_14h30_15h00),
            "temperatureSlot15h00_15h30": temperatureSlotProfile(data_slot_15h00_15h30),
            "temperatureSlot15h30_16h00": temperatureSlotProfile(data_slot_15h30_16h00),
            "temperatureSlot16h00_16h30": temperatureSlotProfile(data_slot_16h00_16h30),
            "temperatureSlot16h30_17h00": temperatureSlotProfile(data_slot_16h30_17h00),
            "temperatureSlot17h00_17h30": temperatureSlotProfile(data_slot_17h00_17h30),
            "temperatureSlot17h30_18h00": temperatureSlotProfile(data_slot_17h30_18h00),
            "temperatureSlot18h00_18h30": temperatureSlotProfile(data_slot_18h00_18h30),
            "temperatureSlot18h30_19h00": temperatureSlotProfile(data_slot_18h30_19h00),
            "temperatureSlot19h00_19h30": temperatureSlotProfile(data_slot_19h00_19h30),
            "temperatureSlot19h30_20h00": temperatureSlotProfile(data_slot_19h30_20h00),
            "temperatureSlot20h00_20h30": temperatureSlotProfile(data_slot_20h00_20h30),
            "temperatureSlot20h30_21h00": temperatureSlotProfile(data_slot_20h30_21h00),
            "temperatureSlot21h00_21h30": temperatureSlotProfile(data_slot_21h00_21h30),
            "temperatureSlot21h30_22h00": temperatureSlotProfile(data_slot_21h30_22h00),
            "temperatureSlot22h00_22h30": temperatureSlotProfile(data_slot_22h00_22h30),
            "temperatureSlot22h30_23h00": temperatureSlotProfile(data_slot_22h30_23h00),
            "temperatureSlot23h00_23h30": temperatureSlotProfile(data_slot_23h00_23h30),
            "temperatureSlot23h30_00h00": temperatureSlotProfile(data_slot_23h30_00h00),
        }
        return data;
    }

} // end of decoder