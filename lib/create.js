const sqlite3 = require('sqlite3').verbose();
const config = require('../config/config.json');

const db = new sqlite3.Database(config.databaseName);

/**
 * Create the database if it does not yet exist
 *
 * @return {Object} Returns a sqlite3 database instance
 */
function create() {
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

    return db;
}

module.exports = create;