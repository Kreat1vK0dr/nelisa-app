const fs = require('fs');
const exec = require('child_process').exec;

    exports.show = function (req, res, next) {
        var context = req.session.context;
        req.services(function (err, services) {
            const dataService = services.categoryDataService;
            dataService.getAllCategories(function (err, result) {
                if (err) return next(err);
                context.no_categories = result.length === 0,
                    context.categories = result,

                    res.render('categories_home', context);
            });
        });
    };
    exports.search = function(req,res,next) {
                var clickedSearch = req.path==="/categories/search";

                var searchVal = clickedSearch ? req.body.search : req.params.search;
                var searchEmpty = clickedSearch ? searchVal==='' : searchVal==='0';
                var search = '%' + searchVal + '%';
                console.log("THIS IS SEARCHVAL: ", searchVal);
                console.log("THIS IS SEARCH: ", search);

                  req.services(function(err,services){
                    var dataService = services.productDataService;
                    if (searchEmpty) {
                      dataService.getAllCategories(function(err,data){
                        if (err) return next (err);
                        console.log("SEARCH IS EMPTY");
                        res.render("purchaseSearch", {purchases: data, layout: false});
                      });
                    } else {
                    dataService.searchCategories([search],function(err, data){
                      if (err) return next (err);
                      console.log("SEARCH IS NOT EMPTY");
                      res.render("purchaseSearch", {purchases: data, layout: false});
                    });
                  }
            });
    };

    exports.showAddPage = function (req, res) {
        res.render('categories_add');
    };

    exports.add = function (req, res, next) {
        req.services(function (err, services) {
            const dataService = services.categoryDataService;
            dataService.addCategory([req.body.description], function (err, rows) {
                if (err) return next(err);
                console.log('INSERTED %d ROW INTO CATEGORIES WITH NEW ID %d', rows.affectedRows, rows.insertId);
            });
        });
    };

    exports.get = function (req, res, next) {
        var context = req.session.context;
        req.services(function (err, services) {
            const dataService = services.categoryDataService;
            dataService.getCategory([req.params.id], function (err, result) {
                if (err) return next(err);
                context.category = result[0];
                res.render('categories_edit', context);
            });
        });
    };

    exports.update = function (req, res, next) {
        req.services(function (err, services) {
            const dataService = services.categoryDataService;
            dataService.updateCategory([req.body.description, req.body.id], function (err, rows) {
                if (err) return next(err);
                res.redirect('/categories');
            });
        });
    };

    exports.delete = function (req, res, next) {
        var id = req.params.id;
        req.services(function (err, services) {
            const dataService = services.categoryDataService;
            dataService.deleteCategory([id], function (err, result) {
                if (err) return next(err);
                console.log("DELETED CATEGORY WITH ID %d FROM CATEGORIES", id);
            });
        });
    };
