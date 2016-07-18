var getSaleCalcs = require('./cost-of-sales'),
    Promise = require('bluebird'),
    co = require('co');

function remainingAfterSale(product_id, quantity, inventoryData) {
    var inventory_before_sale = inventoryData.find(function (a) {
        return a.product_id === product_id;
    }).inventory;
    return inventory_before_sale - quantity;
}

function prepareNumbersForDisplay(sales) {
    var data = sales.map(function (saleItem) {
        saleItem.profitMargin = ((saleItem.profit / saleItem.revenue) * 100).toFixed(1);
        saleItem.revenue = saleItem.revenue.toFixed(2);
        saleItem.profit = saleItem.profit.toFixed(2);
        saleItem.cost = saleItem.cost.toFixed(2);
        return saleItem;
    });
    return data;
}

exports.home = function (req, res, next) {
    var context = req.session.context;
    req.services(function (err, services) {
        var saleService = services.salesDataService;
        co(function* (){
            try{
                var sales = yield saleService.getAllSalesDetails();
                var data = prepareNumbersForDisplay(sales);
                context.sales = data;
                res.render('sales', context);
            }
            catch(err){
                next(err);
            }
        });
    });
};

exports.search = function (req, res, next) {
    var clickedSearch = req.path === "/sales/search";
    var searchEmpty,
        searchVal,
        searchByProduct,
        searchByCategory,
        searchAll,
        context = req.session.context;

    if (clickedSearch) {
         searchVal = req.body.search;
         searchByProduct = req.body.searchBy === "product";
         searchByCategory = req.body.searchBy === "category";
         searchAll = req.body.searchBy === "all";
        searchEmpty = searchVal === '';
    } else {
         searchVal = req.params.search;
         searchByProduct = req.params.searchBy === "product";
         searchByCategory = req.params.searchBy === "category";
         searchAll = req.params.searchBy === "all";
        searchEmpty = searchVal === "0";
    }
    var search = '%' + searchVal + '%';
    console.log("THIS IS SEARCHVAL: ", searchVal);
    console.log("THIS IS SEARCH: ", search);
    req.services(function (err, services) {
        const saleService = services.salesDataService;
        if (searchEmpty) {
          co(function* (){
              try{
                  var sales = yield saleService.getAllSalesDetails();
                   console.log("SEARCH IS EMPTY");
                    var data = prepareNumbersForDisplay(sales);
                    res.render("saleSearch", {
                        sales: data,
                        layout: false
                    });

              }
              catch(err){
                  next(err);
              }
          });
        } else if (searchByProduct) {
          co(function* (){
              try{
                  var sales = yield saleService.searchSalesDetailsByProduct([search]);

                  console.log("SEARCH IS NOT EMPTY & SEARCHING SALES BY PRODUCT");
                          console.log(sales);
                          const data = prepareNumbersForDisplay(sales);
                          if (clickedSearch) {
                              context.sales = sales;
                              res.render("sales", context);
                          } else {
                              res.render("saleSearch", {
                                  sales: data,
                                  layout: false
                              });
                          }
              }
              catch(err){
                  next(err);
              }
          });
        } else if (searchByCategory) {
          co(function* (){
              try{
                  var sales = yield saleService.searchSalesDetailsByCategory([search]);
                  console.log("SEARCH IS NOT EMPTY & SEARCHING SALES BY CATEGORY");
                  console.log(sales);
                  const data = prepareNumbersForDisplay(sales);
                  if (clickedSearch) {
                      context.sales = sales;
                      res.render("sales", context);
                  } else {
                      res.render("saleSearch", {
                          sales: data,
                          layout: false
                      });
                  }
            }
              catch(err){
                  next(err);
              }
          });
        } else if (searchAll) {
          co(function* (){
              try{
                  var sales = yield saleService.searchSalesDetails([search, search]);
                  console.log("SEARCH IS NOT EMPTY & SEARCHING SALES BY PRODUCT & CATEGORY");
                  console.log(sales);
                  const data = prepareNumbersForDisplay(sales);
                  if (clickedSearch) {
                      context.sales = sales;
                      res.render("sales", context);
                  } else {
                      res.render("saleSearch", {
                          sales: data,
                          layout: false
                      });
                  }

        }
              catch(err){
                  next(err);
              }
          });
        }
    });
};

exports.showAddPage = function (req, res, next) {
    req.session.lastAttempt = 'addSale';
    var context = req.session.context;
    req.services(function (err, services) {
        var dataService = services.productDataService;
        dataService.getAllProducts(function (err, products) {
            if (err) return next(err);
            context.products = products;
            dataService = services.categoryDataService;
            dataService.getAllCategories(function (err, categories) {
                if (err) return next(err);
                context.categories = categories;
                res.render("addSale_home", context);
                console.log("RENDERED WITH CONTEXT ", context);
            });
        });
    });
};

exports.add = function (req, res, next) {
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

    req.services(function (err, services) {
        if (err) return next(err);
        var dataService;
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
            dataService = services.purchasesDataService;
            dataService.getPurchasesByProduct([p_id], function (err, purchasesFromDB) {
                if (err) return next(err);
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
                        return item[3];
                    });
                    console.log("listofproductids", listOfProductIds);
                    console.log("new set of productsIds", new Set(listOfProductIds));
                    console.log("array from new set", Array.from(new Set(listOfProductIds)));
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
                    dataService = services.salesDataService;
                    co(function* (){
                        try{
                            var rows = yield dataService.addSaleAndDetails(insertSale, saleDetailsToAdd);
                            console.log("INSERTED SALE INTO SALES AND %d ROWS INTO SALE DETAILS", rows.affectedRows);

              }
                        catch(err){
                            next(err);
                        }
                    });

                    dataService = services.purchasesDataService;
                    dataService.purchasesBulkUpdate([allPurchasesToUpdate], function (err, rows) {
                        if (err) return next(err);
                        console.log("UPDATED PURCHASES");
                        console.log("GOING TO REDIRECT TO /ADMIN/SALES");
                        dataService = services.productDataService;
                        dataService.productsBulkUpdate([productsToUpdate], function (err, rows) {
                            if (err) return next(err);
                            res.redirect('/sales/add');
                        });
                    });
                }
            });
        });
    });
};
