var bcrypt = require('bcrypt');

exports.adminDialogue = function(req,res) {
                   res.render('admin-login');
};

exports.userDialogue = function(req,res) {
                   res.render('admin-login');
};

exports.checkBeforeLogIn = function(req,res,next){
  req.services(function(err, services){
    var
  });
  });
};
// // create hash
// bcrypt.genSalt(saltRounds, function(err, salt) {
//     bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
//         // Store hash in your password DB.
//     });
// });
// // Load hash from your password DB.
// bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
//     // res == true
// });
