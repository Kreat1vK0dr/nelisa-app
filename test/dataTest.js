var assert = require('assert'),
    ProductDataService = require('../data-services/productDataService'),
    CategoryDataService = require('../data-services/categoryDataService'),
    mysql = require('mysql');

const password = process.env.MYSQL_PWD !== null ? process.env.MYSQL_PWD : "1amdan13l",
      user = process.env.MYSQL_USER !== null ? process.env.MYSQL_USER : "root";

const connection = mysql.createConnection({
    host: 'localhost',
    user: user,
    password: password,
    port: 3306,
    database: 'nelisa_another_copy'
});

describe('Products', function() {
  var productDS = new ProductDataService(connection);
      it("getProduct should return a specific product", function() {
            productDS.getProduct(1, function(err,product){
            assert.equal("Milk 1l", product[0].description);
      });
});
      it("getAllProducts should return all products", function() {
            productDS.getAllProducts(function(err,products){
            assert.equal(18, products.length);
      });
});
      it("addProduct should insert a product into the database", function() {
        var peaches = {
            description: "Peaches",
            category_id: 10,
            price: 8
        };
            productDS.addProduct(peaches, function(err,result){
            var rowInserted = result.affectedRows === 1;
            var newId = +result.insertId === 19;
            var rowAdded = rowInserted && newId;
            assert.equal(true, rowAdded);
      });
});


it("updateProducts should update changes to a product", function() {
  var peaches = {
      description: "Canned Peaches",
      category_id: 3,
      price: 15
  }
      productDS.updateProducts(peaches, function(err,result){
      var rowChanged = result.changedRows === 1;
      productDS.getProduct(19, function(err, result){

      var productChanged = result[0].description === "Canned Peaches" && +result[0].category_id===3 && +result[0].price===15 && rowChanged;

      assert.equal(true, productChanged);
    });
});
});

it("deleteProduct should delete a specific product from the database", function() {
      productDS.deleteProduct(19, function(err,result){
      var rowDeleted = result.affectedRows === 1;
      productDS.getAllProducts(function(err, result){
        var productsEqualPrevious = result.length === 18;
        var rowDeleted = rowDeleted && productsEqualPrevious;
        assert.equal(true, rowDeleted);
      });
});
});
it("searchProducts should return a list of products that matches the search parameter given by name or category", function() {
      productDS.searchProducts("%f%", function(err,result){
        var correctNumberOfProducts = result.length === 5;
        var products = products.map(function(p){return p.product;});
        var correctProducts = products === ["Chakalaka Can", "Gold Dish Vegetable Curry Can", "Fanta 500ml", "Bananas - loose", "Apples - loose"];
        var returnedCorrectResults = correctProducts && correctNumberOfProducts;
      assert.equal(true, returnedCorrectResults);
});
});
it("searchProductsByName should return a list of products that matches the search parameter given by name only", function() {
      productDS.searchProducts("%f%", function(err,result){
        var correctNumberOfProducts = result.length === 1;
        var products = products.map(function(p){return p.product;});
        var correctProducts = products === ["Fanta 500ml"];
        var returnedCorrectResults = correctProducts && correctNumberOfProducts;
      assert.equal(true, returnedCorrectResults);
});
});
it("searchProductsByCategory should return a list of products that matches the search parameter given by category only", function() {
      productDS.searchProducts("%f%", function(err,result){
        var correctNumberOfProducts = result.length === 4;
        var products = products.map(function(p){return p.product;});
        var correctProducts = products === ["Chakalaka Can", "Gold Dish Vegetable Curry Can","Bananas - loose", "Apples - loose"];;
        var returnedCorrectResults = correctProducts && correctNumberOfProducts;
      assert.equal(true, returnedCorrectResults);
});
});
});

describe('Category', function() {
  var categoryDS = new CategoryDataService(connection);

      it("getCategory should return a specific ", function() {
            categoryDS.getCategory(1, function(err,category){
            assert.equal("Milk", category[0].description);
      });
});
      it("getAllCategories should return all categories", function() {
            categoryDS.getAllCategories(function(err,categories){
            assert.equal(10, categories.length);
      });
});
      it("addcategory should insert a category into the database", function() {
        categoryDS.addCategory("Juice", function(err,result){
            var rowInserted = result.affectedRows === 1;
            var newId = +result.insertId === 11;
            var rowAdded = rowInserted && newId;
            assert.equal(true, rowAdded);
      });
});

it("updateCategory should update changes to a category name", function() {
  var juice = ["Fruit Juice", 11]
      categoryDS.updateCategory(juice, function(err,result){
      var rowChanged = result.changedRows === 1;
      categoryDS.getCategory(11, function(err, result){

      var categoryChanged = result[0].description === "Fruit Juice" && rowChanged;

      assert.equal(true, categoryChanged);
    });
});
});

it("deleteCategory should delete a specific category from the database", function() {
      categoryDS.deleteCategory(11, function(err,result){
      var rowDeleted = result.affectedRows === 1;
      categoryDS.getAllCategories(function(err, result){
        var categoriesEqualPrevious = result.length === 10;
        var rowDeleted = rowDeleted && categoriesEqualPrevious;
        assert.equal(true, rowDeleted);
      });
});
});
it("searchCategories should return a list of categories that matches the search parameter given by name or category", function() {
      categoryDS.searchCategories("%f%", function(err,result){
        var correctNumberOfcategories = result.length === 1;
        var categories = categories.map(function(p){return p.category;});
        var correctcategories = categories === ["Fruit"];
        var returnedCorrectResults = correctcategories && correctNumberOfcategories;
      assert.equal(true, returnedCorrectResults);
});
});

});
describe('Cat', function() {
  var productDS = new ProductDataService(connection);

      it("getProduct should return a specific product", function() {
            productDS.getProduct(1, function(err,product){
            assert.equal("Milk 1l", product[0].description);
      });
});
