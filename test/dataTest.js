var assert = require('assert'),
    _ = require('underscore'),
    ProductDataService = require('../data-services/productDataService'),
    CategoryDataService = require('../data-services/categoryDataService'),
    SalesDataService = require('../data-services/salesDataService'),
    mysql = require('mysql');

    const url = process.env.MYSQL_URL!==undefined ? process.env.MYSQL_URL : 'mysql://root:1amdan13l@localhost/nelisa_another_copy';

          var connection = mysql.createConnection(url);

describe('Products', function () {
    var newId;
    var productDS = new ProductDataService(connection);
    it("getProduct should return a specific product", function (done) {
        productDS.getProduct([1], function (err, product) {
            assert.equal(product[0].description, "Milk 1l");
            done();
        });
    });
    it("getAllProducts should return all products", function (done) {
        productDS.getAllProducts(function (err, products) {
            assert.equal(products.length, 18) ;
            done();
        });
    });
    it("addProduct should insert a product into the database", function (done) {
        var peaches = {
            description: "Peaches",
            category_id: 10,
            price: 8
        };
        productDS.addProduct(peaches, function (err, result) {
            if (err) throw err;
            newId = result.insertId;
            var addedRow = result.affectedRows === 1;
            productDS.getAllProducts(function (err, result) {
                if (err) throw err;
                var correctNumberOfProducts = result.length === 19;
                var addedCorrectProduct = result[result.length - 1].product === "Peaches";
                var addedProduct = addedRow && correctNumberOfProducts && addedCorrectProduct;
                assert.equal(addedProduct, true);
                done();
            });
        });
    });


    it("updateProducts should update changes to a product", function (done) {
        var peaches = ["Canned Peaches", 3, 15, newId];

        productDS.updateProducts(peaches, function (err, result) {
            if (err) throw err;
            var rowChanged = result.changedRows === 1;
            productDS.getProduct([newId], function (err, result) {
                if (err) throw err;
                var productChanged = result[0].description === "Canned Peaches" && +result[0].category_id === 3 && +result[0].price === 15 && rowChanged;

                assert.equal(productChanged, true);
                done();
            });
        });
    });

    it("deleteProduct should delete a specific product from the database", function (done) {
        console.log("THIS IS NEW ID", newId);
        productDS.deleteProduct([newId], function (err, result) {
            if (err) throw err;
            var oneRowAffected = result.affectedRows === 1;
            productDS.getAllProducts(function (err, result) {
                if (err) throw err;
                var productsEqualPrevious = result.length === 18;
                var rowDeleted = oneRowAffected && productsEqualPrevious;
                assert.equal(rowDeleted, true);
                done();
            });
        });
    });
    it("searchProducts should return a list of products that matches the search parameter given by name or category", function (done) {
        productDS.searchProducts(["%f%", "%f%"], function (err, result) {
            if (err) throw err;

            var correctNumberOfProducts = result.length === 5;
            console.log("CORRECT NUMBER OF PRODUCTS", correctNumberOfProducts, result.length);
            var products = result.map(function (p) {
                return p.product;
            });
            var correctProducts = _.isEqual(products, ["Chakalaka Can", "Gold Dish Vegetable Curry Can", "Fanta 500ml", "Bananas - loose", "Apples - loose"]);
            console.log("THIS IS PRODUCTS", correctProducts, products, products);
            var returnedCorrectResults = correctProducts && correctNumberOfProducts;
            assert.equal(returnedCorrectResults, true);
            done();
        });
    });
    it("searchProductsByName should return a list of products that matches the search parameter given by name only", function (done) {
        productDS.searchProductsByName(["%f%"], function (err, result) {
            if (err) throw err;

            var correctNumberOfProducts = result.length === 1;
            var products = result.map(function (p) {
                return p.product;
            });
            var correctProducts = _.isEqual(products, ["Fanta 500ml"]);
            var returnedCorrectResults = correctProducts && correctNumberOfProducts;
            assert.equal(returnedCorrectResults, true);
            done();
        });
    });
    it("searchProductsByCategory should return a list of products that matches the search parameter given by category only", function (done) {
        productDS.searchProductsByCategory(["%f%"], function (err, result) {
            if (err) throw err;

            var correctNumberOfProducts = result.length === 4;
            var products = result.map(function (p) {
                return p.product;
            });
            var correctProducts = _.isEqual(products, ["Chakalaka Can", "Gold Dish Vegetable Curry Can", "Bananas - loose", "Apples - loose"]);
            var returnedCorrectResults = correctProducts && correctNumberOfProducts;
            assert.equal(returnedCorrectResults, true);
            done();
        });
    });
});

describe('Category', function () {
    var newId;
    var categoryDS = new CategoryDataService(connection);

    it("getCategory should return a specific ", function (done) {
        categoryDS.getCategory([1], function (err, category) {
            if (err) throw err;
            var test = category[0].description;
            assert.equal(test, "Milk");
            done();
        });
    });
    it("getAllCategories should return all categories", function (done) {
        categoryDS.getAllCategories(function (err, categories) {
            if (err) throw err;
            var test = categories.length;
            assert.equal(test, 10);
            done();
        });
    });
    it("addcategory should insert a category into the database", function (done) {
        categoryDS.addCategory({
            description: "Juice"
        }, function (err, result) {
            if (err) throw err;

            var rowInserted = result.affectedRows === 1;
            newId = +result.insertId;
            categoryDS.getAllCategories(function (err, result) {
                if (err) throw err;
                var correctNumberOfCategories = result.length === 11;
                var rowAdded = rowInserted && newId && correctNumberOfCategories;
                assert.equal(rowAdded, true);
                done();
            })

        });
    });

    it("updateCategory should update changes to a category name", function (done) {
        var juice = ["Fruit Juice", newId]
        categoryDS.updateCategory(juice, function (err, result) {
            if (err) throw err;

            var rowChanged = result.changedRows === 1;
            categoryDS.getCategory([newId], function (err, result) {
                if (err) throw err;


                var categoryChanged = result[0].description === "Fruit Juice" && rowChanged;

                assert.equal(categoryChanged, true);
                done();
            });
        });
    });

    it("deleteCategory should delete a specific category from the database", function (done) {
        categoryDS.deleteCategory([newId], function (err, result) {
            if (err) throw err;

            var rowAffected = result.affectedRows === 1;
            categoryDS.getAllCategories(function (err, result) {
                if (err) throw err;

                var categoriesEqualPrevious = result.length === 10;
                var rowDeleted = rowAffected && categoriesEqualPrevious;
                assert.equal(rowDeleted, true);
                done();
            });
        });
    });
    it("searchCategories should return a list of categories that matches the search parameter given by name or category", function (done) {
        categoryDS.searchCategories(["%f%"], function (err, result) {
            if (err) throw err;
            console.log('THIS IS RESULT', result);
            var correctNumberOfCategories = result.length === 2;
            var categories = result.map(function (p) {
                return p.description;
            });
            console.log("THIS IS CATEGORIES", categories);
            var correctCategories = _.isEqual(categories, ["Canned Food", "Fruit"]);
            var returnedCorrectResults = correctCategories && correctNumberOfCategories;
            assert.equal(returnedCorrectResults, true);
            done();
        });
    });
});

describe('Sales', function () {
var salesDS = new SalesDataService(connection);
var date = new Date("02/01/2016");
var day = date.getDay() === 0 ? 6 : date.getDay() - 1,
    week = date.getDate() % 7 != 0 ? Math.floor(date.getDate() / 7) + 1 : Math.floor(date.getDate() / 7);

var saleDetailsToAdd = [
    [date, day, week, 1, 1, 10, 1, 7],
    [date, day, week, 2, 1, 25, 1, 10],
    [date, day, week, 3, 2, 12, 1, 8]
];
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
var saleId,
    beforeAddSale,
    beforeAddSaleDetails;

it("getAllSales should return a list of all sales. Sales should equal 448.", function (done) {
    salesDS.getAllSales()
           .then(function(result){
        beforeAddSale = result.length;
        console.log('THIS IS RESULT LENGTH', result.length);
        assert.equal(beforeAddSale, 385);
        done();
            })
            .catch(done);
});

it("addSale should add a sale and increase sales by one row.", function (done) {
  var addedOneRow, afterAdd, addedOneSale;
    salesDS.addSale(insertSale)
           .then(function(result){
                  console.log("ADDED SALE with id", result.insertId);
                  saleId = result.insertId;
                  addedOneRow = result.affectedRows === 1;
                  return salesDS.getAllSales();
           })
            .then(function(result) {
                 afterAdd = result.length;
                 addedOneSale = addedOneRow && beforeAddSale + 1 === afterAdd;
                 assert.equal(addedOneSale, true);
                 done();
                })
            .catch(done);
});

it("getSale should return a specific sale including the number of unique number of products sold,quantity, total sum of sale (revenue), total cost, and profit.", function (done) {

    salesDS.getSale(saleId)
           .then(function(sale){
        var test = sale;

        var saleItem = [{
            id: saleId,
            date: 'Mon 01 Feb 2016',
            itemsSold: 3,
            uniqueProducts: 3,
            revenue: 47,
            cost: 25,
            profit: 22
        }];

        assert.deepEqual(test, saleItem);
        done();

        })
        .catch(done);

});

it("getAllSalesDetails should return 448 sale details.", function (done) {
    salesDS.getAllSalesDetails()
           .then(function(result){
            beforeAddSaleDetails = result.length;
            console.log('THIS IS RESULT LENGTH', result.length);

            assert.equal(beforeAddSaleDetails, 385);
            done();
            })
            .catch(done);
});

it("addSaleDetails should add details of sale added in getSale. Should add three rows.", function (done) {
    var addedThreeRows, afterAdd, test;
    saleDetailsToAdd = saleDetailsToAdd.map(function (item) {
        item.push(saleId);
        return item;
    });
    salesDS.addSaleDetails([saleDetailsToAdd])
           .then(function(rows){
              addedThreeRows = rows.affectedRows === 3;
              return salesDS.getAllSalesDetails();
           })
           .then(function(rows){
             afterAdd = rows.length;
             test = addedThreeRows && beforeAddSaleDetails + 3 === afterAdd;
            assert.equal(true, test);
            done();
            })
           .catch(done);
    });

it("getSalesDetail should return details of all items sold for a specific sale. This also tests whether addSaleDetails worked.", function (done) {
salesDS.getSaleDetailsBySaleId([saleId])
       .then(function(saleDetails){
            var test = saleDetails.map(function (i) {
                  delete i.id;
                  return i;
              });
              var sales = [{
                  sale_id: saleId,
                  date: 'Feb Mon 01 2016 12:00 AM',
                  product: "Milk 1l",
                  category: "Milk",
                  quantity: 1,
                  cost: 7,
                  revenue: 10,
                  profit: 3
              }, {
                  sale_id: saleId,
                  date: 'Feb Mon 01 2016 12:00 AM',
                  product: "Imasi",
                  category: "Milk",
                  quantity: 1,
                  cost: 10,
                  revenue: 25,
                  profit: 15
              }, {
                  sale_id: saleId,
                  date: 'Feb Mon 01 2016 12:00 AM',
                  product: "Bread",
                  category: "Bread",
                  quantity: 1,
                  cost: 8,
                  revenue: 12,
                  profit: 4
              }];
              console.log("THIS IS SALE DETAILS", sales);
                  assert.deepEqual(test, sales);
                  done();
            })
            .catch(done);
});

it("deleteSale should delete one row from sales.", function (done) {
  var deletedOneRow, afterDeleted, test;
salesDS.deleteSale([saleId])
       .then(function(result){
         deletedOneRow = result.affectedRows === 1;
        return salesDS.getAllSales();
      })
      .then(function(rows){
         afterDeleted = rows.length;
         test = deletedOneRow && beforeAddSale === afterDeleted;
        assert.equal(test, true);
        done();
        })
        .catch(done);
});

it("deleteSaleDetails should delete three rows from sales_details.", function (done) {
  var deletedThreeRows, afterDeleted, test;
salesDS.deleteSaleDetailsBySaleId([saleId])
       .then(function(result){
           deletedThreeRows = result.affectedRows === 3;
        return salesDS.getAllSalesDetails();
        })
        .then(function(rows){
         afterDeleted = rows.length;
         test = deletedThreeRows && beforeAddSaleDetails === afterDeleted;
          assert.equal(test, true);
          done();
          })
        .catch(done);
});
});
