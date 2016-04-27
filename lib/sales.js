var getSaleCalcs = require('./cost-of-sales');

function remainingAfterSale(product_id, quantity, inventoryData) {
    var inventory_before_sale = inventoryData.find(function (a) {
        return a.product_id === product_id;
    }).inventory;
    return inventory_before_sale - quantity;
}

exports.home = function (req, res, next) {
    var context = {};
    req.getConnection(function (err, connection) {
        connection.query("SELECT * FROM products", function (err, products) {
            if (err) return next(err);
            context.products = products;
            connection.query("SELECT * FROM categories", function (err, categories) {
              context.categories = categories;
                // connection.query("SELECT * FROM categories", function (err, categories) {
                //     if (err) return next(err);
                //     context.categories = categories;
                res.render("sales_home", context);
            });

        });
    });
};

exports.execute = function (req, res, next) {
    var p_id = Number(req.body.product_id),
        c_id = Number(req.body.category_id),
        q = Number(req.body.quantity),
        p = Number(req.body.price),
        context = {};
    req.getConnection(function (err, connection) {
        connection.query("SELECT inventory FROM products WHERE product_id = ?", [p_id], function (err, result) {
            if (err) return next(err);
            var inv_bef_sale = Number(result[0]);
            var inv_after_sale = inv_bef_sale - q;
            if (inv_after_sale < 0) {
                context.no_sale = {
                    remaining: inv_bef_sale,
                    cant_sell: Math.abs(inv_after_sale)
                };
                res.render('sales_home', context);
            } else {
                connection.query('SELECT * FROM purchases WHERE product_id = ? ORDER BY date', [p_id], function (err, purchasesFromDB, fields) {
                    if (err) throw err;
                    var purchasesToUpdate = [];
                    var costOfSale = getCostAndLogSaleAt(date, quantity, purchasesFromDB, purchasesToUpdate);
                    var track = purchasesToUpdate.length;
                    purchasesToUpdate.forEach(function (update) {

                        connection.query('UPDATE purchases SET remaining = ? WHERE product_id = ?', update, function (err, rows) {
                            if (err) return next(err);
                            --track;
                            if (track === 0) {
                                connection.query("INSERT INTO sales (product_id,category_id,quantity,price,cost) VALUES ?", [p_id, c_id, q, p, costOfSale], function (err, rows) {
                                    if (err) return next(err);
                                    console.log("SUCCESSFULLY EXECUTED SALE");
                                    res.redirect('/admin/sales');
                                });
                            }

                        });
                    });
                });
            }
        });
    });

};
