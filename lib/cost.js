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

exports.SQLCostAndLogSaleAt = function(date, quantity, mappedPurchases, updatePurchasesArray) {
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

exports.SQLInventoryRemainingAt = function(date, productID, mappedPurchases) {
    var purchases = mappedPurchases.get(productID).filter(function(i){return i.date <= date;});
    // console.log(draw.table(draw.dataTable(purchases)));
    return purchases.reduce(function(sum,i){sum += i.remaining; return sum;},0);
  };
