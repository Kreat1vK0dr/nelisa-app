var group = require('../js/group_data');
var Nelisa = require('../js/whatNelisaWants');
// var chaiassert = require('chai').assert;
var assert = require('assert');
var d = require('../js/drawTable');
var f = require('../js/filter');
var get = require('../js/get&map_data');
var sms = require('../js/sms_configure');
var exprt = require('../js/export');

describe('GET&MAP_DATA', function() {

      it('get.rawPurchasesData should...extract raw purchases data from purchases.csv and return line items as string separated by ";"\nCommas at digits should also be replaced by a period', function() {
            var result = get.rawPurchasesData().filter(function(i,idx) {return idx === 0 || idx === 44 || idx === 152;});
            assert.deepEqual(result, ["Makro;2016/01/23;Chakalaka Can;3;R7.00;R21.00", "Makro;2016/02/06;Iwisa Pap 5kg;5;R20.00;R100.00", "Joe Spaza Shop;2016/03/01;Top Class Soy Mince;3;R11.00;R33.00"] );
      });

      it('get.rawPurchasesDataConverted should...split each line item into an array and convert quantity and unitPrice to number format.', function() {
            var result = get.rawPurchasesDataConverted().filter(function(i,idx) {return idx === 4 || idx === 73 || idx === 143;});
            assert.deepEqual(result, [["Makro", "23-Jan", "Gold Dish Vegetable Curry Can", 2, 5, "R10.00"],["Makro","13-Feb","Milk 1l",15,7,"R105.00"],["HomeMade","28-Feb","Shampoo 1 litre",2,20,"R40.00"]]);
      });

      it('get.mappedPurchases should...return an array of objects each containing a unique product name. Thus the array length should be the same as the number of products.', function() {
            var result = get.mappedPurchases().length;
            assert.equal(result, 18);
      });

      it('get.mappedPurchases should...reduce raw purchases data to return an object containing a unique product name with all the purchases made for that product.', function() {
            var result = get.mappedPurchases().filter(function(i) {return i.product === "Coke 500ml" || i.product === "Valentine Cards";});
            assert.deepEqual(result, [{product: "Coke 500ml", purchases: [{date: "23-Jan", quantity: 3, remaining: 3, unitCost: 3.5, supplier: "Makro"},{date: "28-Jan", quantity: 36, remaining: 36, unitCost: 3.5, supplier: "Makro"},{date: "6-Feb", quantity: 36, remaining: 36, unitCost: 3.5, supplier: "Makro"},{date: "10-Feb", quantity: 18, remaining: 18, unitCost: 3.5, supplier: "Makro"},{date: "13-Feb", quantity: 12, remaining: 12, unitCost: 3.5, supplier: "Makro"},{date: "17-Feb", quantity: 24, remaining: 24, unitCost: 3.5, supplier: "Makro"},{date: "24-Feb", quantity: 18, remaining: 18, unitCost: 3.5, supplier: "Makro"},{date: "27-Feb", quantity: 24, remaining: 24, unitCost: 3.5, supplier: "Makro"}]},{product: "Valentine Cards", purchases: [{date: "11-Feb", quantity: 20, remaining: 20, unitCost: 2, supplier: "HomeMade"}]}]);
      });

      it('get.rawSalesData should...return an array of arrays. There should be one array for each week.', function() {
            var result = get.rawSalesData().length;
            assert.equal(result, 4);
      });

      it('get.rawSalesData should...extract sales data for each week from given files and return a list of arrays, one for each week (in order) and each item a string representing a line item in raw csv format', function() {
            var result = get.rawSalesData().reduce(function(arr,i){arr.push(i[3]);return arr;},[]);
            assert.deepEqual(result, ["Sunday,1-Feb,Chakalaka Can,3,R10.00","Sunday,8-Feb,Chakalaka Can,1,R10.00","Sunday,15-Feb,Chakalaka Can,3,R10.00","Sunday,22-Feb,Chakalaka Can,0,R10.00"]);
      });

      it('get.salesArray should...takes single array (i.e. one week) from the output from rawSalesData() (which is still in csv format) and splits each comma separated line item into an array. Ultimately returning an array of arrays.', function() {
            var output = get.rawSalesData();
            var result = get.salesArray(output[0])[0];
            assert.deepEqual(result, ["Sunday","1-Feb","Milk 1l","3","R10.00"]);
      });

      it('get.productList: Its length should be equal to the number of unique products sold in a month.', function() {
            var array = group.salesByProduct();
            var list = f.concat(array);
            var result = get.productList(list).length;
            // console.log(get.productList(list));
            assert.equal(result, 18);
      });

      // var list = f.concat(groupSalesByProduct());
      // var result = get.productList(list);
      it('get.productList should...take a list of all sales in a month and return an array of unique products sold in that month', function() {
            var array = group.salesByProduct();
            var list = f.concat(array);
            var result = get.productList(list);
            assert.deepEqual(result, ["Milk 1l","Imasi","Bread", "Chakalaka Can", "Gold Dish Vegetable Curry Can", "Fanta 500ml", "Coke 500ml", "Cream Soda 500ml", "Iwisa Pap 5kg", "Top Class Soy Mince", "Shampoo 1 litre", "Soap Bar", "Bananas - loose", "Apples - loose", "Mixed Sweets 5s", "Heart Chocolates", "Rose (plastic)", "Valentine Cards"]);
      });

      it('get.category should...take a product name as parameter and return its category', function() {
            var catMap = get.mappedCategories();
            var result = [get.category(catMap, "Bread"), get.category(catMap, "Valentine Cards"), get.category(catMap, "Gold Dish Vegetable Curry Can"), get.category(catMap, "Coke 500ml"), get.category(catMap, "Mixed Sweets 5s"), get.category(catMap, "Apples - loose")];
            assert.deepEqual(result, ["Food", "Miscellaneous", "Canned Food", "Soda", "Sweets", "Fruit"]);
      });

      it('get.findPurchases should...take an product name and mapped purchases list as parameter and return all purchases relating to that product.', function() {
            var purchases = get.mappedPurchases();
            var result = get.findPurchases("Heart Chocolates", purchases);
            assert.deepEqual(result, [{date: "10-Feb", quantity: 20, remaining: 20, unitCost: 25, supplier: "Makro" }]);
      });

      it('get.costAndLogSaleAtAndLogSaleAt should...calculate the total cost of a sale.', function() {
            var purchases = get.mappedPurchases();
            var result = get.costAndLogSaleAt("3-Feb", "Milk 1l", 10, purchases);
            assert.equal(result, 70);
      });

      it('get.costAndLogSaleAt should...deduct the quantity sold from the product\'s purchases.remaining property.\nNB if the total sale is greater than the first supply purchase then the quantity remaining after deducting from the first purchase should be deducted from the next purchase.', function() {
            var purchases = get.mappedPurchases();
            get.costAndLogSaleAt("3-Feb", "Milk 1l", 10, purchases);
            var result = get.findPurchases("Milk 1l", purchases).filter(function(i,idx){return idx === 0 || idx === 1;});
            assert.deepEqual(result, [{date: "23-Jan", quantity: 4, remaining: 0, unitCost: 7, supplier: "Makro"},{date: "28-Jan", quantity: 25, remaining: 19, unitCost: 7, supplier: "Makro"}]);
      });

      it('get.costAndLogSaleAt should...be sensitive to date. You cannot sell what you do not have. If all quantities purchased have already been sold at the date of sale, even if there are other purchases at a later date, the later purchases should not be affected.shthe sale should return no revenue,or profit and the total cost should be zero.', function() {
            var purchases = get.mappedPurchases();
            get.costAndLogSaleAt("14-Feb", "Bananas - loose", 32, purchases);
            get.costAndLogSaleAt("17-Feb", "Bananas - loose", 10, purchases);
            var result = get.findPurchases("Bananas - loose", purchases).filter(function(i,idx){return idx === 4 || idx === 5;});
            assert.deepEqual(result, [{date: "13-Feb", quantity: 4, remaining: 0, unitCost: 1, supplier: "Epping Market"},{date: "20-Feb", quantity: 20, remaining: 20, unitCost: 1, supplier: "Epping Market"}]);
      });

      it('get.costAndLogSaleAt should...calculate total cost using the first-in-first-out principle.', function() {
        var purchases = get.mappedPurchases();
            var result = get.costAndLogSaleAt("15-Feb", "Bread", 32, purchases);
            assert.equal(result, 292);
      });

      it('get.mappedSales should...reduce raw sales data to return a list of arrays (one for each week).', function() {
            var result = get.mappedSales().length;
            assert.equal(result, 4);
      });

      it('get.mappedSales: arrays should be sorted by week.', function() {
            var result = get.mappedSales().reduce(function(arr, i){arr.push(i[0].week); return arr;},[]);
            assert.deepEqual(result, ['week1','week2','week3','week4']);
      });

      it('get.mappedSales: Each object should include the following: week, day, date, category, product, quantity, unitPrice, revenue, totalcost, and profit.', function() {
            var object = get.mappedSales()[2][5];
            var result = Object.keys(object).reduce(function(arr, key){arr.push(key);return arr;},[]);
            assert.deepEqual(result, ['week','day','date','category','product','quantity', 'inventory', 'unitPrice','revenue','totalcost','profit']);
      });


      it('get.quantityPurchasedBy should...take a date and product name as parameter and return the sum of all purchases made up to and including that date for the specified product.', function() {
            var result = get.quantityPurchasedBy("17-Feb", "Top Class Soy Mince");
            assert.equal(result, 50);
      });

      it('get.inventoryRemainingAt should...take date, product, and mappedPurchases as parameters and return the inventory remaining at that date for the specified product', function() {
            var purchases = get.mappedPurchases();
            get.costAndLogSaleAt("11-Feb", "Iwisa Pap 5kg", 20, purchases);
            var result = get.inventoryRemainingAt("11-Feb", "Iwisa Pap 5kg", purchases);
            assert.equal(result, 8);
      });


      it('get.mappedSales: It is important that the revenue,total cost, and profit are all calculated accurately.', function() {
            var result = [get.mappedSales()[0][15], get.mappedSales()[1][60], get.mappedSales()[2][5], get.mappedSales()[3][27]];
            assert.deepEqual(result, [{week: 'week1', day: 'Monday', date: '2-Feb', category: 'Food', product: 'Milk 1l', quantity: 4, inventory: 26, unitPrice: 10, revenue: 40, totalcost: 28, profit: 12},{week: 'week2', day: 'Wednesday', date: '11-Feb', category: 'Fruit', product: 'Apples - loose', quantity: 3, inventory: 190, unitPrice: 2, revenue: 6, totalcost: 4.5, profit: 1.5},{week: 'week3', day: 'Sunday', date: '15-Feb', category: 'Soda', product: 'Fanta 500ml', quantity: 5, inventory: 6, unitPrice: 6.5, revenue: 32.5, totalcost: 22.5, profit: 10},{week: 'week4', day: 'Monday', date: '23-Feb', category: 'Fruit', product: 'Bananas - loose', quantity: 2, inventory: 12, unitPrice: 2, revenue: 4, totalcost: 2, profit: 2}]);
      });

      it('get.mappedSales should...be sensitive to date. You cannot sell what you do not have. If all quantities purchased have already been sold at the date of sale, even if there are other purchases at a later date, the sale should reflect no revenue or profit and the total cost should be zero.\nNB: Bananas sold on 17-Feb is such an example. There is no supply left so there should be no profit or revenue from such a sale.', function() {
            var result = get.mappedSales()[2].find(function(i){return i.date === "17-Feb" && i.product === "Bananas - loose";});
            var expected = {week: "week3", day: "Tuesday", date: "17-Feb", category: "Fruit", product: "Bananas - loose", quantity: 2, unitPrice: 2, revenue: 0, totalcost: 0, profit: 0};
            assert.deepEqual(result, {week: "week3", day: "Tuesday", date: "17-Feb", category: "Fruit", product: "Bananas - loose", quantity: 2, inventory: 0, unitPrice: 2, revenue: 0, totalcost: 0, profit: 0});
            // chaiassert(result===expected, "Success: No profit or revenue reflected from sale of bananas on 17-Feb.");
      });



 });

 describe('GROUP_DATA', function() {

      it('group.salesByProduct should...return an array of arrays, one for each week.', function() {
            var result = group.salesByProduct().length;
            assert.equal(result, 4);
      });

      it('group.salesByProduct : each array should only contain data for one week and they should be in order.', function() {
            var result = [group.salesByProduct()[0][14].week, group.salesByProduct()[1][3].week,group.salesByProduct()[2][8].week, group.salesByProduct()[3][7].week];
            assert.deepEqual(result, ["week1","week2","week3","week4"]);
      });

      it('group.salesByProduct : the arrays should contain objects with the following properties: week, category, product, quantity, inventory, unitPrice, revenue, totalcost, and profit.', function() {
            var object = group.salesByProduct()[2][5];
            var result = Object.keys(object).reduce(function(arr, key){arr.push(key); return arr;},[]);
            assert.deepEqual(result, ['week', "category", "product", "quantity", "inventory", "unitPrice", "revenue", "totalcost", "profit"]);
      });

      it('group.salesByProduct should...return cumulative quantity, inventory, unitPrice, revenue, totalcost, and profit for each PRODUCT by week.', function() {
            var result = f.filterData(group.salesByProduct()[2],[["product","Milk 1l"]]);
            assert.deepEqual(result, [{week: "week3", category: "Food", product: "Milk 1l", quantity: 30, inventory: 10, unitPrice: 10, revenue: 300, totalcost: 227.5, profit: 72.5 }]);
      });

      it('group.salesByProduct: if a product has more than one price in a given week the unitPrice property should reflect an array of all the different prices.', function() {
            var result = f.filterData(group.salesByProduct()[0],[["product","Mixed Sweets 5s"]])[0].unitPrice;
            assert.deepEqual(result, [3, 2]);
      });

      it('group.salesByCategoryshould...return an array of arrays, one for each week.', function() {
            var result = group.salesByCategory().length;
            assert.equal(result, 4);
      });

      it('group.salesByCategory: each array should only contain data for one week and they should be in order.', function() {
            var result = [group.salesByCategory()[0][1].week, group.salesByCategory()[1][0].week,group.salesByCategory()[2][2].week, group.salesByCategory()[3][3].week];
            assert.deepEqual(result, ["week1","week2","week3","week4"]);
      });

      it('group.salesByCategory: the arrays should contain objects with the following properties: week, category, quantity, inventory, unitPrice, revenue, totalcost, and profit.', function() {
            var object = group.salesByCategory()[2][1];
            var result = Object.keys(object).reduce(function(arr, key) {arr.push(key); return arr;},[])
            assert.deepEqual(result, ['week', "category", "quantity", "inventory", "unitPrice", "revenue", "totalcost", "profit"]);
      });

      it('group.salesByCategoryshould...return cumulative quantity, inventory, unitPrice, revenue, totalcost, and profit for each CATEGORY by week.', function() {
            var result = f.filterData(group.salesByCategory()[1],[["category","Miscellaneous"]]);
            assert.deepEqual(result, [{week: "week2", category: "Miscellaneous", quantity: 28, inventory: 12, unitPrice: [15, 4], revenue: 266, totalcost: 168, profit: 98 }]);
      });

  });

  describe('WHAT NELISA WANTS', function() {

    it('Nelisa.whatSheWants should... return an array of objects, ONE FOR EACH WEEK.', function() {
          var result = Nelisa.whatSheWants().length;
          assert.equal(result, 4);
    });

    it('Nelisa.whatSheWants should... return an array of OBJECTS.', function() {
          var result = [Nelisa.whatSheWants()[0].length, Nelisa.whatSheWants()[1].length, Nelisa.whatSheWants()[2].length, Nelisa.whatSheWants()[3].length];
          assert.deepEqual(result, [undefined, undefined, undefined, undefined]);
    });

    it('Nelisa.whatSheWants: Each array should have the week as property and should be in order.', function() {
          var result = [Nelisa.whatSheWants()[0].week, Nelisa.whatSheWants()[1].week, Nelisa.whatSheWants()[2].week, Nelisa.whatSheWants()[3].week];
          assert.deepEqual(result, ["week1","week2","week3","week4"]);
    });

    it('Nelisa.whatSheWants should... return by week, the MOST: popular product, profitable product, popular category, profitable category; And the LEAST: popular product, profitable product, popular category, profitable category.', function() {
          var result = Nelisa.whatSheWants()[1];
          assert.deepEqual(result, {week: "week2", "most popular product": {product: "Mixed Sweets 5s", quantity: 54}, "most profitable product": {product: "Imasi", profit: 288}, "least popular product": {product: "Soap Bar", quantity: 5}, "least profitable product": {product: "Mixed Sweets 5s", profit: -15}, "most popular category": {category: "Food", quantity: 123}, "most profitable category": {category: "Food", profit: 625}, "least popular category": {category: "Toiletries", quantity: 11}, "least profitable category": {category: "Fruit", profit: 18.5}} );
    });


  });


 describe('SMS_CONFIGURE', function() {

      it('sms.content should...(when printed to the screen) display each item on a new line. There should be 11 new line and therfore 10 newline characters.', function() {
            var result = sms.content().match(/\n/g).length;
            assert.deepEqual(result, 10);
      });

      it('sms.content should...contain no more than 160 characters.', function() {
            var result = sms.content().length;
            assert.ok(result <= 160, "sms content is no more than 160 characters.");
      });

  });
