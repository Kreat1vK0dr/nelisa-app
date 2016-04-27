module.exports = function () {

    this.show = function (req, res, next) {
        req.getConnection(function (err, connection) {
            connection.query("SELECT p.id p_id, p.description product, c.description category, c.id c_id, p.price price FROM products p, categories c WHERE p.category_id = c.id", function (err, result) {
                if (err) return next(err);
                var context = {
                    no_products: result.length === 0,
                    products: result
                };
                res.render('products_home', context);
            });
        });

    };

    this.showAdd = function (req, res, next) {
        req.getConnection(function (err, connection) {
            connection.query("SELECT * FROM categories", function (err, result) {
                if (err) return next(err);
                console.log("RETRIEVED CATEGORY LIST FROM DATABASE");
                res.render('products_add', {
                    no_category: result.length === 0,
                    categories: result
                });
            });
        });
    };

    this.add = function (req, res, next) {
        req.getConnection(function (err, connection) {
            if (err) return next(err);
            data = {
                description: req.body.p_name,
                category_id: req.body.c_id,
                price: req.body.price
            };
            connection.query("INSERT INTO products SET ?", data, function (err, result) {
                if (err) return next(err);
                console.log("ADDED %s TO PRODUCTS WITH ID %d", req.body.p_name, result.insertId);
            });
        });
    };


    this.get = function (req, res, next) {
        req.getConnection(function (err, connection) {
            connection.query("SELECT * FROM products WHERE id = ?", [req.params.id], function (err, product) {
                if (err) return next(err);
                var product = product[0];
                connection.query("SELECT * FROM categories", function (err, categories) {
                    if (err) return next(err);
                    categories.selected = categories.id === product.category_id ? "selected" : "";
                    res.render('products_edit', {
                        product: product,
                        categories: categories
                    });
                });
            });
        });
    };

    this.update = function (req, res, next) {
        var input = [req.body.description, req.body.category_id, req.body.price, req.body.id];

        req.getConnection(function (err, connection) {
            connection.query("UPDATE products SET description = ?, category_id = ?, price = ? WHERE id = ?", input, function (err, result) {
                if (err) return next(err);
                console.log("PRODUCT WITH ID %d NOW REFLECTS NAME = %s WITH CATEGORY ID= %d", req.body.id, req.body.description, req.body.category_id);
                res.redirect('/products');
            });
        });
    };

    this.delete = function (req, res, next) {
        req.getConnection(function (err, connection) {
            connection.query("DELETE FROM products WHERE id = ?", [req.params.id], function (err, result) {
                if (err) return next(err);
                console.log(err);
                console.log("DELETED %d ROW FROM PRODUCTS", result.changedRows);
                res.redirect('/products');
            });
        });
    };

};
