var mapData = require('./map-db-data');
console.log("THIS IS MAPDATA", mapData);
var sqlCostAndLogSaleAt = function (date, quantity, singleProductPurchases, updatePurchasesArray) {
    var cost = 0,
        purchases = singleProductPurchases,
        update = updatePurchasesArray;
    if (quantity > 0) {
        for (var j = 0; j < purchases.length; j++) {
            if (purchases[j].date <= date) {
                if (purchases[j].remaining > 0) {
                    if (purchases[j].remaining < quantity) {
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
    return {
        cost: cost,
        cant_sell: quantity
    };
}; // END OF GET COST.

var sqlInventoryRemainingAt = function (date, singleProductPurchases) {
    var purchases = singleProductPurchases.filter(function (i) {
        return i.date <= date;
    });
    return purchases.reduce(function (sum, i) {
        sum += i.remaining;
        return sum;
    }, 0);
};

exports.getCOSandLogInventory = function (salesFromDB, purchasesFromDB, salesToUpdate, purchasesToUpdate, inventoryLog) {

    //NOTE: This function is ONLY used when setting up the database with the initial raw data.
    //      The arrays constructed here are used to update ALREADY EXISTING data in the database.
    //      The 'getCOS' function should be used in all subsequent real-time queries as any events that follow
    //      will all be singular instances of a sale being inserted into the database.

    var purchases = mapData.mapPurchases(purchasesFromDB),
        sales = mapData.mapSales(salesFromDB),
        products = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    // console.log("THIS IS PURCHASES", purchases);
    salesFromDB.forEach(function (sale) {
        if (sale.product_id === 1) {
            var productPurchases = purchases.get(sale.product_id);
            console.log("THIS IS PRODUCT PURCHASES", productPurchases);
            var inventoryBefore = sqlInventoryRemainingAt(sale.date, productPurchases);
            console.log("THIS IS INVENTORY BEFORE (METHOD 1) FOR SALEID %d", sale.id, inventoryBefore);
            var getSaleDetails = sqlCostAndLogSaleAt(sale.date, sale.quantity, productPurchases, purchasesToUpdate);
            var inventoryAfter = inventoryBefore - sale.quantity;
            console.log("THIS IS INVENTORY AFTER (METHOD 1) FOR SALEID %d", sale.id, inventoryAfter);
            var costOfSale = getSaleDetails.cost,
                cant_sell = getSaleDetails.cant_sell;
            console.log("THIS IS COST OF SALE", costOfSale);
            console.log("THIS IS CANT SELL", cant_sell);

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



            salesToUpdate.push([sale.id, costOfSale, cant_sell]);
            console.log("THIS IS SALES TO UPDATE", salesToUpdate);
            inventoryLog.push([sale.date, "sale", sale.id, sale.product_id, sale.quantity, inventoryBefore, inventoryAfter, cant_sell])
                // console.log("THIS IS INVENTORY LOG", inventoryLog);
        }
    });


    products.forEach(function (product) {
        var productPurchases = purchases.get(product),
            productSales = sales.get(product);
        if (product === 1) {
            productPurchases.forEach(function (purchase) {

                var date = purchase.date;

                var sumPurchasesUntilDate = productPurchases.reduce(function (sum, i) {
                        sum += i.date < date ? i.quantity : 0;
                        return sum;
                    }, 0),

                    sumSalesUntilDate = productSales.reduce(function (sum, i) {
                        sum += i.date < date ? i.quantity : 0;
                        return sum;
                    }, 0);
                console.log("THIS IS sumPurchasesUntilDate", sumPurchasesUntilDate);
                console.log("THIS IS sumSalesUntilDate", sumSalesUntilDate);
                var inventoryBefore = sumPurchasesUntilDate - sumSalesUntilDate;
                var inventoryAfter = inventoryBefore + purchase.quantity;
                console.log("THIS IS INVENTORY BEFORE (METHOD 2) FOR PURCHASEID %d", purchase.id, inventoryBefore);

                console.log("THIS IS INVENTORY AFTER (METHOD 2) FOR PURCHASEID %d", purchase.id, inventoryAfter);

                inventoryLog.push([date, "purchase", purchase.id, purchase.product_id, purchase.quantity, inventoryBefore, inventoryAfter, "N/A"]);

            });
        }
    });
    console.log("THIS IS INVENTORY LOG", inventoryLog);

};

exports.getCOS = function (sale, purchasesFromDB, saleToInsert, purchasesToUpdate) {

    //NOTE: Here the purchases don't need to be 'mapped' because in this instance
    //      we already have retrieved only the purchases that we need  - those that correspond
    //      to the respective sale, so we don't need to have a map to retrieve anything further.
    //      Also note, that we are not using a forEach function here which means that we
    //       already know which purchases we are dealing with, so the use of a map is unnecessary.

    var purchases = purchasesFromDB;
    var inventoryBefore = sqlInventoryRemainingAt(sale.date, purchases);
    var inventoryAfter = inventoryBefore - sale.quantity;
    var getSaleDetails = sqlCostAndLogSaleAt(sale.date, sale.quantity, purchases, purchasesToUpdate);

    var costOfSale = getSaleDetails.cost;

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
    saleToInsert.push([sale.date, sale.product_id, sale.category_id, sale.quantity, costOfSale, getSaleDetails.cant_sell]);

};
