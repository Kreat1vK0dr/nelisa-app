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
    var id = req.body.id,
        username = req.body.username,
        role = req.body.role,
        adminRole = req.body.adminRole;

    var context = req.session.context;

    var user = {
                    id: id,
                    username: username,
                    role: role,
                    adminRole: adminRole,
                    layout: 'admin'
        };

    context.userDetails = user;

    res.render('users_edit', context);
};

exports.update = function(req,res,next) {
  const id = req.body.id,
        username = req.body.username,
        role = req.body.role,
        adminRole = req.body.admin;

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

    console.log("Trying to delete this id:", id);

    var data = [id];

    req.services(function (error, services) {
        var userService = services.userDataService;
        userService.deleteUser(data, function(err, results){
        if (err) return next (err);

        console.log("SUCCESSFULLY DELETED ", results.alteredRows, " ROWS IN USERS");

        res.redirect('/users');
      });
    });
};
