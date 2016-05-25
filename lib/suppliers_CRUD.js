

    exports.show = function (req, res, next) {
        req.getConnection(function (err, connection) {
            connection.query("SELECT * FROM suppliers", function (err, result) {
                if (err) return next(err);
                var context = {
                    no_suppliers: result.length === 0,
                    suppliers: result,
                    layout: 'admin'
                };
                res.render('suppliers_home', context);
            });
        });
    };

    exports.showAdd = function (req, res) {
        res.render('suppliers_add');
    };

    exports.add = function (req, res, next) {
        req.getConnection(function (err, connection) {
            connection.query('INSERT INTO suppliers (name) VALUES ?', [req.body.name], function (err, rows) {
                if (err) return next(err);
                console.log('INSERTED %d ROW INTO SUPPLIERS WITH NEW ID %d', rows.affectedRows, rows.insertId);
            });
        });
    };

    exports.get = function (req, res, next) {
        req.getConnection(function (err, connection) {
            connection.query('SELECT * FROM suppliers WHERE id = ?', [req.params.id], function (err, result) {
                if (err) return next(err);
                res.render('suppliers_edit', result[0]);
            });
        });
    };

    exports.update = function (req, res, next) {
        req.getConnection(function (err, connection) {
            connection.query('UPDATE suppliers SET name = ? WHERE id = ?', [req.body.name, req.body.id], function (err, rows) {
                if (err) return next(err);
                res.redirect('/suppliers');
            });
        });
    };

    exports.delete = function (req, res, next) {
        var id = req.params.id;
        req.getConnection(function (err, connection) {
            connection.query("DELETE FROM suppliers WHERE id = ?", [id], function (err, result) {
                if (err) return next(err);
                console.log("DELETED CATEGORY WITH ID %d FROM SUPPLIERS", id);
            });
        });
    };
