var mysql = require('mysql'),
    fs = require('fs');

var costOfSales = require('../js/COS.js'),


  connection.query('SELECT id, product_id, date, quantity, remaining, eacost from purchases ORDER BY date', function(err, purchases, fields) {
    if (err)  return next(err);
    var purchases = costOfSales.mapSQLPurchases(purchases);

          connection.query('SELECT id, date, product_id, quantity, price, revenue from sales WHERE quantity > 0 ORDER BY id', function(err, sales, fields) {
            if (err)  return next(err);
            var salesToUpdate = [],
                purchasesToUpdate = [];

            costOfSales.calcCOS(sales,purchases,salesToUpdate,purchasesToUpdate);

              connection.query("CREATE TEMPORARY TABLE if not exists purchases_temp(id int not null, remaining int not null)", function(err, rows){
                if (err)  return next(err);
                console.log("CREATED TEMP PURCHASES TABLE");

                  connection.query("INSERT INTO purchases_temp (id, remaining) VALUES ?", [purchasesToUpdate], function(err, rows){
                    if (err) return next(err);
                    console.log("INSERTED NEW REMAINING VALUES INTO PURCHASES_TEMP");
                    console.log("UPDATED "+rows.affectedRows+" rows IN PURCHASES_TEMP.");
                    console.log("CHANGED "+rows.changedRows+" rows IN PURCHASES_TEMP.");

                      var purchasesQuery = "UPDATE purchases AS dest, purchases_temp AS src SET dest.remaining = src.remaining WHERE dest.id = src.id";

                      connection.query(purchasesQuery, function(err, rows){
                        if (err)  return next(err);
                        console.log("SUCCESSFULLY UPDATED PURCHASES TABLE");
                        console.log("UPDATED "+rows.affectedRows+" rows IN PURCHASES.");
                        console.log("CHANGED "+rows.changedRows+" rows IN PURCHASES.");

                        connection.query("UPDATE sales SET profit_margin = revenue/profit", function(err, rows){
                          if (err) return next(err) ;
                          console.log("SET PROFIT MARGIN = REVENUE/PROFIT IN SALES");
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
