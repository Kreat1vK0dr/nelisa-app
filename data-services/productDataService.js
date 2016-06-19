var Promise = require('bluebird')

// Promise.promisify(connection.query, connection)('SELECT 1').then(function (rows) {
//   console.log('got rows!')
//   console.dir(rows)
//   connection.end()
// })

module.exports = function(connection) {

  // var getAllData = function(query, cb){
  //       Promise.promisify(connection.query, connection)( query).then(cb);
  //   };
  var getAllData = function(query, cb){
        connection.query( query, cb);
    };

  var getData = function(query, data, cb){
        connection.query( query, data, cb);
    };

    var changeData = function(query, data, cb){
        connection.query(query, data, cb);
    };

    var bulkUpdate = function(queryCreate,queryInsert,queryUpdate, data, cb) {
      connection.query(queryCreate, function(err,result){
        if (err) throw err;
        connection.query(queryInsert, data, function(err, result){
          if (err) throw err;
          connection.query(queryUpdate, cb);
        });
      });
    };

  this.getProduct = function(data, cb) {
    getData("SELECT * FROM products WHERE id = ?",data, cb);
};

  this.getAllProducts = function(cb) {
    getAllData("SELECT p.id p_id, p.description product, c.description category, c.id c_id, p.price, p.inventory FROM products p, categories c WHERE p.category_id = c.id ORDER BY p.id", cb);
};

  this.deleteProduct = function(data, cb) {
    changeData("DELETE FROM products WHERE id = ?", data, cb);
  };
  this.addProduct = function(data, cb) {
    changeData("INSERT INTO products SET ?", data,cb);
  };
this.productsBulkUpdate = function(data,cb){
  const queryCreate = "CREATE TEMPORARY TABLE if not exists products_temp(id int not null, inventory int not null)",
        queryInsert = "INSERT INTO products_temp (id, inventory) VALUES ?",
        queryUpdate = "UPDATE products AS dest, products_temp AS src SET dest.inventory = src.inventory WHERE dest.id = src.id";

  bulkUpdate(queryCreate,queryInsert,queryUpdate, data, cb);
};

this.updateProducts = function(data, cb) {
  changeData("UPDATE products SET description = ?, category_id = ?, price = ? WHERE id = ?",data,cb);
};
  this.searchProductsByName = function (data, cb) {
        getData('SELECT p.id p_id, c.id c_id, p.description product, c.description category, p.price, p.inventory FROM products p, categories c WHERE p.category_id = c.id AND p.description LIKE ? ORDER BY p.id', data, cb);
    };

  this.searchProductsByCategory = function (data, cb) {
        getData('SELECT p.id p_id, c.id c_id, p.description product, c.description category, p.price, p.inventory FROM products p, categories c WHERE p.category_id = c.id AND c.description LIKE ? ORDER BY p.id', data, cb);
    };
  this.searchProducts = function (data, cb) {
        getData('SELECT * FROM (SELECT p.id p_id, c.id c_id, p.description product, c.description category, p.price, p.inventory FROM products p, categories c WHERE p.category_id = c.id) t WHERE t.category LIKE ? OR t.product LIKE ? ORDER BY t.p_id', data, cb);
    };
};
