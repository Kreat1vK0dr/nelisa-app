var express = require('express'),
    exphbs  = require('express-handlebars'),
    display = require('./lib/process-handlebars'),
    path = require('path'),
    mysql = require('mysql');
    // myConnection = require('express-myconnection'),
    // bodyParser = require('body-parser'),
    // categories = require('./routes/categories'),
    // products = require('./routes/products');
// 'use strict';

// var dbOptions = {
//       host: 'localhost',
//       user: 'daniel',
//       password: 'password',
//       port: 3306,
//       database: 'my_products'
// };

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));

app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req,res){
  res.redirect("/home");
});

app.get('/home', function(req,res) {
  res.render("home.handlebars");
});

app.get('/sales/:item_type/:week', function (req, res) {
  var type = req.params.item_type;
  var week = req.params.week;
  var data = display.getData(type, week);
  var template = display.getTmplName(type);
    res.render(template, data);
});

app.listen(3010);
