var fs = require('fs'),
    draw = require('./drawTable'),
    f = require('./filter'),
    path = require('./filepaths');

var catFile = path.categoriesFile,
    prodFile = path.productsFile,
    salesFolder = path.salesFolder,
    purchasesFile = path.purchasesFile;

exports.mapSQLPurchases = function(purchasesFromDatabase) {
    var purchases = purchasesFromDatabase;
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

exports.mapSQLsales = function(salesFromDatabase) {
    var sales = salesFromDatabase;
    var map = new Map();
    sales.forEach(function(sale){

          if (!map.get(sale.product_id)) {
            map.set(sale.product_id, [sale]);
          }  else {
                  map.get(sale.product_id).push(sale);
                }
        });
    return map;
};//end of extract purchases.

var sqlCostAndLogSaleAt = function(date, quantity, mappedPurchases, updatePurchasesArray) {
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

var sqlInventoryRemainingAt = function(date, productID, mappedPurchases) {
    var purchases = mappedPurchases.get(productID).filter(function(i){return i.date <= date;});
    return purchases.reduce(function(sum,i){sum += i.remaining; return sum;},0);
  };

exports.getCOSandLogInventory = function(salesFromDB,purchasesFromDB,salesToUpdate,purchasesToUpdate,inventoryLog){

  //NOTE: This function is ONLY used when setting up the database with the initial raw data.
  //      The arrays constructed here are used to update ALREADY EXISTING data in the database.
  //      The 'getCOS' function should be used in all subsequent real-time queries as any events that follow
  //      will all be singular instances of a sale being inserted into the database.

            var purchases = mapSQLpurchases(purchasesFromDB),
                sales = mapSQLsales(salesFromDB),
                products = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];

            salesFromDB.forEach(function(sale) {

              var purchases = purchases.get(sale.product_id),
                  getinfo = sqlCostAndLogSaleAt(sale.date, sale.quantity, purchases, purchasesToUpdate);

              var costOfSale = getinfo.cost,
                  cant_sell = getinfo.quantity,
                  inventory = sqlInventoryRemainingAt(sale.date, sale.product_id, purchases);

              // NOTE: RATHER CALCULATE REVENUE & PROFIT, PROFIT MARGIN IN A QUERY WHEN SELECTING FROM DATABASE INSTEAD OF INSERTING INTO TABLE
              // var profit,
              //     profitMargin,
              //     revenue;
              // if (quantity===0) {
              //     revenue = sale.quantity * sale.price;
              //   } else {
              //     revenue = (sale.quantity-quantity) * sale.price;
              //   }

              // profit = revenue - totalcost;

              var inventoryBefore = inventory+quantity,
                  inventoryAfter = inventory;

              salesToUpdate.push([sale.id, costOfSale, cant_sell]);
              inventoryLog.push([sale.date, "sale", sale.id, sale.product_id, sale.quantity, inventoryBefore, inventoryAfter, cant_sell])

            });


            products.forEach(function(product){
              var productPurchases = purchases.get(product),
                  salesPurchases = sales.get(product);
              productPurchases.forEach(function(purchase)
                  var date = purchase.date;
                  var sumPurchasesUntilDate = productPurchases.reduce(function(sum,i){
                                              sum += i.date<date ? i.quantity : 0;
                                              return sum;
                                            },0),
                      sumSalesUntilDate = productSales.reduce(function(sum,i){
                                          sum += i.date<date ? i.quantity : 0;
                                          return sum;
                                          },0);
                  var inventoryBefore = sumPurchasesUntilDate - sumSalesUntilDate;
                  var inventoryAfter = inventoryBefore + purchase.quantity;
                  inventoryLog.push([date, "purchase", purchase.id, purchase.product_id, purchase.quantity, inventoryBefore, inventoryAfter, "N/A"])

            });
          });

          };

exports.getCOS = function(sale, purchasesFromDB,saleToInsert,purchasesToUpdate){

              //NOTE: Here the purchases don't need to be 'mapped' because in this instance
              //      we already have retrieved only the purchases that we need  - those that correspond
              //      to the respective sale, so we don't need to have a map to retrieve anything further.
              //      Also note, that we are not using a forEach function here which means that we
             //       already know which purchases we are dealing with, so the use of a map is unnecessary.

              var purchases = purchasesFromDB;
              var getinfo = sqlCostAndLogSaleAt(sale.date, sale.quantity, purchases, purchasesToUpdate);

              var costOfSale = getinfo.cost,
                  cant_sell = getinfo.quantity;

              // NOTE: RATHER CALCULATE REVENUE & PROFIT, PROFIT MARGIN IN A QUERY WHEN SELECTING FROM DATABASE INSTEAD OF INSERTING INTO TABLE
              // if (quantity===0) {
              //     revenue = sale.quantity * sale.price;
              //   } else {
              //     revenue = (sale.quantity-quantity) * sale.price;
              //   }

              // profit = revenue - totalcost;

              // NOTE: 'cant_sell' should, ideally, not be pushed to the database in this fashion.
              //        I want to create a trigger that will automatically fill in this value
              //        from calculations made within the database.
              saleToInsert.push([sale.date, sale.product_id, sale.category_id, sale.quantity, cant_sell, costOfSale]);

          };
