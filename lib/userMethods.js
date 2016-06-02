const fs = require('fs');
const exec = require('child_process').exec;
var bcrypt = require('bcrypt');

exports.show = function(req,res,next) {
              var context;
                req.services(function(error, services){
                  var userService = services.userDataService;
                  userService.getAllUsers(function(err, users){
                    if (err) return next (err);
                    console.log("USERS: ", users);
                    context = {users: users, layout: 'admin'};
                    res.render('users', context);
                  });
                });
};

exports.
