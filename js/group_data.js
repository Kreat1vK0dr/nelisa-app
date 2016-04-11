var fs = require('fs');
var get = require('./get&map_data');
var f = require('./filter');
var salesFolder = './sales';
var purchasesFolder = './purchases';
var productListFolder = "./product-list";

//NOTE: AVOID THE USE OF REPETITVE FILTERS IF YOU CAN LOOP. FILTERS ARE TIME CONSUMING. ESPECIALLY IF YOU HAVE LARGE AMOUNTS OF DATA.

function groupSalesByProduct() {
  // var dataSummarized = [];
    var data = get.mappedSales();

    return data.reduce(function(allSummary, week){
      var keeptrack = {};
          allSummary.push(week.reduce(function(weekSum, sale) {
              if (!keeptrack[sale.product]) {
                keeptrack[sale.product] = 1;
                weekSum.push({week: sale.week, category: sale.category, product: sale.product, quantity: sale.quantity, inventory: sale.inventory-sale.quantity, unitPrice: sale.unitPrice, revenue: sale.revenue, totalcost: sale.totalcost, profit: sale.profit, profitMargin: sale.profitMargin });
              } else {
                  var product = weekSum.find(function(item) {return item.product === sale.product;});
                  product.quantity += sale.quantity;
                  product.inventory = sale.inventory - sale.quantity;
                  product.revenue += sale.revenue;
                  product.totalcost += sale.totalcost;
                  product.profit += sale.profit;
                  product.profitMargin = Number(((product.profit/product.revenue)*100).toFixed(2));

                  if (typeof product.unitPrice!== 'object' && product.unitPrice!==sale.unitPrice) {
                    product.unitPrice = [product.unitPrice, sale.unitPrice];
                  } else if (typeof product.unitPrice === 'object' && product.unitPrice.indexOf(sale.unitPrice)===-1) {
                    product.unitPrice.push(sale.unitPrice);
                  }
              }

        return weekSum;
      },[])
    );
    return allSummary;
    },[]);
      // return dataSummarized;
  }

function groupSalesByCategory () {
  var data = groupSalesByProduct();

    return data.reduce(function(allWeekSum, week){
        var keeptrack = {};
        allWeekSum.push(week.reduce(function(weekSum, product){
                if (!keeptrack[product.category]) {
                  keeptrack[product.category] = 1;
                  weekSum.push({week: product.week, category: product.category, quantity: product.quantity, inventory: product.inventory, unitPrice: product.unitPrice, revenue: product.revenue, totalcost: product.totalcost, profit: product.profit, profitMargin: product.profitMargin });
                } else {
                  var category = weekSum.find(function(item) {return item.category === product.category;});
                  category.quantity += product.quantity;
                  category.inventory += product.inventory;
                  category.revenue += product.revenue;
                  category.totalcost += product.totalcost;
                  category.profit += product.profit;
                  category.profitMargin = Number(((product.profit/product.revenue)*100).toFixed(2));

                  if (typeof category.unitPrice!== 'object' && category.unitPrice!==product.unitPrice) {
                    category.unitPrice = [category.unitPrice, product.unitPrice];
                  } else if (typeof category.unitPrice === 'object' && category.unitPrice.indexOf(product.unitPrice)===-1) {
                    category.unitPrice.push(product.unitPrice);
                  }
                }
                return weekSum;
          },[]));
          return allWeekSum;
    },[]);
  }
// console.log(groupSalesByCategory());


//****************************************************


exports.salesByProduct = function() {
  return groupSalesByProduct();
};

exports.salesByCategory = function() {
  return groupSalesByCategory();
};


// console.log(returnWhatNelisaWants());
// var list = f.concat(groupSalesByProduct());
// var result = get.productList(list);
// console.log(result);
