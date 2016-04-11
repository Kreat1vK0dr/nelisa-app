var mysql      = require('mysql');
var get = require('../js/get&map_data.js');
var fs = require('fs');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1amdan13l',
  database : 'nelisa_copy'
});

connection.connect();


// connection.query('SELECT * from categories', function(err, rows, fields) {
//   if (err) throw err;
//
//   var map = {};
//
//   rows.forEach(function(cat) {
//     map[cat.description] = cat.id;
//   });
//
//   var csv = fs.readFileSync("../product-list/product_categories.csv", "utf8");
//   var data = csv.split("\n").map(function(a){if(a!=="") {var b = a.split(","); return [b[0], map[b[1]]];}});
//   data.pop();
//   data.shift();
//   // console.log(data);
//
//
//   connection.query('INSERT INTO products (description, category_id) VALUES ?',[data], function(err, rows, fields){
//     if (err) throw err;
//     console.log("INSERTED "+rows.affectedRows+" ROWS.");
//   });
//
//   connection.end();
// });

// connection.query('SELECT supplier from purchases', function(err, rows, fields) {
//   if (err) throw err;
//
//   var suppliers = [];
//
//   rows.forEach(function(a){
//     if(suppliers.indexOf(a.supplier)===-1) {
//       suppliers.push(a.supplier);
//     }
//   });
//
//   suppliers = suppliers.map(function(a){return [a]});
//
//     connection.query('INSERT INTO suppliers (name) VALUES ?',[suppliers], function(err, rows, fields){
//       if (err) throw err;
//       console.log("INSERTED "+rows.affectedRows+" ROWS.");
//     });
//     connection.end();
// });
connection.query("UPDATE purchases SET remaining = quantity", function(err, rows){
  if (err) throw err;
  console.log("RESET REMAINING IN PURCHASES TO QUANTITY");
  console.log("UPDATED "+rows.affectedRows+" rows IN SALES_TEMP.");
  console.log("CHANGED "+rows.changedRows+" rows IN SALES_TEMP.");

connection.query('SELECT id, product_id, date, quantity, remaining, eacost from purchases ORDER BY date', function(err, purchases, fields) {
  if (err) throw err;
  var SQLpurchases = get.mapSQLPurchases(purchases);


        connection.query('SELECT id, date, product_id, quantity, price, revenue from sales WHERE quantity > 0 ORDER BY id', function(err, sales, fields) {
          if (err) throw err;
          var updateSales = [];
          var updatePurchases = [];

          sales.forEach(function(sale) {
            var profit, profitMargin, revenue, totalcost, quantity, inventory;
            var purchases = SQLpurchases.get(sale.product_id);
            var getinfo = get.SQLCostAndLogSaleAt(sale.date, sale.quantity, purchases, updatePurchases);

            totalcost = getinfo.cost;
            quantity = getinfo.quantity;
            inventory = get.SQLInventoryRemainingAt(sale.date, sale.product_id, SQLpurchases);

            if (quantity===0) {
                revenue = sale.quantity * sale.price;
              } else {
                revenue = (sale.quantity-quantity) * sale.price;
              }

            profit = revenue - totalcost;

            if (revenue>0) {
              profitMargin = profit/revenue;
            } else {
              profitMargin = 0;
            }

            updateSales.push([sale.id,revenue, totalcost, profit, profitMargin, inventory, quantity]);

          });

          connection.query("CREATE TEMPORARY TABLE if not exists sales_temp(id int not null, revenue decimal(10,2) not null, cost decimal(10,2) not null, profit decimal(10,2) not null, profit_margin decimal(10,2) not null, inv_rem int not null, q_rem int not null)", function(err, rows) {
            if (err) throw err;
            console.log("CREATED TEMP SALES TABLE");

            connection.query("CREATE TEMPORARY TABLE if not exists purchases_temp(id int not null, remaining int not null)", function(err, rows){
              if (err) throw err;
              console.log("CREATED TEMP PURCHASES TABLE");

              connection.query("INSERT INTO sales_temp (id, revenue, cost, profit, profit_margin, inv_rem, q_rem) VALUES ?", [updateSales], function(err, rows){
                // console.log("THIS IS SALES UPDATES", updateSales);
                // console.log("THIS IS PURCHASES UPDATES", updatePurchases);
                if (err) throw err;
                console.log("INSERTED CALCULATIONS INTO SALES_TEMP");
                console.log("UPDATED "+rows.affectedRows+" rows IN SALES_TEMP.");
                console.log("CHANGED "+rows.changedRows+" rows IN SALES_TEMP.");

                connection.query("INSERT INTO purchases_temp (id, remaining) VALUES ?", [updatePurchases], function(err, rows){
                  // console.log("THIS IS PURCHASES UPDATES", updatePurchases);
                  if (err) throw err;
                  console.log("INSERTED NEW REMAINING VALUES INTO PURCHASES_TEMP");
                  console.log("UPDATED "+rows.affectedRows+" rows IN PURCHASES_TEMP.");
                  console.log("CHANGED "+rows.changedRows+" rows IN PURCHASES_TEMP.");

                  var salesQuery = "UPDATE sales AS dest, sales_temp AS src SET dest.revenue = src.revenue, dest.cost = src.cost, dest.profit = src.profit, dest.profit_margin = src.profit_margin, dest.inv_rem = src.inv_rem, dest.q_cant_sell = src.q_rem WHERE dest.id = src.id";

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

                      connection.end();
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
