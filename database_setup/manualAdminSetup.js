var mysql = require('mysql'),
    bcrypt = require('bcrypt');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1amdan13l',
  database : 'nelisa_another_copy'
});

// create hash
const saltRounds = 12;
const adminPassword = '0nL7@6m!N';
const myPassword = '1amdan13l';
const myUsername = 'daniel';
const myRole = 'admin';
const myAdminType = 1;
const dateAdded = new Date();

bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(adminPassword, salt, function(err, hash) {
        // Store hash in your password DB.
        var data = {password: hash};
        connection.query("SELECT * FROM adminPass", function(err,result){
          if (err) throw err;
          if (result[0]) {

            connection.query("UPDATE adminPass SET ?", data, function(err,result){
              if (err) throw err;
            });
          } else {
        connection.query("INSERT INTO adminPass SET ?", data, function(err,result){
          if (err) throw err;
          console.log("INSERTED HASHED PASSWORD IN DATABASE");
          console.log("INSERTED HASHED PASSWORD: ", hash);
        });
      }
    });
});
});

bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(myPassword, salt, function(err, hash) {
        // Store hash in your password DB.
        var data = {username: myUsername, password: hash, role: myRole, admin_type: myAdminType, date_added: dateAdded};
        connection.query("INSERT INTO users SET ?", data, function(err,result){
          if (err) throw err;
          console.log("INSERTED HASHED PASSWORD IN DATABASE");
          console.log("INSERTED HASHED PASSWORD: ", hash);
        });
    });
});
