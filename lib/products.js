    exports.show = function (req, res, next) {
        if (!req.session.user) {
            context = {
                admin: false
            };
        } else {
            var context = req.session.context;
        }

        req.services(function (err, services) {
            const dataService = services.productDataService;
            dataService.getAllProducts(function (err, result) {
                if (err) return next(err);
                context.no_products = result.length === 0;
                context.products = result;
                res.render('products_home', context);
            });
        });
    };

    exports.search = function(req,res,next) {
                var clickedSearch = req.path==="/products/search";
                var searchEmpty;
                if (!req.session.user) {
                    context = {
                        admin: false
                    };
                } else {
                  var sessionContext = req.session.context;
                  var context = {
                      admin: sessionContext.admin,
                      superuser: sessionContext.superuser,
                      user: sessionContext.user
                    };
                }
                 if (clickedSearch){
                  console.log("CLICKED SEARCH");
                  var searchVal = req.body.search;
                  var searchByProduct = req.body.searchBy==="product";
                  var searchByCategory = req.body.searchBy==="category";
                  var searchAll = req.body.searchBy==="all";
                  searchEmpty = searchVal ==='';
                  console.log("searchVal: ", searchVal, "searchByProduct: ", searchByProduct, "searchByCategory", searchByCategory, "searchEmpty: ", searchEmpty);
                } else {
                  console.log("DID NOT CLICK SEARCH");
                  var searchVal = req.params.search;
                  var searchByProduct = req.params.searchBy==="product";
                  var searchByCategory = req.params.searchBy==="category";
                  var searchAll = req.params.searchBy==="all";
                  searchEmpty = searchVal==="0";
                  console.log("searchVal: ", searchVal, "searchByProduct: ", searchByProduct, "searchByCategory", searchByCategory, "searchEmpty: ", searchEmpty);
                }
                var search = '%' + searchVal + '%';
                console.log("THIS IS SEARCHVAL: ", searchVal);
                console.log("THIS IS SEARCH: ", search);

                  req.services(function(err,services){
                    var dataService = services.productDataService;
                    if (searchEmpty) {
                      dataService.getAllProducts(function(err,data){
                        if (err) return next (err);
                        console.log("SEARCH IS EMPTY");
                        context.products = data;
                        if (clickedSearch) {
                          res.render('products_home',context);
                        } else {
                          context.layout = false;
                        res.render("productSearch", context);
                      }

                    });
                  } else if (searchByProduct){
                    dataService.searchProductsByName([search],function(err, data){
                      if (err) return next (err);
                      console.log("SEARCH IS NOT EMPTY AND SEARCHING PRODUCTS BY NAME");
                      console.log("THIS IS DATA",data);
                      context.products = data;
                      if (clickedSearch) {
                        res.render('products_home',context);
                      } else {
                        context.layout = false;
                      res.render("productSearch", context);
                    }
                    });
                  } else if (searchByCategory) {
                    dataService.searchProductsByCategory([search],function(err, data){
                      if (err) return next (err);
                      console.log("SEARCH IS NOT EMPTY AND SEARCHING PRODUCTS BY CATEGORY");
                      context.products = data;
                      if (clickedSearch) {
                        res.render('products_home',context);
                      } else {
                        context.layout = false;
                      res.render("productSearch", context);
                    }
                    });
                  } else if (searchAll) {
                    dataService.searchProducts([search,search],function(err, data){
                      if (err) return next (err);
                      console.log("SEARCH IS NOT EMPTY AND SEARCHING PRODUCTS BY NAME & CATEGORY");
                      context.products = data;
                      if (clickedSearch) {
                        res.render('products_home',context);
                      } else {
                        context.layout = false;
                      res.render("productSearch", context);
                    }
                    });
                  }
              });
    };


    exports.showAddPage = function (req, res, next) {
      var context = req.session.context;
        req.services(function (err, service) {
            const dataService = service.categoryDataService;
            dataService.getAllCategories(function (err, result) {
                if (err) return next(err);
                console.log("RETRIEVED CATEGORY LIST FROM DATABASE");
                context.no_category = result.length === 0;
                context.categories = result;
                res.render('products_add', context);
            });
        });
    };

    exports.add = function (req, res, next) {
        const data = {
            description: req.body.p_name,
            category_id: req.body.c_id,
            price: req.body.price
        };
        req.service(function (err, service) {
            const dataService = service.productDataService;
            dataService.addProduct(data, function (err, result) {
                if (err) return next(err);
                console.log("ADDED %s TO PRODUCTS WITH ID %d", req.body.p_name, result.insertId);
                res.redirect('/products');
            });
        });
    };


    exports.get = function (req, res, next) {
      var context = req.session.context;
        req.services(function (err, services) {
            var dataService = services.productDataService;
            dataService.getProduct([req.params.id], function (err, product) {
                if (err) return next(err);
                var product = product[0];
                dataService = services.categoryDataService;
                dataService.getAllCategories(function (err, categories) {
                    if (err) return next(err);
                    categories.selected = categories.id === product.category_id ? "selected" : "";
                    console.log("categories.selected", categories.selected);
                    context.product = product;
                    context.categories = categories;
                    res.render('products_edit', context);
                });
            });
        });
    };

    exports.update = function (req, res, next) {
        var input = [req.body.description, req.body.category_id, req.body.price, req.body.id];

        req.service(function (err, services) {
            const dataService = services.productDataService;
            dataService.updateProducts(input, function (err, result) {
                if (err) return next(err);
                console.log("PRODUCT WITH ID %d NOW REFLECTS NAME = %s WITH CATEGORY ID= %d", req.body.id, req.body.description, req.body.category_id);
                res.redirect('/products');
            });
        });
    };

    exports.delete = function (req, res, next) {
        req.services(function (err, services) {
            const dataService = services.productDataServices;
            dataService.deleteProduct([req.params.id], function (err, result) {
                if (err) return next(err);
                console.log(err);
                console.log("DELETED %d ROW FROM PRODUCTS", result.changedRows);
                res.redirect('/products');
            });
        });
    };
