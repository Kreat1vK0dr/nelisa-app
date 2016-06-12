module.exports = function(connection) {

  var getAllData = function(query, cb){
        connection.query( query, cb);
    };

  var getData = function(query, data, cb){
        connection.query( query, data, cb);
    };

    var changeData = function(query, data, cb){
        connection.query(query, data, cb);
    };

  this.getUser = function(data, cb) {
    getData("SELECT * FROM users WHERE username = ?",data, cb);
};

  this.getAllUsers = function(cb) {
    getData("SELECT id, username, role, admin_role, DATE_FORMAT(date_added, '%b %a %d %Y %h:%i %p') as dateAdded, DATE_FORMAT(last_login, '%b %a %d %Y %h:%i %p') as lastLogin FROM users", cb);
};

  this.updateUser = function(data, cb) {
    changeData("UPDATE users SET username = ?, role = ?, admin_role = ? WHERE id = ?",data, cb);
  };

  this.updateUserLastLogin = function(data, cb) {
    changeData("UPDATE users SET last_login = NOW() WHERE id = ?",data, cb);
  };

  this.deleteUser = function(data, cb) {
    changeData("DELETE FROM users WHERE id = ?", data, cb);
  };

  this.addUser = function(data, cb) {
    changeData("INSERT INTO users SET ?", data,cb);
  };

};
