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

  this.getAllUsers = function(cb) {
    getData("SELECT * FROM users", cb);
};

this.updateUser = function(data, cb) {
  insertData("UPDATE users SET username = ?, role = ?, admin_role = ? WHERE id = ?",data, cb);
};

this.updateUserLastLogin = function(data, cb) {
  insertData("UPDATE users SET last_login = NOW() WHERE id = ?",data, cb);
};

this.deleteUser = function(data, cb) {
  insertData("DELETE FROM users WHERE id = ?", cb);
};

};
