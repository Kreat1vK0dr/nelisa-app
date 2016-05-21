var dbData = require('./map-db-data');
var getCostAndLogSaleAt = function (date, quantity, singleProductPurchases, purchasesToUpdate) {
    var cost = 0,
        purchases = singleProductPurchases,
        update = new Map();
    if (quantity > 0) {
        for (var j = 0; j < purchases.length; j++) {
            if (purchases[j].date <= date) {
                if (purchases[j].remaining > 0) {
                    if (purchases[j].remaining < quantity) {
                        cost += purchases[j].remaining * purchases[j].unitcost;
                        quantity -= purchases[j].remaining;
                        purchases[j].remaining -= purchases[j].remaining;
                        update.set(purchases[j].id, purchases[j].remaining);
                        continue;
                    } else {
                        purchases[j].remaining -= quantity;
                        cost += quantity * purchases[j].unitcost;
                        quantity -= quantity;
                        update.set(purchases[j].id, purchases[j].remaining);
                        break;
                    }
                }
            }
        }
    }
    update.forEach(function (value, key) {
        purchasesToUpdate.push([key, value]);
    });
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

exports.initialCOSandInventoryLog = function (salesFromDB, purchasesFromDB, salesToUpdate, purchasesToUpdate, inventoryLog) {

    //NOTE: This function is ONLY used when setting up the database with the initial raw data.
    //      The arrays constructed here are used to update ALREADY EXISTING data in the database.
    //      The 'getCOS' function should be used in all subsequent real-time queries as any events that follow
    //      will all be singular instances of a sale being inserted into the database.
    // console.log("THIS IS SALES BEFORE MAP", salesFromDB);
    // console.log("");

    var purchases = dbData.mapData(purchasesFromDB),
        products = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

    salesFromDB.forEach(function (sale) {
        var productPurchases = purchases.get(sale.product_id);
        var inventoryBefore = sqlInventoryRemainingAt(sale.date, productPurchases);
        var getSaleDetails = getCostAndLogSaleAt(sale.date, sale.quantity, productPurchases, purchasesToUpdate);
        var inventoryAfter = inventoryBefore - sale.quantity;
        var costOfSale = getSaleDetails.cost,
            cant_sell = getSaleDetails.cant_sell;

        sale.cant_sell = getSaleDetails.cant_sell;
        sale.cos = getSaleDetails.cost;

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
        inventoryLog.push([sale.date, "SALE", sale.id, sale.product_id, sale.quantity, inventoryBefore, inventoryAfter, cant_sell])
    });

    var sales = dbData.mapData(salesFromDB);

    products.forEach(function (product) {
        if (purchases.get(product) !== undefined) {
            var productPurchases = purchases.get(product),
                productSales = sales.get(product);
            productPurchases.forEach(function (purchase) {

                var date = purchase.date;

                var sumPurchasesUntilDate = productPurchases.reduce(function (sum, i) {
                        sum += i.date < date ? i.quantity : 0;
                        return sum;
                    }, 0),

                    sumSalesUntilDate = productSales.reduce(function (sum, i) {
                        sum += i.date < date ? i.quantity - i.cant_sell : 0;
                        return sum;
                    }, 0);
                var remaining = sumPurchasesUntilDate - sumSalesUntilDate;
                var inventoryBefore = remaining > 0 ? remaining : 0;

                var inventoryAfter = inventoryBefore + purchase.quantity;

                inventoryLog.push([date, "PURCHASE", purchase.id, purchase.product_id, purchase.quantity, inventoryBefore, inventoryAfter, ""]);
            });
        }
    });

    // console.log("THIS IS INVENTORY LOG", inventoryLog);
    inventoryLog = inventoryLog.sort(function (a, b) {
        // console.log("SORTING INVENTORY LOG ==>> THIS IS A[0]", a[0]);
        // console.log("SORTING INVENTORY LOG ==>> THIS IS B[0]", b[0]);
        return a[0] - b[0];
    });
    // console.log("THIS IS INVENTORY LOG", inventoryLog);

};

exports.getCostAndLogSaleAt = getCostAndLogSaleAt;
