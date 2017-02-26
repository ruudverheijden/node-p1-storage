var P1Reader = require('p1-reader');

var config = require('./config/config.json');

var readerConfig = {
    emulator: true,
    emulatorOverrides: {
        electricityOffset: 100,
        electricityIncrement: 0.500,
        gasOffset: 50,
        gasIncrement: 0.100,
        interval: 1,
        intervalGas: 3 // Must be larger than 'interval'
    }
};

var p1Reader = new P1Reader(readerConfig);

p1Reader.on('connected', function(port) {
    console.log('Connection with the Smart Meter has been established on port: ' + port);
});

p1Reader.on('reading', function(data) {
    console.log('Reading received: currently consuming ' + data.electricity.received.actual.reading + data.electricity.received.actual.unit);

    // Write electricity totals and actual value to CSV
    var output = '' +
        data.timestamp + ';' +
        data.electricity.received.tariff1.reading + ';' +
        data.electricity.received.tariff2.reading + ';' +
        data.electricity.received.actual.reading + ';' +
        data.electricity.tariffIndicator + ';' +
        data.electricity.numberOfPowerFailures + ';' +
        data.electricity.numberOfLongPowerFailures + ';' +
        data.gas.timestamp + ';' +
        data.gas.reading + '\n';

    console.log(output);
});

p1Reader.on('error', function(error) {
    console.log(error);
});

p1Reader.on('close', function() {
    console.log('Connection closed');
});

// Handle all uncaught errors without crashing
process.on('uncaughtException', function(error) {
    console.error(error);
});
