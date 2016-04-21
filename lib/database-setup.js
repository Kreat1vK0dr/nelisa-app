var mysql = require('mysql'),
    fs = require('fs');

var costOfSales = require('./cost-of-sales.js');


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1amdan13l',
    database: 'nelisa_another_copy'
});

connection.connect();

connection.query('SELECT id, product_id, date, quantity, remaining, eacost from purchases ORDER BY date', function (err, purchases, fields) {
    if (err) throw err;
    var purchasesFromDatabase = purchases;

    connection.query('SELECT id, date, product_id, quantity, price from sales WHERE quantity > 0 ORDER BY date', function (err, sales, fields) {
        if (err) throw err;
        var salesToUpdate = [],
            purchasesToUpdate = [],
            inventoryLog = [];

        costOfSales.getCOSandLogInventory(sales, purchasesFromDatabase, salesToUpdate, purchasesToUpdate, inventoryLog);

        connection.query("CREATE TEMPORARY TABLE if not exists sales_temp(id int not null, cost_of_sale decimal(10,2) not null, cant_sell int not null)", function (err, rows) {
            if (err) throw err;
            console.log("CREATED TEMP SALES TABLE");

            connection.query("CREATE TEMPORARY TABLE if not exists purchases_temp(id int not null, remaining int not null)", function (err, rows) {
                if (err) throw err;
                console.log("CREATED TEMP PURCHASES TABLE");
                // console.log("THIS IS SALES TO UPDATE", salesToUpdate);
                connection.query("INSERT INTO sales_temp (id, cost_of_sale, cant_sell) VALUES ?", [salesToUpdate], function (err, rows) {
                    // console.log("THIS IS SALES UPDATES", updateSales);
                    // console.log("THIS IS PURCHASES UPDATES", updatePurchases);
                    if (err) throw err;
                    console.log("INSERTED CALCULATIONS INTO SALES_TEMP");
                    console.log("UPDATED " + rows.affectedRows + " rows IN SALES_TEMP.");
                    console.log("CHANGED " + rows.changedRows + " rows IN SALES_TEMP.");
                    // console.log('THIS IS PURCHASES TO UPDATE', purchasesToUpdate);
                    connection.query("INSERT INTO purchases_temp (id, remaining) VALUES ?", [purchasesToUpdate], function (err, rows) {
                        // console.log("THIS IS PURCHASES UPDATES", updatePurchases);
                        if (err) throw err;
                        console.log("INSERTED NEW REMAINING VALUES INTO PURCHASES_TEMP");
                        console.log("UPDATED " + rows.affectedRows + " rows IN PURCHASES_TEMP.");
                        console.log("CHANGED " + rows.changedRows + " rows IN PURCHASES_TEMP.");

                        connection.query("UPDATE sales AS dest, sales_temp AS src SET dest.cost_of_sale = src.cost_of_sale, dest.cant_sell = src.cant_sell WHERE dest.id = src.id", function (err, rows) {
                            if (err) throw err;
                            console.log("SUCCESSFULLY UPDATED SALES TABLE");
                            console.log("UPDATED " + rows.affectedRows + " rows IN SALES.");
                            console.log("CHANGED " + rows.changedRows + " rows IN SALES.");

                            connection.query("UPDATE purchases AS dest, purchases_temp AS src SET dest.remaining = src.remaining WHERE dest.id = src.id", function (err, rows) {
                                if (err) throw err;
                                console.log("SUCCESSFULLY UPDATED PURCHASES TABLE");
                                console.log("UPDATED " + rows.affectedRows + " rows IN PURCHASES.");
                                console.log("CHANGED " + rows.changedRows + " rows IN PURCHASES.");
                                // console.log("THIS IS INVENTORY LOG", inventoryLog);
                                connection.query("INSERT INTO inventory_log (date, action, action_id, product_id, quantity, inv_bef_action, inv_aft_action, cant_sell) VALUES ?", [inventoryLog], function (err, rows) {
                                    if (err) throw err;
                                    console.log("SUCCESSFULLY UPDATED INVENTORY_LOG TABLE");
                                    console.log("UPDATED " + rows.affectedRows + " rows IN INVENTORY_LOG.");
                                    console.log("CHANGED " + rows.changedRows + " rows IN INVENTORY_LOG.");
                                })
                                connection.end();

                            });
                        });
                    });
                });
            });
        });
    });
});
