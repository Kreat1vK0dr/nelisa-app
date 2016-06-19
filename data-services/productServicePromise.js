var Promise = require("bluebird");

function QueryExecutor(connection) {
    this.connection = connection;

    this.executeQuery = function(query){
        // data = data || [];
        return new Promise(function(accept, reject){
            connection.query( query, function(err, results){
              if (err){
                return reject(err)
              }
              accept(results);
            });
        });
    };
}

module.exports = function(connection){
  var queryExecutor = new QueryExecutor(connection);

  this.getAllProducts = function () {
     return queryExecutor.executeQuery("SELECT p.id p_id, p.description product, c.description category, c.id c_id, p.price, p.inventory FROM products p, categories c WHERE p.category_id = c.id ORDER BY p.id");
  };
};
