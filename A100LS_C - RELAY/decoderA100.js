/* 
* Payload Decoder LoRa Alliance for RELAY(A100LS_C)
* Copyright 2025 Nexelec
* Version : 1.0.2
*/

function decodeUplink(input) {

    var stringHex = bytesString(input.bytes);

    var octetTypeProduit = parseInt(stringHex.substring(0, 2), 16);
    var octetTypeMessage = parseInt(stringHex.substring(2, 4), 16);

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
        var outputTypeMessage = ["Reserved", periodicOutput(stringHex), productStatusOutput(stringHex), productConfigurationOutput(stringHex), relayStateOutput(stringHex), cutOffOutput(stringHex)]
        return outputTypeMessage[octetTypeMessage]
    }

    function typeOfProduct(octetTypeProduit) {
        if (octetTypeProduit == 0xB0) { return "Safecut" }
        if (octetTypeProduit == 0xD3) { return "Relay" }
    }

    function typeOfMessage(octetTypeMessage) {
        var message_name = ["Reserved", "Periodic", "Product Status", "Product Configuration", "Relay State", "Cut-off Frame",]

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

    function d2dPing(octetD2DPing) {
        if (octetD2DPing == 0) { return "Not compatible" }
        if (octetD2DPing >= 1) { return "Compatible" }
    }

    function period(octetPeriod) {
        return { "value": parseFloat(octetPeriod), "unit": "min" }
    }

    function fctThresholdOvercurrentProtection(octetThreshold) {
        if (octetThreshold === 0) { return { "value": "off" } }
        if (octetThreshold > 0) { return { "value": octetThreshold, "unit": "W" } }
    }

    function fctEnableOvercurrentProtection(octetThreshold) {
        if (octetThreshold === 0) { return "off" }
        if (octetThreshold > 0) { return "on" }
    }

    function sourceOutput(octetReconfigurationSource) {
        if (octetReconfigurationSource == 0) { return "nfc" }
        if (octetReconfigurationSource == 1) { return "downlink" }
        if (octetReconfigurationSource == 2) { return "startup" }
        if (octetReconfigurationSource == 3) { return "local network" }
        if (octetReconfigurationSource == 4) { return "button" }
        if (octetReconfigurationSource == 5) { return "weekly" }
        if (octetReconfigurationSource == 6) { return "overpower" }
        if (octetReconfigurationSource == 7) { return "timer" }
    }

    function periodicOutput(stringHex) {
        var relayState = (parseInt(stringHex.substring(4, 5), 16) >> 3);
        var powerMax = (parseInt(stringHex.substring(4, 8), 16) >> 3) & 0xFFF;
        var energy = (parseInt(stringHex.substring(7, 11), 16) >> 1) & 0x3FFF;

        data = {
            "typeOfProduct": typeOfProduct(octetTypeProduit),
            "typeOfMessage": typeOfMessage(octetTypeMessage),
            "output1": onOff(relayState),
            "powerMax": { "value": powerMax, "unit": "W" },
            "energy": { "value": energy, "unit": "W.h" }
        };
        return data;
    }

    function productConfigurationOutput(stringHex) {
        var statusReconfiguration = (parseInt(stringHex.substring(4, 5), 16) >> 2) & 0x03;
        var periodPeriodicTransmission = (parseInt(stringHex.substring(4, 7), 16) >> 2) & 0xFF;
        var sourceReconfiguration = (parseInt(stringHex.substring(6, 8), 16) >> 3) & 0x07;
        var enableNfcDiscover = (parseInt(stringHex.substring(7, 8), 16) >> 1) & 0x03;
        var thresholdOvercurrentProtection = (parseInt(stringHex.substring(7, 11), 16) >> 1) & 0x0FFF;
        var enableOvercurrentProtection = (parseInt(stringHex.substring(7, 11), 16) >> 1) & 0x0FFF;
        var isJoinPending = (parseInt(stringHex.substring(10, 11), 16)) & 0x01;

        data = {
            "typeOfProduct": typeOfProduct(octetTypeProduit),
            "typeOfMessage": typeOfMessage(octetTypeMessage),
            "statusReconfiguration": fctStatusReconfiguration(statusReconfiguration),
            "sourceReconfiguration": fctSourceReconfiguration(sourceReconfiguration),
            "periodPeriodicTransmission": period(periodPeriodicTransmission),
            "enableNfcDiscover": onOff(enableNfcDiscover),
            "thresholdOvercurrentProtection": fctThresholdOvercurrentProtection(thresholdOvercurrentProtection),
            "enableOvercurrentProtection": fctEnableOvercurrentProtection(enableOvercurrentProtection),
            "isJoinPending": trueFalse(isJoinPending),
        };
        return data;
    }

    function productStatusOutput(stringHex) {
        var hardwareVersion = (parseInt(stringHex.substring(4, 6), 16));
        var softwareVersion = (parseInt(stringHex.substring(6, 8), 16));
        var statusProduct = (parseInt(stringHex.substring(8, 9), 16) >> 3) & 0x01;
        var isOvercurrentTriggered = (parseInt(stringHex.substring(8, 9), 16) >> 2) & 0x01;

        data = {
            "typeOfProduct": typeOfProduct(octetTypeProduit),
            "typeOfMessage": typeOfMessage(octetTypeMessage),
            "hardwareVersion": hardwareVersion,
            "softwareVersion": softwareVersion,
            "statusProduct": okError(statusProduct),
            "isOvercurrentTriggered": trueFalse(isOvercurrentTriggered)
        };
        return data;
    }

    function cutOffOutput(stringHex) {
        data = {
            "typeOfProduct": typeOfProduct(octetTypeProduit),
            "typeOfMessage": typeOfMessage(octetTypeMessage),
        };
        return data;
    }

    function relayStateOutput(stringHex) {
        var output1 = (parseInt(stringHex.substring(4, 5), 16) >> 3) & 0x01;
        var sourceOutputCommand = (parseInt(stringHex.substring(4, 5), 16)) & 0x07;

        data = {
            "typeOfProduct": typeOfProduct(octetTypeProduit),
            "typeOfMessage": typeOfMessage(octetTypeMessage),
            "output1": onOff(output1),
            "sourceOutputCommand": sourceOutput(sourceOutputCommand)
        }
        return data;
    }
} // end of decoder