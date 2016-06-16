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

this.getSalesAllProducts = function(data, cb) {
  getData('SELECT s.id, s.sale_id, DATE_FORMAT(s.date, "%m/%d/%Y") as date, p.description product, c.description category, SUM(s.quantity) quantity, SUM(s.quantity*s.price) revenue, SUM(s.cost) cost, SUM((s.quantity*s.price)-s.cost) profit  FROM sales_details s, products p, categories c WHERE s.product_id = p.id AND s.category_id = c.id AND DATE_FORMAT(s.date,"%m/%d/%Y") BETWEEN ? AND ? GROUP BY p.id',data,cb);
};
this.getSalesByProduct = function(data, cb) {
  getData('SELECT s.id, s.sale_id, DATE_FORMAT(s.date, "%m/%d/%Y") as date, p.description product, c.description category, s.quantity , s.cost, s.quantity*s.price revenue, (s.quantity*s.price)-s.cost profit  FROM sales_details s, products p, categories c WHERE s.product_id = p.id AND s.category_id = c.id AND p.id = ? AND DATE_FORMAT(s.date,"%m/%d/%Y") BETWEEN ? AND ?',data,cb);
};
this.getSalesAllCategories = function(data, cb) {
  getData('SELECT s.id, s.sale_id, DATE_FORMAT(s.date, "%m/%d/%Y") as date, p.description product, c.description category, SUM(s.quantity) quantity, SUM(s.quantity*s.price) revenue, SUM(s.cost) cost, SUM((s.quantity*s.price)-s.cost) profit  FROM sales_details s, products p, categories c WHERE s.product_id = p.id AND s.category_id = c.id AND c.id = ? AND DATE_FORMAT(s.date,"%m/%d/%Y") BETWEEN ? AND ? GROUP BY c.id',data,cb);
};
this.getSalesByCategory = function(data, cb) {
  getData('SELECT s.id, s.sale_id, DATE_FORMAT(s.date, "%m/%d/%Y") as date, p.description product, c.description category, s.quantity , s.cost, s.quantity*s.price revenue, (s.quantity*s.price)-s.cost profit  FROM sales_details s, products p, categories c WHERE s.product_id = p.id AND s.category_id = c.id AND c.id = ? AND DATE_FORMAT(s.date,"%m/%d/%Y") BETWEEN ? AND ?',data,cb);
};
this.getPurchasesAllProducts = function (data, cb) {
      getData('SELECT pu.id, DATE_FORMAT(pu.date, "%m/%d/%Y") as date, pr.description product, c.description category, s.name supplier, SUM(pu.quantity) quantity , SUM(pu.remaining) remaining, SUM(pu.unitcost) unitcost FROM purchases pu, products pr, categories c, suppliers s WHERE pu.product_id = pr.id AND pu.supplier_id=s.id AND pu.category_id = c.id AND DATE_FORMAT(s.date,"%m/%d/%Y") BETWEEN ? AND ? GROUP BY pr.id', data, cb);
  };
this.getPurchasesByProduct = function (data, cb) {
      getData('SELECT pu.id, DATE_FORMAT(pu.date, "%m/%d/%Y") as date, pr.description product, c.description category, s.name supplier, pu.quantity , pu.remaining, pu.unitcost FROM purchases pu, products pr, categories c, suppliers s WHERE pu.product_id = pr.id AND pu.supplier_id=s.id AND pu.category_id = c.id AND pr.id = ? AND DATE_FORMAT(s.date,"%m/%d/%Y") BETWEEN ? AND ?', data, cb);
  };

this.getPurchasesByCategory = function (data, cb) {
      getData('SELECT pu.id, DATE_FORMAT(pu.date, "%m/%d/%Y") as date, pr.description product, c.description category, s.name supplier, SUM(pu.quantity) quantity , SUM(pu.remaining) remaining, SUM(pu.unitcost) unitcost FROM purchases pu, products pr, categories c, suppliers s WHERE pu.product_id = pr.id AND pu.supplier_id=s.id AND pu.category_id = c.id AND DATE_FORMAT(s.date,"%m/%d/%Y") BETWEEN ? AND ? GROUP BY c.id', data, cb);
  };
this.getPurchasesByCategory = function (data, cb) {
      getData('SELECT pu.id, DATE_FORMAT(pu.date, "%m/%d/%Y") as date, pr.description product, c.description category, s.name supplier, pu.quantity , pu.remaining, pu.unitcost FROM purchases pu, products pr, categories c, suppliers s WHERE pu.product_id = pr.id AND pu.supplier_id=s.id AND pu.category_id = c.id AND c.id = ? AND DATE_FORMAT(s.date,"%m/%d/%Y") BETWEEN ? AND ?', data, cb);
  };

};
