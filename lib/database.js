const sqlite3 = require('sqlite3').verbose();
const config = require('../config/config.json');

const db = new sqlite3.Database(config.databaseName);

/**
 * Create the database if it does not yet exist
 */
db.get('SELECT name FROM sqlite_master WHERE type="table" AND name="' + config.electricityTableName + '"', function (err, row) {
    if (row) {
        return;
    }

    console.log('Creating "' + config.electricityTableName + '" table...');

    db.run(
        `CREATE TABLE readings_electricity (
        datetime TEXT PRIMARY KEY,
        received_actual REAL,
        received_1 REAL,
        received_2 REAL,
        delivered_actual REAL,
        delivered_1 REAL,
        delivered_2 REAL)`
    );
});

db.get('SELECT name FROM sqlite_master WHERE type="table" AND name="' + config.gasTableName + '"', function (err, row) {
    if (row) {
        return;
    }

    console.log('Creating "' + config.gasTableName + '" table...');

    db.run(
        `CREATE TABLE readings_gas (
        datetime TEXT PRIMARY KEY,
        reading REAL)`
    );
});


module.exports.storeElectricityReading = function (datetime, received_actual, received_1, received_2, delivered_actual, delivered_1, delivered_2) {

    db.run(
        `INSERT INTO readings_electricity (
            datetime, received_actual, received_1, received_2, delivered_actual, delivered_1, delivered_2
            )
            VALUES (
            "${datetime}",
            ${received_actual},
            ${received_1},
            ${received_2},
            ${delivered_actual},
            ${delivered_1},
            ${delivered_2}
            )`
        , function (err) {
            if (err) {
                console.error('Failed storing electricity reading to "readings_electricity" table: ' + err);
            }
        });

};

