const P1Reader = require('p1-reader');

const config = require('./config/config.json');
const database = require('./lib/database');
const store = require('./lib/store')(database);
const aggregate = require('./lib/aggregate')(database);

const readerConfig = {
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

const p1Reader = new P1Reader(readerConfig);

p1Reader.on('connected', function(port) {
    console.log('Connection with the Smart Meter has been established on port: ' + port);
});

p1Reader.on('reading', function(data) {
    console.log('Reading received: currently consuming ' + data.electricity.received.actual.reading + data.electricity.received.actual.unit);

    if (data.timestamp && data.electricity.received.actual.reading) {
        store.storeElectricityReading(
            data.timestamp,
            data.electricity.received.actual.reading,
            data.electricity.received.tariff1.reading,
            data.electricity.received.tariff2.reading,
            data.electricity.delivered.actual.reading,
            data.electricity.delivered.tariff1.reading,
            data.electricity.delivered.tariff2.reading
        );
    }

});

p1Reader.on('error', function(error) {
    console.log(error);
});

p1Reader.on('close', function() {
    console.log('Connection closed');
});

// Aggregate data on interval
setInterval(aggregate.aggregate, config.aggregationInterval);

// Handle all uncaught errors without crashing
process.on('uncaughtException', function(error) {
    console.error(error);
});