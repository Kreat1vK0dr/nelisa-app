var fs = require('fs'),
    draw = require('./drawTable'),
    f = require('./filter'),
    path = require('./filepaths');

var catFile = path.categoriesFile,
    prodFile = path.productsFile,
    salesFolder = path.salesFolder,
    purchasesFile = path.purchasesFile;

exports.mapSQLPurchases = function(SQLpurchases) {
    var purchases = SQLpurchases;
    var map = new Map();
    purchases.forEach(function(purchase){

          if (!map.get(purchase.product_id)) {
            map.set(purchase.product_id, [purchase]);
          }  else {
                  map.get(purchase.product_id).push(purchase);
                }
        });
    return map;
};//end of extract purchases.

var SQLCostAndLogSaleAt = function(date, quantity, mappedPurchases, updatePurchasesArray) {
  var cost = 0, purchases = mappedPurchases, update = updatePurchasesArray;
  if (quantity > 0) {
      for (var j=0; j<purchases.length; j++) {
          if(purchases[j].date <= date){
            if (purchases[j].remaining>0)  {
              if (purchases[j].remaining<quantity) {
                cost += purchases[j].remaining * purchases[j].eacost;
                quantity -= purchases[j].remaining;
                purchases[j].remaining -= purchases[j].remaining;
                update.push([purchases[j].remaining, purchases[j].id]);
              continue;
            } else {
                  purchases[j].remaining -= quantity;
                  cost += quantity * purchases[j].eacost;
                  quantity -= quantity;
                  update.push([purchases[j].id, purchases[j].remaining]);
                  break;
            }
          }
        }
      }
    }
        return {cost: cost, quantity: quantity};
};// END OF GET COST.

var SQLInventoryRemainingAt = function(date, productID, mappedPurchases) {
    var purchases = mappedPurchases.get(productID).filter(function(i){return i.date <= date;});
    return purchases.reduce(function(sum,i){sum += i.remaining; return sum;},0);
  };

exports.getAllCOS = function(SQLsales,SQLpurchases,salesToUpdate,purchasesToUpdate){
            SQLsales.forEach(function(sale) {

              var purchases = SQLpurchases.get(sale.product_id),
                  getinfo = SQLCostAndLogSaleAt(sale.date, sale.quantity, purchases, purchasesToUpdate);

              var totalcost = getinfo.cost,
                  quantity = getinfo.quantity,
                  inventory = SQLInventoryRemainingAt(sale.date, sale.product_id, SQLpurchases);

              var profit,
                  profitMargin,
                  revenue;

              if (quantity===0) {
                  revenue = sale.quantity * sale.price;
                } else {
                  revenue = (sale.quantity-quantity) * sale.price;
                }

              profit = revenue - totalcost;

              salesToUpdate.push([sale.id,revenue, totalcost, profit, inventory, quantity]);

            });
          };

exports.getCOS = function(SQLsale,SQLpurchases,saleToUpdate,purchasesToUpdate){

              var purchases = SQLpurchases.get(sale.product_id),
                  getinfo = SQLCostAndLogSaleAt(sale.date, sale.quantity, purchases, purchasesToUpdate);

              var totalcost = getinfo.cost,
                  quantity = getinfo.quantity;

              var profit,
                  profitMargin,
                  revenue;

              if (quantity===0) {
                  revenue = sale.quantity * sale.price;
                } else {
                  revenue = (sale.quantity-quantity) * sale.price;
                }

              profit = revenue - totalcost;

              saleToUpdate.push(sale.id,revenue, totalcost, profit, quantity);

          };
