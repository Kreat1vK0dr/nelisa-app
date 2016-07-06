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

  this.getSaleDetails = function(data, cb) {
    getData("SELECT s.id, s.sale_id, DATE_FORMAT(s.date, '%b %a %d %Y %h:%i %p') as date, p.description product, c.description category, s.quantity , s.cost, s.quantity*s.price revenue, (s.quantity*s.price)-s.cost profit  FROM sales s, products p, categories c WHERE s.product_id = p.id AND s.category_id = c.id WHERE s.id = ? ORDER BY id",data, cb);
};
  this.getSale = function(data, cb) {
    getData("SELECT s.id, DATE_FORMAT(s.date, '%a %d %b %Y') as date, s.total_quantity itemsSold, s.unique_product uniqueProducts, s.sum_total revenue, s.total_cost cost, s.revenue-s.cost profit  FROM sales s, products p, categories c WHERE s.product_id = p.id AND s.category_id = c.id WHERE s.id = ? ORDER BY id",data, cb);
};
  this.getAllSales = function(data, cb) {
    getData("SELECT s.id, DATE_FORMAT(s.date, '%m/%d/%Y') as date, s.total_quantity itemsSold, s.unique_product uniqueProducts, s.sum_total revenue, s.total_cost cost, s.revenue-s.cost profit  FROM sales s, products p, categories c WHERE s.product_id = p.id AND s.category_id = c.id ORDER BY date",data, cb);
};
  this.getAllSaleDates = function(data, cb) {
    getData("SELECT DATE_FORMAT(date, '%m-%d-%Y') as date FROM sales ORDER BY date",data, cb);
};

  this.getAllSalesDetails = function(cb) {
    getData("SELECT s.id, s.sale_id, DATE_FORMAT(s.date, '%a %d %b %Y') as date, p.description product, c.description category, s.quantity , s.cost, s.quantity*s.price revenue, (s.quantity*s.price)-s.cost profit FROM sales_details s, products p, categories c WHERE s.product_id = p.id AND s.category_id = c.id ORDER BY id", cb);
};

  this.deleteSale = function(data, cb) {
    changeData("DELETE FROM sales WHERE id = ?", data, cb);
  };
  this.deleteSalesDetail = function(data, cb) {
    changeData("DELETE FROM sales_details WHERE id = ?", data, cb);
  };

  this.addSale = function(data, cb) {
    changeData("INSERT INTO sales SET ?", data,cb);
  };

  this.addSaleDetails = function(data, cb) {
    changeData("INSERT INTO sales_details (date,day,week, product_id,category_id,price,quantity,cost, sale_id) VALUES ?", data,cb);
  };

  this.searchSalesDetailsByProduct = function (data, cb) {
        getData('SELECT s.id, s.sale_id, DATE_FORMAT(s.date, "%a %d %b %Y") as date, p.description product, c.description category, s.quantity , s.cost, s.quantity*s.price revenue, (s.quantity*s.price)-s.cost profit  FROM sales_details s, products p, categories c WHERE s.product_id = p.id AND s.category_id = c.id AND p.description LIKE ? ORDER BY id', data, cb);
    };
  this.searchSalesDetailsByCategory = function (data, cb) {
        getData('SELECT s.id, s.sale_id, DATE_FORMAT(s.date, "%a %d %b %Y") as date, p.description product, c.description category, s.quantity , s.cost, s.quantity*s.price revenue, (s.quantity*s.price)-s.cost profit  FROM sales_details s, products p, categories c WHERE s.product_id = p.id AND s.category_id = c.id AND c.description LIKE ? ORDER BY id', data, cb);
    };
  this.searchSalesDetails = function (data, cb) {
        getData('SELECT * FROM (SELECT s.id, s.sale_id, DATE_FORMAT(s.date, "%a %d %b %Y") as date, p.description product, c.description category, s.quantity , s.cost, s.quantity*s.price revenue, (s.quantity*s.price)-s.cost profit  FROM sales_details s, products p, categories c WHERE s.product_id = p.id AND s.category_id = c.id) t WHERE t.category LIKE ? OR t.product LIKE ? ORDER BY t.id', data, cb);
    };

  this.searchSales = function (data, cb) {
        getData('SELECT s.id, DATE_FORMAT(s.date, "%d/%l/%Y") as date, s.total_quantity itemsSold, s.unique_product uniqueProducts, s.sum_total revenue, s.total_cost cost, s.revenue-s.cost profit  FROM sales s, products p, categories c WHERE s.product_id = p.id AND s.category_id = c.id AND p.description LIKE ? ORDER BY id', data, cb);
    };
};
