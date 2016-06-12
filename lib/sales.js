var getSaleCalcs = require('./cost-of-sales');

function remainingAfterSale(product_id, quantity, inventoryData) {
    var inventory_before_sale = inventoryData.find(function (a) {
        return a.product_id === product_id;
    }).inventory;
    return inventory_before_sale - quantity;
}

exports.home = function(req,res,next) {
               var context = req.session.context;
               req.services(function(err,services){
                 var saleService = services.salesDataService;
                 saleService.getAllSalesDetails(function(err,sales){
                   if (err) return next(err);
                  //  console.log("THIS IS saleS" + data);
                  var data = sales.map(function(saleItem){
                    saleItem.profitMargin = ((saleItem.profit/saleItem.revenue)*100).toFixed(1);
                    saleItem.revenue = saleItem.revenue.toFixed(2);
                    saleItem.profit = saleItem.profit.toFixed(2);
                    saleItem.cost = saleItem.cost.toFixed(2);
                    return saleItem;});
                   context.sales = data;
                   res.render('sales',context);
                 });
               });
};

exports.search = function(req,res,next) {
            const searchVal = req.params.search;
            const search = '%' + searchVal + '%';
            const searchEmpty = searchVal==="0";
            console.log("THIS IS SEARCHVAL: ", searchVal);
            console.log("THIS IS SEARCH: ", search);
              req.services(function(err,services){
                const saleService = services.salesDataService;
                if (searchEmpty) {
                  saleService.getAllSalesDetails(function(err,data){
                    if (err) return next (err);
                    console.log("SEARCH IS EMPTY");
                    res.render("saleSearch", {sales: data, layout: false});
                  });
                } else {
                saleService.searchSalesDetails([search],function(err, sales){
                  if (err) return next (err);
                  console.log("SEARCH IS NOT EMPTY");
                  console.log(sales);
                  const data = sales.map(function(saleItem){
                    saleItem.profitMargin = ((saleItem.profit/saleItem.revenue)*100).toFixed(1);
                    saleItem.revenue = saleItem.revenue.toFixed(2);
                    saleItem.profit = saleItem.profit.toFixed(2);
                    saleItem.cost = saleItem.cost.toFixed(2);
                    return saleItem;});
                  res.render("saleSearch", {sales: data, layout: false});
                });
              }
        });
};

exports.addHome = function (req, res, next) {
        req.session.lastAttempt = 'addSale';
        var context = req.session.context;
        req.getConnection(function (err, connection) {
            connection.query("SELECT * FROM products", function (err, products) {
                if (err) return next(err);
                context.products = products;
                connection.query("SELECT * FROM categories", function (err, categories) {
                    if (err) return next(err);
                    context.categories = categories;
                    res.render("addSale_home", context);
                    console.log("RENDERED WITH CONTEXT ", context);
                });
            });
        });
};
// app.post('/data', function(req, res) {
//   var data = req.body;
//   var firstItem = JSON.parse(data.data)[0];
//   var array = firstItem.data;
//   console.log("data: ",array);
// 	console.log('body: ' + req.body);
// });
exports.execute = function (req, res, next) {
    // For some reason you have to first assign 'req.body' to a variable, AND THEN access the data.
        var dataFromPOST = req.body;
        var saleData = JSON.parse(dataFromPOST.data);
        var date = new Date(Date.now());
        var day = date.getDay() === 0 ? 6 : date.getDay() - 1,
            week = date.getDate() % 7 != 0 ? Math.floor(date.getDate() / 7) + 1 : Math.floor(date.getDate() / 7);

        var saleDetailsToAdd = [],
            productsToUpdate = [],
            firstTrack = saleData.length;

        console.log(saleData);

        req.getConnection(function (err, connection) {
            if (err) return next(err);
            console.log("GOING TO RUN THROUGH SALEDATA TO CHECK FOR ISSUES.");
            var allPurchasesToUpdate = [];

            saleData.forEach(function (item, index) {
                var p_id = item.data[0],
                    c_id = item.data[1],
                    p = item.data[2],
                    q = item.data[3],
                    inventory = item.data[4],
                    itemPurchasesToUpdateMap = new Map();
                var newInventory = inventory - q;
                console.log("RUNNING THROUGH SALE DATA. BUSY WITH ITEM ID ", item.itemId);

                saleDetailsToAdd.push([date, day, week, p_id, c_id, p, q]);
                productsToUpdate.push([p_id, newInventory]);
                connection.query('SELECT * FROM purchases WHERE product_id = ? ORDER BY date', [p_id], function (err, purchasesFromDB, fields) {
                    if (err) throw err;
                    console.log("There is enough left and now selecting from PURCHASES for product ", p_id);
                    var costOfSale = getSaleCalcs.getCostAndLogSaleAt(date, q, purchasesFromDB, itemPurchasesToUpdateMap);
                    itemPurchasesToUpdateMap.forEach(function (value, key) {
                        allPurchasesToUpdate.push([key, value]);
                    });

                    saleDetailsToAdd[index].push(costOfSale.cost);

                    firstTrack--;
                    if (firstTrack === 0) {
                        console.log("secondTrack is now finished");
                        var totQ = saleDetailsToAdd.reduce(function (sum, item) {
                                return sum += item[6];
                            }, 0),
                            sumTotal = saleDetailsToAdd.reduce(function (sum, item) {
                                return sum += item[6] * item[5]
                            }, 0),
                            totalCost = saleDetailsToAdd.reduce(function (sum, item) {
                                return sum += item[7]
                            }, 0);

                        var listOfProductIds = saleDetailsToAdd.map(function (item) {
                            return item[1];
                        });
                        var numberOfUniqueProducts = Array.from(new Set(listOfProductIds)).length;

                        var insertSale = {
                            date: date,
                            day: day,
                            week: week,
                            total_quantity: totQ,
                            unique_products: numberOfUniqueProducts,
                            sum_total: sumTotal,
                            total_cost: totalCost
                        };
                        console.log("saleDetailsToAdd: ", saleDetailsToAdd);
                        console.log("INSERT SALE: ", insertSale);
                        connection.query("INSERT INTO sales SET ?", insertSale, function (err, result) {
                            if (err) return next(err);
                            console.log("INSERTED SALE INTO SALES");
                            var saleId = result.insertId;
                            saleDetailsToAdd = saleDetailsToAdd.map(function (item) {
                                item.push(saleId);
                                return item;
                            });
                            console.log("ATTEMPTING TO INSERT INTO sales_details");
                            connection.query("INSERT INTO sales_details (date,day,week, product_id,category_id,price,quantity,cost, sale_id) VALUES ?", [saleDetailsToAdd], function (err, rows) {
                                if (err) throw err;
                                console.log("INSERTED ITEMS SOLD INTO SALES_DETAILS");
                                connection.query("CREATE TEMPORARY TABLE if not exists purchases_temp(id int not null, remaining int not null)", function (err, rows) {
                                    if (err) throw err;
                                    console.log("CREATED A TEMPORARY PURCHASES TABLE");
                                    console.log("ALL PURCHASES TO UPDATE: ", allPurchasesToUpdate);
                                    connection.query("INSERT INTO purchases_temp (id, remaining) VALUES ?", [allPurchasesToUpdate], function (err, rows) {
                                        if (err) throw err;
                                        console.log("INSERTED DATA INTO PURCHASES TEMP");
                                        connection.query("UPDATE purchases AS dest, purchases_temp AS src SET dest.remaining = src.remaining WHERE dest.id = src.id", function (err, rows) {
                                            if (err) throw err;
                                            console.log("UPDATED PURCHASES");
                                            console.log("GOING TO REDIRECT TO /ADMIN/SALES");
                                            connection.query("CREATE TEMPORARY TABLE if not exists products_temp(id int not null, inventory int not null)", function (err, rows) {
                                                if (err) throw err;
                                                connection.query("INSERT INTO products_temp (id, inventory) VALUES ?", [productsToUpdate], function (err, rows) {
                                                    if (err) throw err;
                                                    connection.query("UPDATE products AS dest, products_temp AS src SET dest.inventory = src.inventory WHERE dest.id = src.id", function (err, rows) {
                                                        if (err) throw err;
                                                        res.redirect('/sales/add');
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    }
                });
            });
        });
};
