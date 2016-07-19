var mysql = require('mysql'),
    bcrypt = require('bcrypt-nodejs');

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

const password = '1amnthabiseng';
const username = 'nthabiseng';
const role = 'user';
const adminRole = null;

var user = {
  username: username,
  password: password ,
  role: role,
  admin_role: adminRole,
  date_added: dateAdded
};

bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {

        user.password = hash;
        connection.query("INSERT INTO users SET ?", user, function(err,result){
          if (err) throw err;
          console.log("INSERTED HASHED PASSWORD IN DATABASE");
          console.log("INSERTED HASHED PASSWORD: ", hash);
        });
    });
});
