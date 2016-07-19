var mysql = require('mysql'),
    bcrypt = require('bcrypt-nodejs');

    const url = process.env.MYSQL_URL!==undefined ? process.env.MYSQL_URL : 'mysql://root:1amdan13l@localhost/nelisa_another_copy';

          var connection = mysql.createConnection(url);


// create hash
const saltRounds = 12;
const adminPassword = '0nL7@6m!N';
const dateAdded = new Date(Date.now());

const myPassword = '1amdan13l';
const myUsername = 'daniel';
const myFirstName = 'Daniel';
const myLastName = 'Maartens';
const myEmail = 'daniel@projectcodex.co';
const myRole = 'admin';
const myAdminRole = 'superuser';

const nelisaPassword = '1amn3l1sa';
const nelisaUsername = 'nelisa';
const nelisaFirstName = 'Nelisa';
const nelisaLastName = 'Asilen';
const nelisaEmail = 'nelisa@spaza.co.za';
const nelisaRole = 'admin';
const nelisaAdminRole = 'general';

const xolaniPassword = '1amx0lan1';
const xolaniUsername = 'xolani';
const xolaniFirstName = 'Xolani';
const xolaniLastName = 'Inalox';
const xolaniEmail = 'xolani@spaza.co.za';
const xolaniRole = 'admin';
const xolaniAdminRole = 'superuser';

const nthabisengPassword = '1amnthabiseng';
const nthabisengUsername = 'nhthabiseng';
const nthabisengFirstName = 'Nthabiseng';
const nthabisengLastName = 'Gnesibahtn';
const nthabisengEmail = 'thabs@gmail.com';
const nthabisengRole = 'user';
const nthabisengAdminRole = null;

var initialUsers = [{username: myUsername, firstName: myFirstName, lastName: myLastName, email: myEmail, password: myPassword , role: myRole, admin_role: myAdminRole, date_added: dateAdded},
                   {username: nelisaUsername, firstName: nelisaFirstName, lastName: nelisaLastName, email: nelisaEmail , password: nelisaPassword, role: nelisaRole, admin_role: nelisaAdminRole, date_added: dateAdded},
                   {username: xolaniUsername, firstName: xolaniFirstName, lastName: xolaniLastName, email: xolaniEmail , password: xolaniPassword, role: xolaniRole, admin_role: xolaniAdminRole, date_added: dateAdded},
                   {username: nthabisengUsername, firstName: nthabisengFirstName, lastName: nthabisengLastName, email: nthabisengEmail, password: nthabisengPassword, role: nthabisengRole, admin_role: nthabisengAdminRole, date_added: dateAdded}
                  ];
var track = initialUsers.length;
initialUsers.forEach(function(user){
  bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
          // Store hash in your password DB.
          user.password = hash;
          connection.query("INSERT INTO users SET ?", user, function(err,result){
            if (err) throw err;
            console.log("INSERTED HASHED PASSWORD IN DATABASE");
            console.log("INSERTED HASHED PASSWORD: ", hash);
            track--;
            if (track===0) {
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
                        connection.end();
                      });
                    }
                  });
              });
              });
            }
          });
      });
  });
});
