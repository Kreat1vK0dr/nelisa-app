module.exports = function(connection) {

  var getAllData = function(query, cb){
        connection.query( query, cb);
    };
  var getData = function(query, data, cb){
        connection.query( query, data, cb);
    };

    var insertData = function(query, data, cb){
        connection.query(query, data, cb);
    };

  this.getUser = function(data, cb) {
    getData("SELECT * FROM users WHERE username = ?",data, cb);
};

};
