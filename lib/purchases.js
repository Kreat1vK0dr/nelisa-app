exports.show = function(req,res,next) {
               var context = req.session.context;
               req.services(function(err,services){
                 var purchaseService = services.purchasesDataService;
                 purchaseService.getAllPurchases(function(err,data){
                   if (err) return next(err);
                  //  console.log("THIS IS PURCHASES" + data);
                   context.purchases = data;
                   res.render('purchases',context);
                 });
               });
};

exports.search = function(req,res,next) {
  var clickedSearch = req.path==="/purchases/search";
  var searchEmpty,
      context = req.session.context;
  if (clickedSearch){
    var searchVal = req.body.search;
    var searchByProduct = req.body.searchBy==="product";
    var searchByCategory = req.body.searchBy==="category";
    var searchAll = req.body.searchBy==="all";
    searchEmpty = searchVal ==='';
  } else {
    var searchVal = req.params.search;
    var searchByProduct = req.params.searchBy==="product";
    var searchByCategory = req.params.searchBy==="category";
    var searchAll = req.params.searchBy==="all";
    searchEmpty = searchVal==="0";
  }
    var search = '%' + searchVal + '%';
    console.log("THIS IS SEARCHVAL: ", searchVal);
    console.log("THIS IS SEARCH: ", search);
              req.services(function(err,services){
                var purchaseService = services.purchasesDataService;
                if (searchEmpty) {
                  purchaseService.getAllPurchases(function(err,data){
                    if (err) return next (err);
                    console.log("SEARCH IS EMPTY");
                    if (clickedSearch) {
                      context.purchases = data;
                      res.render('purchases', context);
                    } else {
                    res.render("purchaseSearch", {purchases: data, layout: false});
                  }
                  });
                } else if (searchByProduct){
                purchaseService.searchPurchaseByProduct([search],function(err, data){
                  if (err) return next (err);
                  console.log("SEARCH IS NOT EMPTY & SEARCHING PURCHASES BY PRODUCT");
                  if (clickedSearch) {
                    context.purchases = data;
                    res.render('purchases', context);
                  } else {
                  res.render("purchaseSearch", {purchases: data, layout: false});
                }
                });
              } else if (searchByCategory){
                purchaseService.searchPurchaseByCategory([search],function(err, data){
                  if (err) return next (err);
                  console.log("SEARCH IS NOT EMPTY & SEARCHING PURCHASES BY CATEGORY");
                  if (clickedSearch) {
                    context.purchases = data;
                    res.render('purchases', context);
                  } else {
                  res.render("purchaseSearch", {purchases: data, layout: false});
                }
                });
              } else if (searchAll) {
                purchaseService.searchPurchases([search,search],function(err, data){
                  if (err) return next (err);
                  console.log("SEARCH IS NOT EMPTY & SEARCHING PURCHASES BY PRODUCT & CATEGORY");
                  if (clickedSearch) {
                    context.purchases = data;
                    res.render('purchases', context);
                  } else {
                  res.render("purchaseSearch", {purchases: data, layout: false});
                }
                });
              }
        });
};

exports.showAddPage = function (req, res, next) {
        req.session.lastAttempt = 'addPurchase';
        var user = req.session.user.username;
        var context = req.session.context;

        req.getConnection(function (err, connection) {
            connection.query("SELECT * FROM products", function (err, products) {
                if (err) return next(err);
                context.products = products;
                connection.query("SELECT * FROM categories", function (err, categories) {
                    if (err) return next(err);
                    context.categories = categories;
                    connection.query("SELECT * FROM suppliers", function (err, suppliers) {
                        if (err) return next(err);
                        context.suppliers = suppliers;
                        res.render("addPurchase_home", context);
                        console.log("RENDERED WITH CONTEXT ", context);
                    });
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
exports.add = function (req, res, next) {
    // For some reason you have to first assign 'req.body' to a variable, AND THEN access the data when using $.post.
    if (!req.session.user) {
        req.session.expired = true;
        req.session.lastAttempt = 'addPurchase';
        res.redirect('/admin/login');
    } else {
        var dataFromPOST = req.body;
        var purchaseData = JSON.parse(dataFromPOST.data);
        var date = new Date(Date.now());
        var day = date.getDay() === 0 ? 6 : date.getDay() - 1,
            week = date.getDate() % 7 != 0 ? Math.floor(date.getDate() / 7) + 1 : Math.floor(date.getDate() / 7);

        var purchasesToAdd = [],
            productsToUpdate = [],
            firstTrack = purchaseData.length;

        console.log(purchaseData);

        req.getConnection(function (err, connection) {
            if (err) return next(err);

            purchaseData.forEach(function (item, index) {
                var supplier_id = item.data[0],
                    product_id = item.data[1],
                    category_id = item.data[2],
                    unitCost = item.data[3],
                    quantity = item.data[4],
                    inventory = item.data[5];

                var newInventory = inventory + quantity;

                console.log("RUNNING THROUGH PURCHASE DATA. BUSY WITH ITEM ID ", item.itemId);

                purchasesToAdd.push([date, supplier_id, product_id, category_id, quantity, quantity, unitCost]);

                productsToUpdate.push([product_id, newInventory]);

                firstTrack--;
                if (firstTrack === 0) {
                    console.log("firstTrack is now finished");

                    console.log("purchasesToAdd: ", purchasesToAdd);

                    console.log("ATTEMPTING TO BULK INSERT INTO purchases");

                    connection.query("INSERT INTO purchases (date,supplier_id, product_id, category_id,quantity,remaining,unitcost) VALUES ?", [purchasesToAdd], function (err, rows) {
                        if (err) throw err;

                        console.log("INSERTED ITEMS PURCHASED INTO PURCHASES");

                        connection.query("CREATE TEMPORARY TABLE if not exists products_temp(id int not null, inventory int not null)", function (err, rows) {
                            if (err) throw err;
                            connection.query("INSERT INTO products_temp(id, inventory) VALUES ?", [productsToUpdate], function (err, rows) {
                                if (err) throw err;
                                connection.query("UPDATE products AS dest, products_temp AS src SET dest.inventory = src.inventory WHERE dest.id = src.id", function (err, rows) {
                                    if (err) throw err;
                                    console.log("UPDATED " + rows.affectedRows + " rows IN PRODUCTS");
                                    res.redirect('/purchases/add');
                                });
                            });
                        });
                    });
                }
            });
        });
    }
};
