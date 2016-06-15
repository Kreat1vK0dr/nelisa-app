module.exports = function(connection) {

  var getAllData = function(query, cb){
        connection.query( query, cb);
    };

  var getData = function(query, data, cb){
        connection.query( query, data, cb);
    };

  var changeData = function(query, data, cb){
        connection.query(query, data, cb);
    };

  var bulkUpdate = function(queryCreate,queryInsert,queryUpdate, data, cb) {
    connection.query(queryCreate, function(err,result){
      if (err) throw err;
      console.log("CREATED A TEMPORARY PURCHASES TABLE");
      connection.query(queryInsert, data, function(err, result){
        if (err) throw err;
        console.log("INSERTED DATA INTO PURCHASES TEMP");
        connection.query(queryUpdate, cb);
      });
    });
  };

  this.getPurchasesByProduct = function(data, cb) {
    getData('SELECT * FROM purchases WHERE product_id = ? ORDER BY date',data, cb);
};

  this.getAllPurchases = function(cb) {
    getData("SELECT pu.id, DATE_FORMAT(pu.date, '%a %d %b %Y') as date, pr.description product, c.description category, s.name supplier, pu.quantity , pu.remaining, pu.unitcost FROM purchases pu, products pr, categories c, suppliers s WHERE pu.product_id = pr.id AND pu.supplier_id=s.id AND pu.category_id = c.id ORDER BY id", cb);
};
  this.getAllPurchaseDates = function(cb) {
    getData("SELECT DATE_FORMAT(date, '%d-%m-%Y') as date FROM purchases", cb);
};

  this.updatePurchases = function(data, cb) {
    // changeData("UPDATE purchases SET username = ?, role = ?, admin_role = ? WHERE id = ?",data, cb);
  };

  this.deletePurchase = function(data, cb) {
    changeData("DELETE FROM purchases WHERE id = ?", data, cb);
  };

  this.addPurchase = function(data, cb) {
    changeData("INSERT INTO purchases SET ?", data,cb);
  };
this.purchasesBulkUpdate = function(data,cb) {
  const queryCreate = "CREATE TEMPORARY TABLE if not exists purchases_temp(id int not null, remaining int not null)",
        queryInsert = "INSERT INTO purchases_temp (id, remaining) VALUES ?",
        queryUpdate = "UPDATE purchases AS dest, purchases_temp AS src SET dest.remaining = src.remaining WHERE dest.id = src.id";

  bulkUpdate(queryCreate,queryInsert,queryUpdate, data, cb);
};
  this.searchPurchaseByProduct = function (data, cb) {
        getData('SELECT pu.id, DATE_FORMAT(pu.date, "%a %d %b %Y") as date, pr.description product, c.description category, s.name supplier, pu.quantity , pu.remaining, pu.unitcost FROM purchases pu, products pr, categories c, suppliers s WHERE pu.product_id = pr.id AND pu.supplier_id=s.id AND pu.category_id = c.id AND pr.description LIKE ? ORDER BY id', data, cb);
    };
  this.searchPurchasesForGraphByProduct = function (data, cb) {
        getData('SELECT pu.id, DATE_FORMAT(pu.date, "%d/%m/%Y") as date, pr.description product, c.description category, s.name supplier, pu.quantity , pu.remaining, pu.unitcost FROM purchases pu, products pr, categories c, suppliers s WHERE pu.product_id = pr.id AND pu.supplier_id=s.id AND pu.category_id = c.id AND pr.description LIKE ? AND DATE_FORMAT(s.date,"%d/%m/%Y") BETWEEN ? AND ? ORDER BY id', data, cb);
    };
  this.searchPurchasesByCategory = function (data, cb) {
        getData('SELECT pu.id, DATE_FORMAT(pu.date, "%a %d %b %Y") as date, pr.description product, c.description category, s.name supplier, pu.quantity , pu.remaining, pu.unitcost FROM purchases pu, products pr, categories c, suppliers s WHERE pu.product_id = pr.id AND pu.supplier_id=s.id AND pu.category_id = c.id AND c.description LIKE ? ORDER BY id', data, cb);
    };
  this.searchPurchasesForGraphByCategory = function (data, cb) {
        getData('SELECT pu.id, DATE_FORMAT(pu.date, "%d/%m/%Y") as date, pr.description product, c.description category, s.name supplier, pu.quantity , pu.remaining, pu.unitcost FROM purchases pu, products pr, categories c, suppliers s WHERE pu.product_id = pr.id AND pu.supplier_id=s.id AND pu.category_id = c.id AND c.description LIKE ? AND DATE_FORMAT(s.date,"%d/%m/%Y") BETWEEN ? AND ? ORDER BY id', data, cb);
    };
  this.searchPurchases = function (data, cb) {
        getData('SELECT * FROM (SELECT pu.id, DATE_FORMAT(pu.date, "%a %d %b %Y") as date, pr.description product, c.description category, s.name supplier, pu.quantity , pu.remaining, pu.unitcost FROM purchases pu, products pr, categories c, suppliers s WHERE pu.product_id = pr.id AND pu.supplier_id=s.id AND pu.category_id = c.id) t WHERE t.product LIKE ? OR t.category LIKE ? ORDER BY t.id', data, cb);
    };

};
