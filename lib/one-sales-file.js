var fs = require('fs');

var files = fs.readdirSync('./data/sales');
fs.writeFileSync('./data/sales/all_initial_sales.csv','');
files.forEach(function(file){
  var data = fs.readFileSync('./data/sales/'+file, 'utf-8');
  fs.appendFileSync('./data/sales/all_initial_sales.csv', data);
});
