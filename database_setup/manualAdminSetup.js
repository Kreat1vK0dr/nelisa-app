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
const dateAdded = new Date(Date.now());

const myPassword = '1amdan13l';
const myUsername = 'daniel';
const myRole = 'admin';
const myAdminRole = 'superuser';

const nelisaPassword = '1amn3l1sa';
const nelisaUsername = 'nelisa';
const nelisaRole = 'admin';
const nelisaAdminRole = 'general';

const xolaniPassword = '1amx0lan1';
const xolaniUsername = 'xolani';
const xolaniRole = 'admin';
const xolaniAdminRole = 'superuser';

var initialUsers = [{username: myUsername, password: myPassword , role: myRole, admin_role: myAdminRole, date_added: dateAdded},
                   {username: nelisaUsername, password: nelisaPassword, role: nelisaRole, admin_role: nelisaAdminRole, date_added: dateAdded},
                   {username: xolaniUsername, password: xolaniPassword, role: xolaniRole, admin_role: xolaniAdminRole, date_added: dateAdded}
                  ];

initialUsers.forEach(function(user){
  bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
          // Store hash in your password DB.
          user.password = hash;
          connection.query("INSERT INTO users SET ?", user, function(err,result){
            if (err) throw err;
            console.log("INSERTED HASHED PASSWORD IN DATABASE");
            console.log("INSERTED HASHED PASSWORD: ", hash);
          });
      });
  });
});

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
