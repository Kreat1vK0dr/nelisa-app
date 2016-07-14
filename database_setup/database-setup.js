var mysql = require('mysql'),
    fs = require('fs');

var costOfSales = require('../lib/cost-of-sales.js');

const url = process.env.MYSQL_URL!==undefined ? process.env.MYSQL_URL : 'mysql://root:1amdan13l@localhost/nelisa_another_copy';

      var connection = mysql.createConnection(url);

connection.connect();
connection.query('SELECT id, product_id, date, quantity, remaining, unitcost FROM purchases ORDER BY date', function (err, purchasesFromDB, fields) {
    if (err) throw err;
    var purchases = purchasesFromDB,
        salesToUpdate = [],
        purchasesToUpdateMap = new Map(),
        purchasesToUpdateArray = [],
        inventoryLog = [];

    connection.query('SELECT * from sales WHERE quantity > 0 ORDER BY date', function (err, sales, fields) {
        if (err) throw err;

        costOfSales.initialCOSandInventoryLog(sales, purchases, salesToUpdate, purchasesToUpdateMap, inventoryLog);
        // costOfSales.initialCOSandInventoryLog(sales, purchases, salesToUpdate, purchasesToUpdate, inventoryLog);
        purchasesToUpdateMap.forEach(function (value, key) {
            purchasesToUpdateArray.push([key, value]);
        });
        connection.query("CREATE TEMPORARY TABLE if not exists sales_temp(id int not null, cost decimal(10,2) not null, cant_sell int not null)", function (err, rows) {
            if (err) throw err;
            console.log("CREATED TEMP SALES TABLE");

            connection.query("CREATE TEMPORARY TABLE if not exists purchases_temp(id int not null, remaining int not null)", function (err, rows) {
                if (err) throw err;
                console.log("CREATED TEMP PURCHASES TABLE");

                connection.query("INSERT INTO sales_temp (id, cost, cant_sell) VALUES ?", [salesToUpdate], function (err, rows) {
                    if (err) throw err;
                    console.log("INSERTED CALCULATIONS INTO SALES_TEMP");
                    console.log("UPDATED " + rows.affectedRows + " rows IN SALES_TEMP.");
                    console.log("CHANGED " + rows.changedRows + " rows IN SALES_TEMP.");

                    connection.query("INSERT INTO purchases_temp (id, remaining) VALUES ?", [purchasesToUpdateArray], function (err, rows) {
                        if (err) throw err;
                        console.log("INSERTED NEW REMAINING VALUES INTO PURCHASES_TEMP");
                        console.log("UPDATED " + rows.affectedRows + " rows IN PURCHASES_TEMP.");
                        console.log("CHANGED " + rows.changedRows + " rows IN PURCHASES_TEMP.");

                        connection.query("UPDATE sales AS dest, sales_temp AS src SET dest.cost= src.cost, dest.cant_sell = src.cant_sell WHERE dest.id = src.id", function (err, rows) {
                            if (err) throw err;
                            console.log("SUCCESSFULLY UPDATED SALES TABLE");
                            console.log("UPDATED " + rows.affectedRows + " rows IN SALES.");
                            console.log("CHANGED " + rows.changedRows + " rows IN SALES.");

                            connection.query("UPDATE purchases AS dest, purchases_temp AS src SET dest.remaining = src.remaining WHERE dest.id = src.id", function (err, rows) {
                                if (err) throw err;
                                console.log("SUCCESSFULLY UPDATED PURCHASES TABLE");
                                console.log("UPDATED " + rows.affectedRows + " rows IN PURCHASES.");
                                console.log("CHANGED " + rows.changedRows + " rows IN PURCHASES.");

                                connection.query("INSERT INTO inventory_log (date, action, action_id, product_id, quantity, inv_bef_action, inv_aft_action, cant_sell) VALUES ?", [inventoryLog], function (err, rows) {
                                    if (err) throw err;
                                    console.log("SUCCESSFULLY UPDATED INVENTORY_LOG TABLE");
                                    console.log("UPDATED " + rows.affectedRows + " rows IN INVENTORY_LOG.");
                                    console.log("CHANGED " + rows.changedRows + " rows IN INVENTORY_LOG.");



                                        connection.end();

                                });

                            });
                        });
                    });
                });
            });
        });
    });
});
