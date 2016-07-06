var assert = require('assert'),
    ProductDataService = require('../data-services/productDataService'),
    CategoryDataService = require('../data-services/categoryDataService'),
    SalesDataService = require('../data-services/salesDataService'),
    mysql = require('mysql');

const password = process.env.MYSQL_PWD !== (null || undefined) ? process.env.MYSQL_PWD : "1amdan13l",
      user = process.env.MYSQL_USER !== (null || undefined) ? process.env.MYSQL_USER : "root";

      // var connection = mysql.createConnection({
      //     host: 'localhost',
      //     user: "root",
      //     password: "1amdan13l",
      //     database: 'nelisa_another_copy'
      // });

const connection = mysql.createConnection({
    host: '127.0.0.1',
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

describe('Sales', function() {
  var salesDS = new SalesDataService(connection);
  var date = new Date("01/02/2016");
  var day = date.getDay() === 0 ? 6 : date.getDay() - 1,
      week = date.getDate() % 7 != 0 ? Math.floor(date.getDate() / 7) + 1 : Math.floor(date.getDate() / 7);

  var saleDetailsToAdd = [[date, day, week, 1, 1, 10, 1, 7],[date, day, week, 2, 1, 25, 1, 10],[date, day, week, 3, 2, 12, 1, 8]];
  var totQ = saleDetailsToAdd.reduce(function (sum, item) {
          return sum += item[6];
      }, 0),
      sumTotal = saleDetailsToAdd.reduce(function (sum, item) {
          return sum += item[6] * item[5]
      }, 0),
      totalCost = saleDetailsToAdd.reduce(function (sum, item) {
          return sum += item[7]
      }, 0);

  var listOfProductIds = saleDetailsToAdd.map(function (item) {
      return item[3];
  });
  var numberOfUniqueProducts = Array.from(new Set(listOfProductIds)).length;

  var insertSale = {
              date: date,
              day: day,
              week: week,
              total_quantity: totQ,
              unique_products: numberOfUniqueProducts,
              sum_total: sumTotal,
              total_cost: totalCost
          };
  var saleId;

  it("getSale should return a specific sale including the number of unique items for that sale", function() {

    salesDS.addSale(insertSale, function (err, result) {
        if (err) throw err;
        console.log("ADDED SALE");
        saleId = result.insertId;
        saleDetailsToAdd = saleDetailsToAdd.map(function (item) {
            item.push(saleId);
            return item;
        });
        salesDS.addSaleDetails([saleDetailsToAdd], function (err, rows) {
            if (err) throw err;
            console.log("ADDED SALE DETAILS");
            salesDS.getSale(saleId, function(err,sale){
              if (err) throw err;

              var test = [{id: 1, date: 'Mon 01 Feb 2016', itemsSold: 3, uniqueProducts: 3, revenue: 47, cost: 25, profit: 22}];
            assert.deepEqual(test, sale);
      });
      });
      });
      });

      it("getSalesDetail should return details of all items sold for a specific sale", function(done) {
            salesDS.getSaleDetails(saleId, function(err,saleDetails){
              if (err) throw err;

              var test = [{id: 449, sale_id: saleId, date: 'Mon 01 Feb 2016 00:00 AM', product: "Milk 1l", category: "Milk", quantity: 1, cost: 7, revenue: 10, profit: 3},
            {category: "Milk", quantity: 1, cost: 10, revenue: 25, profit: 15},
            {id: 451, sale_id: saleId, date: 'Mon 01 Feb 2016 00:00 AM', product: "Milk 1l", category: "Milk", quantity: 1, cost: 8, revenue: 12, profit: 4}];
            //   var test = [{id: 449, sale_id: saleId, date: 'Mon 01 Feb 2016 00:00 AM', product: "Milk 1l", category: "Milk", quantity: 1, cost: 7, revenue: 10, profit: 3},
            //   {id: 450, sale_id: saleId, date: 'Mon 01 Feb 2016 00:00 AM', product: "Imasi", category: "Milk", quantity: 1, cost: 10, revenue: 25, profit: 15},
            // {id: 451, sale_id: saleId, date: 'Mon 01 Feb 2016 00:00 AM', product: "Milk 1l", category: "Milk", quantity: 1, cost: 8, revenue: 12, profit: 4}];
            assert.deepEqual(test, saleDetails);
            done();
      });
});
});
