var bcrypt = require('bcrypt');

exports.adminDialogue = function(req,res) {
                   res.render('admin-login');
};

exports.userDialogue = function(req,res) {
                   res.render('user-login');
};

exports.checkBeforeLoggingIn = function(req,res,next){
  var usernameInput = req.body.adminUsername,
      passwordInput = req.body.adminPass,
      canLogIn = false, userExists,userIsAdmin,alert;

  req.services(function(err, services){
      var loginService = services.loginService;
      loginService.getUser([usernameInput], function(err, user){
        if (err) return next(err);
        userDetails = user[0];
        userExists = user.length>0;
        userIsAdmin = user.length>0 && user[0].role==='admin' ? true : false;


        if (userExists && userIsAdmin) {
          bcrypt.compare(passwordInput, userDetails.password, function(err, match) {

          if (match) {
          console.log("User may log in as admin");
          req.session.user = {
            username: userDetails.username,
            role: userDetails.role,
            adminType: userDetails.admin_type
          };
          alert = "You may log in."
          res.render('admin-login',{alert: true, message: alert});
        } else {
          alert = "Incorrect password! Please try again."
          res.render('admin-login',{alert: true, message: alert});
        }
          // res.redirect('/admin/dashboard');
        });
        } else if (userExists && !userIsAdmin){

          alert = "Sorry, but you're not authorised to log in as admin."
          res.render('admin-login',{alert: true, message: alert});
          console.log("User is not admin");

        } else if (!userExists) {
            alert = "We don't seem to have you on our system at all. Please contact the administrator if you're supposed to be.";
            res.render('admin-login',{alert: true, message: alert});
        }
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
