var express = require("express");
var display = require('./js/displayHTML.js');
var app = express();
var links = [];

app.use(express.static('layouts'));

app.get('/sales/:item_type/:week', function (req, res) {
  var type = req.params.item_type;
  var week = req.params.week;
  var data = display.getHTML(type, week);
  res.send(data);
});

var server = app.listen(3000, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
