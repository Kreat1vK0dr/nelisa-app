var assert = require('assert'),
    _ = require('underscore'),
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
  var newId;
  var productDS = new ProductDataService(connection);
      it("getProduct should return a specific product", function(done) {
            productDS.getProduct([1], function(err,product){
            assert.equal("Milk 1l", product[0].description);
            done();
      });
});
      it("getAllProducts should return all products", function(done) {
            productDS.getAllProducts(function(err,products){
            assert.equal(18, products.length);
            done();
      });
});
      it("addProduct should insert a product into the database", function(done) {
        var peaches = {
            description: "Peaches",
            category_id: 10,
            price: 8
        };
            productDS.addProduct(peaches, function(err,result) {
              if (err) throw err;
              newId = result.insertId;
              var addedRow = result.affectedRows===1;
              productDS.getAllProducts(function(err, result){
                if (err) throw err;
                var correctNumberOfProducts = result.length===19;
                var addedCorrectProduct = result[result.length-1].product === "Peaches";
                var addedProduct = addedRow && correctNumberOfProducts && addedCorrectProduct;
            assert.equal(true, addedProduct);
            done();
          });
      });
});


it("updateProducts should update changes to a product", function(done) {
  var peaches = ["Canned Peaches", 3, 15, newId];

      productDS.updateProducts(peaches, function(err,result){
        if (err) throw err;
      var rowChanged = result.changedRows === 1;
      productDS.getProduct([newId], function(err, result){
        if (err) throw err;
      var productChanged = result[0].description === "Canned Peaches" && +result[0].category_id===3 && +result[0].price===15 && rowChanged;

      assert.equal(true, productChanged);
      done();
    });
});
});

it("deleteProduct should delete a specific product from the database", function(done) {
  console.log("THIS IS NEW ID", newId);
      productDS.deleteProduct([newId], function(err,result){
        if (err) throw err;
      var oneRowAffected = result.affectedRows === 1;
      productDS.getAllProducts(function(err, result){
        if (err) throw err;
        var productsEqualPrevious = result.length === 18;
        var rowDeleted = oneRowAffected && productsEqualPrevious;
        assert.equal(true, rowDeleted);
        done();
      });
});
});
it("searchProducts should return a list of products that matches the search parameter given by name or category", function(done) {
      productDS.searchProducts(["%f%","%f%"], function(err,result){
        if (err) throw err;

        var correctNumberOfProducts = result.length === 5;
        console.log("CORRECT NUMBER OF PRODUCTS", correctNumberOfProducts,result.length);
        var products = result.map(function(p){return p.product;});
        var correctProducts = _.isEqual(products, ["Chakalaka Can", "Gold Dish Vegetable Curry Can", "Fanta 500ml", "Bananas - loose", "Apples - loose"]);
        console.log("THIS IS PRODUCTS", correctProducts, products, products);
        var returnedCorrectResults = correctProducts && correctNumberOfProducts;
      assert.equal(true, returnedCorrectResults);
      done();
});
});
it("searchProductsByName should return a list of products that matches the search parameter given by name only", function(done) {
      productDS.searchProductsByName(["%f%"], function(err,result){
        if (err) throw err;

        var correctNumberOfProducts = result.length === 1;
        var products = result.map(function(p){return p.product;});
        var correctProducts = _.isEqual(products, ["Fanta 500ml"]);
        var returnedCorrectResults = correctProducts && correctNumberOfProducts;
      assert.equal(true, returnedCorrectResults);
      done();
});
});
it("searchProductsByCategory should return a list of products that matches the search parameter given by category only", function(done) {
      productDS.searchProductsByCategory(["%f%"], function(err,result){
        if (err) throw err;

        var correctNumberOfProducts = result.length === 4;
        var products = result.map(function(p){return p.product;});
        var correctProducts = _.isEqual(products, ["Chakalaka Can", "Gold Dish Vegetable Curry Can","Bananas - loose", "Apples - loose"]);
        var returnedCorrectResults = correctProducts && correctNumberOfProducts;
      assert.equal(true, returnedCorrectResults);
      done();
});
});
});

describe('Category', function() {
  var newId;
  var categoryDS = new CategoryDataService(connection);

      it("getCategory should return a specific ", function(done) {
            categoryDS.getCategory([1], function(err,category){
              if (err) throw err;

            assert.equal("Milk", category[0].description);
            done();
      });
});
      it("getAllCategories should return all categories", function(done) {
            categoryDS.getAllCategories(function(err,categories){
              if (err) throw err;

            assert.equal(10, categories.length);
            done();
      });
});
      it("addcategory should insert a category into the database", function(done) {
        categoryDS.addCategory({description: "Juice"}, function(err,result){
          if (err) throw err;

            var rowInserted = result.affectedRows === 1;
            newId = +result.insertId;
            categoryDS.getAllCategories(function(err, result){
              if (err) throw err;
              var correctNumberOfCategories = result.length === 11;
              var rowAdded = rowInserted && newId && correctNumberOfCategories;
              assert.equal(true, rowAdded);
              done();
            })

      });
});

it("updateCategory should update changes to a category name", function(done) {
  var juice = ["Fruit Juice", newId]
      categoryDS.updateCategory(juice, function(err,result){
        if (err) throw err;

      var rowChanged = result.changedRows === 1;
      categoryDS.getCategory([newId], function(err, result){
        if (err) throw err;


      var categoryChanged = result[0].description === "Fruit Juice" && rowChanged;

      assert.equal(true, categoryChanged);
      done();
    });
});
});

it("deleteCategory should delete a specific category from the database", function(done) {
      categoryDS.deleteCategory([newId], function(err,result){
        if (err) throw err;

      var rowAffected = result.affectedRows === 1;
      categoryDS.getAllCategories(function(err, result){
        if (err) throw err;

        var categoriesEqualPrevious = result.length === 10;
        var rowDeleted = rowAffected && categoriesEqualPrevious;
        assert.equal(true, rowDeleted);
        done();
      });
});
});
it("searchCategories should return a list of categories that matches the search parameter given by name or category", function(done) {
      categoryDS.searchCategories(["%f%"], function(err,result){
        if (err) throw err;
        console.log('THIS IS RESULT', result);
        var correctNumberOfCategories = result.length === 2;
        var categories = result.map(function(p){return p.description;});
        console.log("THIS IS CATEGORIES", categories);
        var correctCategories = _.isEqual(categories, ["Canned Food","Fruit"]);
        var returnedCorrectResults = correctCategories && correctNumberOfCategories;
      assert.equal(true, returnedCorrectResults);
      done();
});
});
});

describe('Sales', function() {
  var salesDS = new SalesDataService(connection);
  var date = new Date("02/01/2016");
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

  it("getSale should return a specific sale including the number of unique items for that sale", function(done) {

    salesDS.addSale(insertSale, function (err, result) {
        if (err) throw err;
        console.log("ADDED SALE with id", result.insertId);
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
              var saleItem = sale;
              var test = [{id: saleId, date: 'Mon 01 Feb 2016', itemsSold: 3, uniqueProducts: 3, revenue: 47, cost: 25, profit: 22}];

                  assert.deepEqual(test, saleItem);
                  done();

        });

      });
      });
      });

      it("getSalesDetail should return details of all items sold for a specific sale", function(done) {
            salesDS.getSaleDetailsBySaleId([saleId], function(err,saleDetails){
              if (err) throw err;
              var sales = saleDetails.map(function(i){delete i.id; return i;});
              var test = [{sale_id: saleId, date: 'Feb Mon 01 2016 12:00 AM', product: "Milk 1l", category: "Milk", quantity: 1, cost: 7, revenue: 10, profit: 3},
              {sale_id: saleId, date: 'Feb Mon 01 2016 12:00 AM', product: "Imasi", category: "Milk", quantity: 1, cost: 10, revenue: 25, profit: 15},
            {sale_id: saleId, date: 'Feb Mon 01 2016 12:00 AM', product: "Bread", category: "Bread", quantity: 1, cost: 8, revenue: 12, profit: 4}];
              console.log("THIS IS SALE DETAILS", sales);
            salesDS.deleteSale([saleId], function(err, result){
              if (err) throw err;
              salesDS.deleteSaleDetails([saleId], function(err, result){
                if (err) throw err;
                assert.deepEqual(test, sales);
                done();
});
        });

      });
});
});
