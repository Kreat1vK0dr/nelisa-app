var mapData = function (dataFromDatabase) {
    var data = dataFromDatabase;
    var map = new Map();
    data.forEach(function (item) {
        var time = item.date.getHours() + item.date.getMinutes() + item.date.getSeconds() + item.date.getMilliseconds();
        if (item.cos !== undefined && time === 0) {
            item.date = new Date(item.date.setHours(1));
        }

        if (!map.get(item.product_id)) {
            map.set(item.product_id, [item]);
        } else {
            map.get(item.product_id).push(item);
        }
    });
    return map;
}; //end of extract purchases.

exports.combinedMap = function (salesFromDatabase, purchasesFromDatabase) {
    var map = new Map();

    var purchases = mapData(purchasesFromDatabase),
        sales = mapData(salesFromDatabase);

    sales.forEach(function (value, key) {

        var purchaseList = purchases.get(key);
        var combine = value.concat(purchaseList).sort(function (a, b) {
            return a[0] - b[0];
        });
        sales.set(key, combine);
    });
};

exports.mapData = mapData;
