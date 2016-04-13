var group = require('./group_data'),
    fs = require('fs'),
    get = require('./get&map_data'),
    handlebars = require('handlebars'),
    nelisa2 = require('./whatNelisaWants_other');

var tmplName = function(type) {
  switch (type) {
    case "m&l" : return "Most&Least.handlebars";
    case "product" : return "products.handlebars";
    case "category" : return "categories.handlebars";
  }
};

var context = function(type, week) {

  var n = week,
      src,
      tmpl;

  switch(type) {

    case "m&l":       var dataML = nelisa2.whatSheWants();

                      dataML[n-1].title = "Trend stats Week "+(n);

                      return dataML[n-1];

    case "product":   var groupP = group.salesByProduct(),
                          dataProd = {data: []};

                      for (var p of groupP[n-1]) {
                        dataProd.data.push(p);
                      }

                      dataProd.title = "Summary by Product for Week "+(n);

                      return dataProd;

    case "category":  var groupC = group.salesByCategory(),
                          dataCat = {data: []};

                      for (var c of groupC[n-1]) {
                        dataCat.data.push(c);
                      }

                      dataCat.title = "Summary by Category Week "+(n);

                      return dataCat;

    default:          return null;
  }
};

var compile = function(type, week) {

  var n = week,
      context = context(type,week),
      tmplName = tmplName(type);
      src = fs.readFileSync('./templates/'+tmplName, 'utf8'),
      tmpl = handlebars.compile(src);

  return tmpl(context);
};

exports.context = context;
exports.compile = compile;
exports.tmplName = tmplName;
