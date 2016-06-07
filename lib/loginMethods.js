var bcrypt = require('bcrypt');

function redirectTo(reference) {
    switch (reference) {
    case 'addPurchase':
        return '/purchases/add';
    case 'addSale':
        return '/sales/add';
    default:
        return null;
    }
}

exports.adminHome = function (req,res,next){
  var context,
  userInSession,
  userIsAdmin,
  alert,
  dateTimeStamp = new Date(Date.now());

  userInSession = req.session.user ? true : false;
  userIsAdmin = userInSession ? req.session.user.role === 'admin' : false;

  var sessionExpired = req.session.expired;

  if (userInSession && userIsAdmin) {

    context = {
        user: req.session.user.username,
        layout: 'admin'
    };

      res.render("admin_home", context);
  } else {
    res.redirect('/admin/login');
  }
};

exports.adminDialogue = function (req, res, next) {
    var context,
    userInSession,
    userIsAdmin,
    alert,
    dateTimeStamp = new Date(Date.now());

    userInSession = req.session.user ? true : false;
    userIsAdmin = userInSession ? req.session.user.role === 'admin' : false;

    var sessionExpired = req.session.expired;

    if (userInSession && userIsAdmin) {
      console.log("USER IS IN SESSION AND USER IS ADMIN, REDIRECTING TO ADMIN HOME PAGE");

        res.redirect('/admin');
      } else if (sessionExpired) {
        console.log("SESSION IS EXPIRED");
        alert = 'Your session has expired. Please log in to resume your session';
        res.render('admin-login', {
            alert: true,
            message: alert
        });

    } else if (!sessionExpired) {
      console.log("SESSION IS NOT EXPIRED")
        res.render('admin-login');
    }
};

exports.userDialogue = function (req, res) {
    res.render('user-login');
};

exports.checkBeforeLoggingIn = function (req, res, next) {
    var usernameInput = req.body.adminUsername,
        passwordInput = req.body.adminPass,
        userID,
        canLogIn = false,
        userExists,
        userIsAdmin,
        alert,
        sessionExpired = req.session.expired,
        dateTimeStamp = new Date(Date.now());

    var redirectPath = sessionExpired ? redirectTo(req.session.lastAttempt) : null;

    req.services(function (err, services) {
        var loginService = services.userDataService;
        loginService.getUser([usernameInput], function (err, user) {
            if (err) return next(err);
            userDetails = user[0];
            userExists = user.length > 0;
            userIsAdmin = user.length > 0 && user[0].role === 'admin' ? true : false;


            if (userExists && userIsAdmin) {
                userID = userDetails.id;

                bcrypt.compare(passwordInput, userDetails.password, function (err, match) {

                    if (match) {
                        console.log("User may log in as admin");
                        req.session.user = {
                            username: userDetails.username,
                            role: userDetails.role,
                            adminType: userDetails.admin_type,
                            lastLogin: dateTimeStamp
                        };
                        if (sessionExpired) {
                            res.redirect(redirectPath);
                        } else {
                          console.log("THIS IS USERID", userID);
                          loginService.updateUserLastLogin([userID], function(err, rows){
                            if (err) return next (err);

                            console.log("UPDATED ", rows.changedRows, " ROWS IN USERS");
                            console.log("UPDATE USER ", userID, " TIMESTAMP");
                          res.redirect('/admin');
                          });
                        }
                    } else {
                        alert = "Incorrect password! Please try again."
                        res.render('admin-login', {
                            alert: true,
                            message: alert
                        });
                    }
                    // res.redirect('/admin/dashboard');
                });
            } else if (userExists && !userIsAdmin) {

                alert = "Sorry, but you're not authorised to log in as admin."
                res.render('admin-login', {
                    alert: true,
                    message: alert
                });
                console.log("User is not admin");

            } else if (!userExists) {
                alert = "We don't seem to have you on our system at all. Please contact the administrator if you're supposed to be.";
                res.render('admin-login', {
                    alert: true,
                    message: alert
                });
            }
        });
    });

};

exports.authenticate = function (req, res, next) {
    var usernameInput = req.body.adminUsername,
        passwordInput = req.body.adminPass,
        userID,
        canLogIn = false,
        userExists,
        userIsAdmin,
        alert,
        sessionExpired = req.session.expired,
        dateTimeStamp = new Date(Date.now());

    var redirectPath = sessionExpired ? redirectTo(req.session.lastAttempt) : null;

    req.services(function (err, services) {
        var loginService = services.userDataService;
        loginService.getUser([usernameInput], function (err, user) {
            if (err) return next(err);
            userDetails = user[0];
            userExists = user.length > 0;
            userIsAdmin = user.length > 0 && user[0].role === 'admin' ? true : false;


            if (userExists && userIsAdmin) {
                userID = userDetails.id;

                bcrypt.compare(passwordInput, userDetails.password, function (err, match) {

                    if (match) {
                        console.log("User may log in as admin");
                        req.session.user = {
                            username: userDetails.username,
                            role: userDetails.role,
                            adminType: userDetails.admin_type,
                            lastLogin: dateTimeStamp
                        };
                        if (sessionExpired) {
                            res.redirect(redirectPath);
                        } else {
                          console.log("THIS IS USERID", userID);
                          loginService.updateUserLastLogin([userID], function(err, rows){
                            if (err) return next (err);

                            console.log("UPDATED ", rows.changedRows, " ROWS IN USERS");
                            console.log("UPDATE USER ", userID, " TIMESTAMP");
                          res.redirect('/admin');
                          });
                        }
                    } else {
                        alert = "Incorrect password! Please try again."
                        res.render('admin-login', {
                            alert: true,
                            message: alert
                        });
                    }
                    // res.redirect('/admin/dashboard');
                });
            } else if (userExists && !userIsAdmin) {

                alert = "Sorry, but you're not authorised to log in as admin."
                res.render('admin-login', {
                    alert: true,
                    message: alert
                });
                console.log("User is not admin");

            } else if (!userExists) {
                alert = "We don't seem to have you on our system at all. Please contact the administrator if you're supposed to be.";
                res.render('admin-login', {
                    alert: true,
                    message: alert
                });
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
