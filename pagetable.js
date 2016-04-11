var group = require('./js/group_data');
var nelisa = require('./js/whatNelisaWants');
var nelisa2 = require('./js/whatNelisaWants_other');
var get = require('./js/get&map_data');//
var sms = require('./js/sms_configure');
var exprt = require('./js/export');
var fs = require('fs');
var _ = require('lodash');
var draw = require('./js/drawTable');
var f = require('./js/filter');
var path = require('./js/filepaths');
var handlebars = require('handlebars');
var html = "./html/data/";
var htmlIndex = "./index.html";
var js = "./js/";
// var $ = require('jquery');

// M&L WEEK 1
var ML = nelisa2.whatSheWants();
var groupP = group.salesByProduct();
var groupC = group.salesByCategory();
var filenames = fs.readdirSync(html);
var links = [];
// console.log(ML[0]);


for (var i = 0; i<groupP.length; i++) {

        var dataML = ML[i];

        var dataProd = {data: []};
          for (var p of groupP[i]) {
            // p.map(function(a){return a.item = a.product; delete a.product; return a;});
            dataProd.data.push(p);
          }
        var dataCat = {data: []};
          for (var c of groupC[i]) {
            // c.map(function(a){return a.item = a.product; delete a.product; return a;});
            dataCat.data.push(c);
          }
//
        dataML.title = "Most & Least Week "+(i+1);
        var source = fs.readFileSync('./templates/Most&Least.handlebars', 'utf8');//read spaza.html from disk using fs module;
        var template = handlebars.compile(source);
        var MLfolder = html+"Most&Least_W"+(i+1)+".html";
        fs.writeFileSync(MLfolder, template(dataML));

        dataProd.title = "Summary by Product Week "+(i+1);
        var source = fs.readFileSync('./templates/summary_products.handlebars', 'utf8');//read spaza.html from disk using fs module;
        var template = handlebars.compile(source);
        var sumPFolder = html+"products_W"+(i+1)+".html";
        fs.writeFileSync(sumPFolder, template(dataProd));

        dataCat.title = "Summary by Category Week "+(i+1);
        var source = fs.readFileSync('./templates/summary_categories.handlebars', 'utf8');//read spaza.html from disk using fs module;
        var template = handlebars.compile(source);
        var sumCFolder = html+"categories_W"+(i+1)+".html";
        fs.writeFileSync(sumCFolder, template(dataCat));


}

for (var j = 0; j<filenames.length; j++) {
  var d = filenames[j].replace(".html","").replace("_"," ");
  links.push({ref: html+filenames[j], description: d});
}

// console.log(links);

var source = fs.readFileSync('./templates/index.handlebars', 'utf8');//read spaza.html from disk using fs module;
var template = handlebars.compile(source);
fs.writeFileSync(htmlIndex, template(links));

var variable = function() {
  var other = variable.
}



// console.log(ML);
