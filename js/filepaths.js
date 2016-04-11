var salesFolder = './sales';
var purchasesFile = './purchases/purchases.csv';
var productsFile = './product-list/product_list.csv';
var categoriesFile = './product-list/product_categories.csv';
var html = "../html/";
var js = "../js/";

exports.salesFolder = function() {
  return salesFolder;
};
exports.purchasesFile = function() {
  return purchasesFile;
};
exports.productsFile = function() {
  return productsFile;
};
exports.categoriesFile = function() {
  return categoriesFile;
};
exports.html = function() {
  return html;
};
exports.js = function() {
  return js;
};
