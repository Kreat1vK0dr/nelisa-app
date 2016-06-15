const fs = require('fs');
const exec = require('child_process').exec;
var bcrypt = require('bcrypt');

exports.show = function (req, res, next) {
    const saltRounds = 12;
    var context = req.session.context;

    req.services(function (error, services) {

        var userService = services.userDataService;

        userService.getAllUsers(function (err, users) {
            if (err) return next(err);

            console.log("USERS: ", users);

            context.users = users;

            res.render('users', context);
        });
    });
};

exports.edit = function (req, res, next) {
    var id = req.params.id,
    dataService;

  var context = req.session.context;

req.services(function(err, services){
  dataService = services.userDataService;
  dataService.getUserById([id], function(err, user){
    if (err) return next(err);
    var userDetails = user[0];
    console.log("THIS IS USER DATA", user);
    var user = {
                    id: userDetails.id,
                    username: userDetails.username,
                    role: userDetails.role,
                    adminRole: userDetails.admin_role,
                    layout: 'admin'
        };

    context.userDetails = user;

    res.render('users_edit', context);
  });
});
};

exports.addHome = function(req,res) {
  var context = req.session.context;
  res.render('users_add', context);
};

exports.addCheck = function(req, res, next) {
      var username = req.body.username,
          firstName = req.body.firstName,
          lastName = req.body.lastName,
          password = '1234abcd',
          email = req.body.email,
          role = req.body.role,
          adminRole = role === 'admin' ? req.body.adminRole : null,
          alert;

      var addUserDetails = {
            username: username,
            firstName: firstName,
            lastName: lastName,
            password: password,
            role: role,
            admin_role: adminRole
          };

      var context = req.session.context;

      req.services(function(err, services){
        var dataService = services.userDataService;
        dataService.getUser([username],function(err, user){
          if (err) return next (err);
          if (user.length != 0) {
            delete addUserDetails.username;
            context.user = addUserDetails;
            alert = "Username already exists please choose another.";
            context.alert = true;
            context.message = alert;
            res.render('users_add', context);
          } else {
            console.log("may add user");
            req.session.addUserDetails = addUserDetails;
          next();
          }
        });
      });
};

exports.add = function(req, res, next) {

      var context = req.session.context,
          newUserDetails = req.session.addUserDetails;

      delete req.session.addUserDetails;
      const dateAdded = new Date(Date.now());
      const saltRounds = 12;

      newUserDetails.date_added = dateAdded;

      bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(newUserDetails.password, salt, function (err, hash) {
              newUserDetails.password = hash;
              req.services(function(err, services){
                var dataService = services.userDataService;
                dataService.addUser(newUserDetails, function (err, result) {
                  if (err) return next(err);
                  res.redirect('/users');
              });
          });
    });
});
};

exports.update = function(req,res,next) {
  const id = req.body.id,
        username = req.body.username,
        role = req.body.role,
        adminRole = role === "admin" ? req.body.adminRole : null;

  const data = [username,role,adminRole,id];
  console.log("This is data", data);
      req.services(function (err, services) {
          var userService = services.userDataService;
          if (err) return next(err);

          userService.updateUser(data, function(err, results){
            if (err) return next (err);

            console.log("SUCCESSFULLY UPDATED ", results.changedRows, " ROWS IN USERS");

            res.redirect('/users');
          });
      });

};

exports.delete = function (req, res, next) {
    var id = req.body.id,
        username = req.body.username;
        role = req.body.role;
        adminRole = req.body.adminRole;

    var userIsAdmin = role === "admin" ? true : false,
        adminIsSuperuser = adminRole === "superuser" ? true : false;

    console.log("Trying to delete this id:", id);
    if (userIsAdmin && adminIsSuperuser) {
      const alert = "cannot delete a super user";
      var context = req.session.context;
      context.alert = true;
      context.message = alert;
      res.render('users',context);
    } else {
    var data = [id];

    req.services(function (error, services) {
        var userService = services.userDataService;
        userService.deleteUser(data, function(err, results){
        if (err) return next (err);

        console.log("SUCCESSFULLY DELETED ", results.alteredRows, " ROWS IN USERS");

        res.redirect('/users');
      });
    });
  }
};
