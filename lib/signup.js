var bcrypt = require('bcrypt');

exports.home = function (req, res) {
    var context = {signup: true};
    res.render("login",context);
};

exports.checkUser = function (req, res, next) {
    var pass1 = req.body.pass1,
        pass2 = req.body.pass2,
        username = req.body.username;

    var usernameExists,
        passwordsMatch = pass1 === pass2,
        alert;

    var context = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    };

    req.services(function (err, services) {
        var userServices = services.userDataService;

        userServices.getUser([username], function (err, result) {
            if (err) return next(err);

            console.log("THIS IS RESULT", result);

            usernameExists = result.length > 0 ? true : false;
            if (usernameExists) {
                console.log("username exists!");

                alert = "username exists, please choose another username";
                context.alert = true;
                context.message = alert;

                res.render('signup', context);
            } else if (!usernameExists && !passwordsMatch) {
                console.log("username does not exist but passwords don't match!");

                alert = "passwords do not match, please make sure they do!";
                context.alert = true;
                context.message = alert;
                context.username = req.body.username;

                res.render('signup', context);
            } else if (!usernameExists && passwordsMatch) {
                console.log("username does not exist and passwords match.");

                next();
            }
        });
    });
};

exports.addUser = function (req, res, next) {
    const password = req.body.pass1;
    const username = req.body.username;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const role = 'user';
    const dateAdded = new Date(Date.now());
    const saltRounds = 12;

    var user = {
        username: username,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        role: role,
        date_added: dateAdded
    }

    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
            user.password = hash;
            req.services(function(err, services){
              var userServices = services.userDataService;
              userServices.addUser(user, function (err, result) {
                if (err) return next(err);
                console.log("INSERTED HASHED PASSWORD IN DATABASE");
                console.log("INSERTED HASHED PASSWORD: ", hash);
                req.session.user = {
                    username: username,
                    role: role,
                    lastLogin: dateTimeStamp
                };
                req.session.context = {admin: false, user: username};
                res.redirect('/');
              });
            });
        });
    });
};
