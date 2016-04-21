exports.mapPurchases = function (purchasesFromDatabase) {
    var purchases = purchasesFromDatabase;
    var map = new Map();
    purchases.forEach(function (purchase) {

        if (!map.get(purchase.product_id)) {
            map.set(purchase.product_id, [purchase]);
        } else {
            map.get(purchase.product_id).push(purchase);
        }
    });
    return map;
}; //end of extract purchases.

exports.mapSales = function (salesFromDatabase) {
    var sales = salesFromDatabase;
    var map = new Map();
    sales.forEach(function (sale) {

        if (!map.get(sale.product_id)) {
            map.set(sale.product_id, [sale]);
        } else {
            map.get(sale.product_id).push(sale);
        }
    });
    return map;
}; //end of extract purchases.
