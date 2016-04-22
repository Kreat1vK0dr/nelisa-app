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
connection.query('SELECT id, product_id, date, quantity, remaining, eacost from purchases ORDER BY date', function (err, purchasesFromDB, fields) {
    if (err) throw err;
    var purchases = purchasesFromDB,
        salesToUpdate = [],
        purchasesToUpdate = [],
        inventoryLog = [];

    connection.query('SELECT * from sales WHERE quantity > 0 ORDER BY date', function (err, sales, fields) {
        if (err) throw err;

        costOfSales.initialCOSandInventoryLog(sales, purchases, salesToUpdate, purchasesToUpdate, inventoryLog);

        connection.query("CREATE TEMPORARY TABLE if not exists sales_temp(id int not null, cos decimal(10,2) not null, cant_sell int not null)", function (err, rows) {
            if (err) throw err;
            console.log("CREATED TEMP SALES TABLE");

            connection.query("CREATE TEMPORARY TABLE if not exists purchases_temp(id int not null, remaining int not null)", function (err, rows) {
                if (err) throw err;
                console.log("CREATED TEMP PURCHASES TABLE");

                connection.query("INSERT INTO sales_temp (id, cos, cant_sell) VALUES ?", [salesToUpdate], function (err, rows) {
                    if (err) throw err;
                    console.log("INSERTED CALCULATIONS INTO SALES_TEMP");
                    console.log("UPDATED " + rows.affectedRows + " rows IN SALES_TEMP.");
                    console.log("CHANGED " + rows.changedRows + " rows IN SALES_TEMP.");

                    connection.query("INSERT INTO purchases_temp (id, remaining) VALUES ?", [purchasesToUpdate], function (err, rows) {
                        if (err) throw err;
                        console.log("INSERTED NEW REMAINING VALUES INTO PURCHASES_TEMP", purchasesToUpdate);
                        console.log("UPDATED " + rows.affectedRows + " rows IN PURCHASES_TEMP.");
                        console.log("CHANGED " + rows.changedRows + " rows IN PURCHASES_TEMP.");

                        connection.query("UPDATE sales AS dest, sales_temp AS src SET dest.cos = src.cos, dest.cant_sell = src.cant_sell WHERE dest.id = src.id", function (err, rows) {
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

                                    connection.query("UPDATE products p INNER JOIN  (SELECT product_id, SUM(remaining) remaining FROM purchases GROUP BY product_id) i ON p.id = i.product_id SET p.inventory = i.remaining", function (err, inventory) {
                                        if (err) throw err;

                                        console.log("SUCCESSFULLY UPDATED PRODUCTS TO REFLECT INITIAL INVENTORY STATUS");
                                        console.log("UPDATED " + rows.affectedRows + " rows IN PRODUCTS.");
                                        console.log("CHANGED " + rows.changedRows + " rows IN PRODUCTS.");

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
});
