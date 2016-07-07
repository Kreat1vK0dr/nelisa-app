var Promise = require('bluebird');

module.exports = function(connection) {

  var getAllData = function(query){
    return new Promise(function(resolve, reject){
      connection.query(query, function(err, results){
        if (err) return reject(err);
        resolve(results)
      });
    });
    };

  var getData = function(query, data){
    return new Promise(function(resolve, reject){
        connection.query( query, data, function(err, results){
          if (err) return reject(err);
          resolve(results);
        });
      });
    };

var addData = function(query1,query2, data1, data2){
  return new Promise(function(resolve, reject){
    connection.query(query1,data1, function(err, row){
      if (err) reject(err);
      var saleId = row.insertId,
          saleDetailsToAdd = data2.map(function (item) {
          item.push(saleId);
          return item;
      });
      connection.query(query2, [saleDetailsToAdd], function(err, rows){
        if (err) reject(err);
        console.log("THIS IS ROWS", rows);
        resolve(rows);
      });
    });
  });
}

    var changeData = function(query, data){
      return new Promise(function(resolve, reject){
       connection.query(query, data, function(err, results){
         if (err) return reject(err);
         resolve(results);
       });
    });
    };

  this.getSaleDetails = function(data) {
  return  getData("SELECT s.id, s.sale_id, DATE_FORMAT(s.date, '%b %a %d %Y %h:%i %p') as date, p.description product, c.description category, s.quantity , s.cost, s.quantity*s.price revenue, (s.quantity*s.price)-s.cost profit  FROM sales_details s, products p, categories c WHERE s.product_id = p.id AND s.category_id = c.id AND s.id = ? ORDER BY s.product_id",data);
};
  this.getSaleDetailsBySaleId = function(data) {
  return  getData("SELECT s.id, s.sale_id, DATE_FORMAT(s.date, '%b %a %d %Y %h:%i %p') as date, p.description product, c.description category, s.quantity , s.cost, s.quantity*s.price revenue, (s.quantity*s.price)-s.cost profit  FROM sales_details s, products p, categories c WHERE s.product_id = p.id AND s.category_id = c.id AND s.sale_id = ? ORDER BY s.product_id",data);
};
  this.getSale = function(data) {
  return  getData("SELECT s.id, DATE_FORMAT(s.date, '%a %d %b %Y') as date, s.total_quantity itemsSold, s.unique_products uniqueProducts, s.sum_total revenue, s.total_cost cost, s.sum_total-s.total_cost profit  FROM sales s WHERE s.id = ?",data);
};
  this.getAllSales = function() {
  return  getAllData("SELECT s.id, DATE_FORMAT(s.date, '%m/%d/%Y') as date, s.total_quantity itemsSold, s.unique_products uniqueProducts, s.sum_total revenue, s.total_cost cost, s.sum_total-s.total_cost profit  FROM sales s ORDER BY s.date");
};
  this.getAllSaleDates = function() {
  return  getAllData("SELECT DATE_FORMAT(date, '%m-%d-%Y') as date FROM sales ORDER BY date");
};

  this.getAllSalesDetails = function() {
  return  getData("SELECT s.id, s.sale_id, DATE_FORMAT(s.date, '%a %d %b %Y') as date, p.description product, c.description category, s.quantity , s.cost, s.quantity*s.price revenue, (s.quantity*s.price)-s.cost profit FROM sales_details s, products p, categories c WHERE s.product_id = p.id AND s.category_id = c.id ORDER BY id");
};

  this.deleteSale = function(data) {
  return  changeData("DELETE FROM sales WHERE id = ?", data);
  };
  this.deleteSaleDetails = function(data) {
  return  changeData("DELETE FROM sales_details WHERE id = ?", data);
  };
  this.deleteSaleDetailsBySaleId = function(data) {
  return  changeData("DELETE FROM sales_details WHERE sale_id = ?", data);
  };

  this.addSale = function(data) {
  return  changeData("INSERT INTO sales SET ?", data);
  };

  this.addSaleDetails = function(data) {
  return  changeData("INSERT INTO sales_details (date,day,week, product_id,category_id,price,quantity,cost, sale_id) VALUES ?", data);
  };

  this.addSaleAndDetails = function(data1, data2) {
    var addSaleQuery = "INSERT INTO sales SET ?",
        addSaleDetailsQuery = "INSERT INTO sales_details (date,day,week, product_id,category_id,price,quantity,cost, sale_id) VALUES ?";

  return  addData(addSaleQuery, addSaleDetailsQuery, data1, data2);
  };

  this.searchSalesDetailsByProduct = function (data) {
      return  getData('SELECT s.id, s.sale_id, DATE_FORMAT(s.date, "%a %d %b %Y") as date, p.description product, c.description category, s.quantity , s.cost, s.quantity*s.price revenue, (s.quantity*s.price)-s.cost profit  FROM sales_details s, products p, categories c WHERE s.product_id = p.id AND s.category_id = c.id AND p.description LIKE ? ORDER BY id', data);
    };
  this.searchSalesDetailsByCategory = function (data) {
      return  getData('SELECT s.id, s.sale_id, DATE_FORMAT(s.date, "%a %d %b %Y") as date, p.description product, c.description category, s.quantity , s.cost, s.quantity*s.price revenue, (s.quantity*s.price)-s.cost profit  FROM sales_details s, products p, categories c WHERE s.product_id = p.id AND s.category_id = c.id AND c.description LIKE ? ORDER BY id', data);
    };
  this.searchSalesDetails = function (data) {
      return  getData('SELECT * FROM (SELECT s.id, s.sale_id, DATE_FORMAT(s.date, "%a %d %b %Y") as date, p.description product, c.description category, s.quantity , s.cost, s.quantity*s.price revenue, (s.quantity*s.price)-s.cost profit  FROM sales_details s, products p, categories c WHERE s.product_id = p.id AND s.category_id = c.id) t WHERE t.category LIKE ? OR t.product LIKE ? ORDER BY t.id', data);
    };

  this.searchSales = function (data) {
      return  getData('SELECT s.id, DATE_FORMAT(s.date, "%d/%l/%Y") as date, s.total_quantity itemsSold, s.unique_product uniqueProducts, s.sum_total revenue, s.total_cost cost, s.revenue-s.cost profit  FROM sales s, products p, categories c WHERE s.product_id = p.id AND s.category_id = c.id AND p.description LIKE ? ORDER BY id', data);
    };
};
