var group = require('./group_data');
var fs = require('fs');
var get = require('./get&map_data');
var handlebars = require('handlebars');
var nelisa2 = require('./whatNelisaWants_other');

exports.getHTML = function(type, week) {
  var dataML = nelisa2.whatSheWants();
  var groupP = group.salesByProduct();
  var groupC = group.salesByCategory();
  var n = week, src, tmpl;
  switch(type) {
    case "m&l" :
                    dataML[n-1].title = "Most & Least Week "+(n);
                    src = fs.readFileSync('./templates/Most&Least.handlebars', 'utf8');
                    var tmpl = handlebars.compile(src);
                    console.log(tmpl(dataML[n-1]));
                    return tmpl(dataML[n-1]);
    case "product" :
                    var dataProd = {data: []};
                    for (var p of groupP[n-1]) {
                      dataProd.data.push(p);
                    }
                    console.log(dataProd);
                    dataProd.title = "Summary by Product Week "+(n);
                    src = fs.readFileSync('./templates/summary_products.handlebars', 'utf8');
                    var tmpl = handlebars.compile(src);
                    console.log(tmpl(dataProd));
                    return tmpl(dataProd);
    case "category" :
                    var dataCat = {data: []};
                    for (var c of groupC[n-1]) {
                      dataCat.data.push(c);
                    }
                    dataCat.title = "Summary by Category Week "+(n);
                    src = fs.readFileSync('./templates/summary_categories.handlebars', 'utf8');
                    var tmpl = handlebars.compile(src);
                    return tmpl(dataCat);
    default: return null;
  }
};

exports.getData = function(type, week) {
  var dataML = nelisa2.whatSheWants();
  var groupP = group.salesByProduct();
  var groupC = group.salesByCategory();
  var n = week, src, tmpl;
  switch(type) {
    case "m&l" :
                    dataML[n-1].title = "Most & Least Week "+(n);
                    return dataML[n-1];
    case "product" :
                    var dataProd = {data: []};
                    for (var p of groupP[n-1]) {
                      dataProd.data.push(p);
                    }
                    dataProd.title = "Summary by Product Week "+(n)
                    return dataProd;
    case "category" :
                    var dataCat = {data: []};
                    for (var c of groupC[n-1]) {
                      dataCat.data.push(c);
                    }
                    dataCat.title = "Summary by Category Week "+(n);
                    return dataCat;
    default: return null;
  }
};

exports.getTmplName = function(type) {
  switch (type) {
    case "m&l" : return "Most&Least.handlebars";
    case "product" : return "summary_products.handlebars";
    case "category" : return "summary_categories.handlebars";
  }
};
