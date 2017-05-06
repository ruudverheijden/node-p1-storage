function Store(db) {
    return {
        storeElectricityReading: function (datetime, received_actual, received_1, received_2, delivered_actual, delivered_1, delivered_2) {
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
        }
    };
}

module.exports = Store;