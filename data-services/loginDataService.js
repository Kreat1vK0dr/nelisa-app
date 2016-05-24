module.exports = function(connection) {

  var getData = function(query, cb){
        connection.query( query, cb);
    };

    var insertData = function(query, data, cb){
        connection.query(query, data, cb);
    };

  this.getUsername = function(cb) {
    getData("SELECT username FROM users", cb);
};
