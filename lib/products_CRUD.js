module.exports = function() {

  this.show = function(req,res,next) {
              req.getConnection(function(err, connection) {
                connection.query("SELECT p.id p_id, p.description product, c.description category, c.id c_id FROM products p, categories c WHERE p.category_id = c.id", function(err, result){
                  if (err) return next(err);
                  var context = {
                                  no_products: result.length===0,
                                  products: result
                                };
                  res.render('products_home', context);
                });
              });

  };

  this.showAdd = function(req,res, next) {
                 req.getConnection(function(err, connection) {
                   connection.query("SELECT id description FROM categories", function(err, result){
                   if (err) return next(err);
                   console.log("RETRIEVED CATEGORY LIST FROM DATABASE");
                   res.render('products_add',{
                        no_category: result.length===0,
                        data: result
                   });
                 });
             });
  };

  this.add = function(req, res, next) {
             req.getConnection(function(err, connection){
             if (err) return next(err);
             data = {description: req.body.p_name, category_id: req.body.c_id};
             connection.query("INSERT INTO products SET ?",data, function(err, result){
              if (err) return next(err);
              console.log("ADDED %s TO PRODUCTS WITH ID %d",req.body.p_name, result.insertId);
              res.redirect("/admin/products");
             });
           });
  };

  this.update = function(req, res, next) {
                var input = {id: req.body.id,
                              description: req.body.name,
                              category_id: req.body.cat_id}

                req.getConnection(function(err, connection){
                  connection.query("UPDATE products SET description = ?, category_id = ? WHERE id = ?",input, function(err, result){
                    if (err) return next(err);
                    console.log("PRODUCT WITH ID %d NOW REFLECTS NAME = %s WITH CATEGORY ID= %s",req.body.id,req.body.cat_id);
                    res.redirect('/products');
                  });
                });
  };

  this.get = function(req,res,next) {
             req.getConnection(function(err, connection){
               connection.query("SELECT * FROM products WHERE id = ?",[req.params.id], function(err, product){
                 if (err) return next(err);
                 var product = product[0];
                 connection.query("SELECT * FROM categories",function(err, categories){
                   if (err) return next(err);
                   categories.selected = categories.id === product.category_id ? "selected" : "";
                   res.render('product_edit',{
                          product: result[0],
                          categories: categories
                   });
                 });
               });
             });
  }

this.delete = function(req,res,next){
              req.getConnection(function(err, connection){
                  connection.query("DELETE FROM products WHERE id = ?",[req.params.id], function(err, result){
                    if(err) return next(err);
                    console.log("DELETED %d ROW FROM PRODUCTS", result.changedRows);
                    res.redirect('/products');
                  });
              });
};

};
