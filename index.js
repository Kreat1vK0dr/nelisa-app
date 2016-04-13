// 'use strict';

var express = require('express'),
    exphbs  = require('express-handlebars'),
    get = require('./lib/process-handlebars'),
    path = require('path'),
    mysql = require('mysql'),
    myConnection = require('express-myconnection'),
    bodyParser = require('body-parser');

var dbOptions = {
      host: 'localhost',
      user: 'root',
      password: '1amdan13l',
      port: 3306,
      database: 'nelisa_copy'
};

var app = express();

app.set('port', (process.env.PORT || 5000));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));

app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res){
  app.engine('handlebars', exphbs({defaultLayout: 'main'}));
  res.redirect("/home");
});

app.get('/home', function(req,res) {
  res.render("home.handlebars");
});

app.get('/stats', function(req,res) {
  res.render("stats_home.handlebars");
});

app.get('/summary', function(req,res) {
  res.render("summary_home.handlebars");
});

app.get('/stats/:item_type/:week', function (req, res) {

  var type = req.params.item_type,
      week = req.params.week;

  var context = get.context(type, week),
      template = get.tmplName(type);

    res.render(template, context);

});

app.get('/summary/:item_type/:week', function(req,res){

  var type = req.params.item_type,
      week = req.params.week;

  var data = get.context(type, week),
      template = get.tmplName(type);

    res.render(template, data);

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
