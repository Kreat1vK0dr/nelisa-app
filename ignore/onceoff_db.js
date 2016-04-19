var mysql = require('mysql'),
    fs = require('fs');

var costOfSales = require('../js/costOfSales.js'),


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1amdan13l',
  database : 'nelisa_copy'
});

connection.connect();

connection.query("UPDATE purchases SET remaining = quantity", function(err, rows){
  if (err) throw err;
  console.log("RESET REMAINING IN PURCHASES TO QUANTITY");
  console.log("UPDATED "+rows.affectedRows+" rows IN SALES_TEMP.");
  console.log("CHANGED "+rows.changedRows+" rows IN SALES_TEMP.");

connection.query('SELECT id, product_id, date, quantity, remaining, eacost from purchases ORDER BY date', function(err, purchases, fields) {
  if (err) throw err;
  var purchasesFromDatabase = purchases;

        connection.query('SELECT id, date, product_id, quantity, price, revenue from sales WHERE quantity > 0 ORDER BY id', function(err, sales, fields) {
          if (err) throw err;
          var salesToUpdate = [],
              purchasesToUpdate = [],
              inventoryLog = [];

          costOfSales.getCOSandLogInventory(salesFromDatabase,purchasesFromDatabase,salesToUpdate,purchasesToUpdate, inventoryLog);

          connection.query("CREATE TEMPORARY TABLE if not exists sales_temp(id int not null, revenue decimal(10,2) not null, cost decimal(10,2) not null, profit decimal(10,2) not null, inv_rem int not null, q_rem int not null)", function(err, rows) {
            if (err) throw err;
            console.log("CREATED TEMP SALES TABLE");

            connection.query("CREATE TEMPORARY TABLE if not exists purchases_temp(id int not null, remaining int not null)", function(err, rows){
              if (err) throw err;
              console.log("CREATED TEMP PURCHASES TABLE");

              connection.query("INSERT INTO sales_temp (id, revenue, cost, profit, inv_rem, q_rem) VALUES ?", [salesToUpdate], function(err, rows){
                // console.log("THIS IS SALES UPDATES", updateSales);
                // console.log("THIS IS PURCHASES UPDATES", updatePurchases);
                if (err) throw err;
                console.log("INSERTED CALCULATIONS INTO SALES_TEMP");
                console.log("UPDATED "+rows.affectedRows+" rows IN SALES_TEMP.");
                console.log("CHANGED "+rows.changedRows+" rows IN SALES_TEMP.");

                connection.query("INSERT INTO purchases_temp (id, remaining) VALUES ?", [purchasesToUpdate], function(err, rows){
                  // console.log("THIS IS PURCHASES UPDATES", updatePurchases);
                  if (err) throw err;
                  console.log("INSERTED NEW REMAINING VALUES INTO PURCHASES_TEMP");
                  console.log("UPDATED "+rows.affectedRows+" rows IN PURCHASES_TEMP.");
                  console.log("CHANGED "+rows.changedRows+" rows IN PURCHASES_TEMP.");

                  var salesQuery = "UPDATE sales AS dest, sales_temp AS src SET dest.revenue = src.revenue, dest.cost = src.cost, dest.profit = src.profit, dest.inv_rem = src.inv_rem, dest.q_cant_sell = src.q_rem WHERE dest.id = src.id";

                  connection.query(salesQuery, function(err, rows){
                    if (err) throw err;
                    console.log("SUCCESSFULLY UPDATED SALES TABLE");
                    console.log("UPDATED "+rows.affectedRows+" rows IN SALES.");
                    console.log("CHANGED "+rows.changedRows+" rows IN SALES.");

                    var purchasesQuery = "UPDATE purchases AS dest, purchases_temp AS src SET dest.remaining = src.remaining WHERE dest.id = src.id";

                    connection.query(purchasesQuery, function(err, rows){
                      if (err) throw err;
                      console.log("SUCCESSFULLY UPDATED PURCHASES TABLE");
                      console.log("UPDATED "+rows.affectedRows+" rows IN PURCHASES.");
                      console.log("CHANGED "+rows.changedRows+" rows IN PURCHASES.");

                      connection.query("UPDATE sales SET profit_margin = revenue/profit", function(err, rows){
                        if (err) throw err;
                        console.log("SET PROFIT MARGIN = REVENUE/PROFIT IN SALES");

                        connection.query(inventoryQuery, [inventoryLog], function(err, rows){
                          if (err) throw err;
                          console.log("SUCCESSFULLY UPDATED INVENTORY_LOG TABLE");
                          console.log("UPDATED "+rows.affectedRows+" rows IN INVENTORY_LOG.");
                          console.log("CHANGED "+rows.changedRows+" rows IN INVENTORY_LOG.");
                        })
                        connection.end();

                  });
                });
              });
            });
          });
        });
      });
      // connection.end();
    });
  });

});
