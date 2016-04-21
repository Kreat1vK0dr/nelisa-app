module.exports = function () {

    this.show = function (req, res, next) {
        req.getConnection(function (err, connection) {
            connection.query("SELECT * FROM categories", function (err, result) {
                if (err) return next(err);
                var context = {
                    no_categories: result.length === 0,
                    categories: result
                };
                res.render('categories_home', context);
            });
        });
    };

    this.showAdd = function (req, res) {
        res.render('categories_add');
    };

    this.add = function (req, res, next) {
        req.getConnection(function (err, connection) {
            connection.query('INSERT INTO categories (description) VALUES ?', [req.body.name], function (err, rows) {
                if (err) return next(err);
                console.log('INSERTED %d ROW INTO CATEGORIES WITH NEW ID %d', rows.affectedRows, rows.insertId);
            });
        });
    };

    this.get = function (req, res, next) {
        req.getConnection(function (err, connection) {
            connection.query('SELECT * FROM categories WHERE id = ?', [req.params.id], function (err, result) {
                if (err) return next(err);
                res.render('categories_edit', result[0]);
            });
        });
    };

    this.update = function (req, res, next) {
        req.getConnection(function (err, connection) {
            connection.query('UPDATE categories SET description = ? WHERE id = ?', [req.body.description, req.body.id], function (err, rows) {
                if (err) return next(err);
                res.redirect('/categories');
            });
        });
    };

    this.delete = function (req, res, next) {
        var id = req.params.id;
        req.getConnection(function (err, connection) {
            connection.query("DELETE FROM categories WHERE id = ?", [id], function (err, result) {
                if (err) return next(err);
                console.log("DELETED CATEGORY WITH ID %d FROM CATEGORIES", id);
            });
        });
    };
};
