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

  this.getPurchase = function(data, cb) {
    getData("SELECT pu.id, DATE_FORMAT(pu.date, '%b %a %d %Y %h:%i %p') as date, pr.description product, c.description category, s.name supplier, pu.quantity , pu.remaining, pu.unitcost FROM purchases pu, products pr, categories c, suppliers s WHERE pu.product_id = pr.id AND pu.supplier_id=s.id AND pu.category_id = c.id WHERE username = ? ORDER BY id",data, cb);
};

  this.getAllPurchases = function(cb) {
    getData("SELECT pu.id, DATE_FORMAT(pu.date, '%b %a %d %Y %h:%i %p') as date, pr.description product, c.description category, s.name supplier, pu.quantity , pu.remaining, pu.unitcost FROM purchases pu, products pr, categories c, suppliers s WHERE pu.product_id = pr.id AND pu.supplier_id=s.id AND pu.category_id = c.id ORDER BY id", cb);
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

  this.searchPurchase = function (data, cb) {
        getData('SELECT pu.id, DATE_FORMAT(pu.date, "%d/%l/%Y") as date, pr.description product, c.description category, s.name supplier, pu.quantity , pu.remaining, pu.unitcost FROM purchases pu, products pr, categories c, suppliers s WHERE pu.product_id = pr.id AND pu.supplier_id=s.id AND pu.category_id = c.id AND pr.description LIKE ? ORDER BY id', data, cb);
    };
};
