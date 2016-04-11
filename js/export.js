var get = require('./get&map_data');
var group = require('./group_data');
var path = require('./filepaths');
var fs = require('fs');
var prodFile = path.productsFile();

function exportProductList() {
  var data = group.salesByProduct().reduce(function(a,b){
              return  a.concat(b);
              });
  var list = get.productList(data);
  var header = ['Products Sold'];
  var exportData = header.concat(list).join('\n');
  fs.writeFileSync(prodFile, exportData);
}

// exportProductList();

exports.productList = function() {
  return exportProductList();
};
