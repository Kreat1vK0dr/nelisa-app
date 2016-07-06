var Promise = require('bluebird')

// Promise.promisify(connection.query, connection)('SELECT 1').then(function (rows) {
//   console.log('got rows!')
//   console.dir(rows)
//   connection.end()
// })
module.exports = function(connection) {

  // var getAllData = function(query, cb){
  //       Promise.promisify(connection.query, conneciton)(query).then(cb);
  //   };
  var getAllData = function(query, cb){
        connection.query( query, cb);
    };

  var getData = function(query, data, cb){
        connection.query( query, data, cb);
    };

    var changeData = function(query, data, cb){
        connection.query(query, data, cb);
      };

  var getDataAndLoop = function(query, data, cb) {
    var track,
     remaining = [],
     showTimeLine = data[0],
     byCategory = data[3];

    if (showTimeLine) {
      var product = data[1],
            dates = data[2];

      track = dates.length;
      dates.forEach(function(date){
        if (byCategory) {
          var remainingAtDate = {p_ids: [], date: date, remaining: 0};
          for (var i = 0; i<product.length;i++) {
          connection.query(query,[product[i], date],function (err, data){
            if (err) throw err;
            remainingAtDate.p_ids.push(product[i]);
            if (data.length!=0){
            remainingAtDate.remaining += data[0].remaining;
          }
            if (i===product.length-1) {
            remaining.push(remainingAtDate);
            track--;
            }
            if (track===0) {
              cb(null, remaining);
            }
          });
        }
        } else {
        connection.query(query,[product, date],function (err, data){
          if (err) throw err;
          var remainingAtDate = {p_id: product, date: date, remaining: 0};
          if (data.length!=0){
          remainingAtDate.remaining = data[0].remaining;
          }
          remaining.push(remainingAtDate);
          track--;
          if (track===0) {
            cb(null, remaining);
          }
        });
      }
    });
  } else if (!showTimeLine) {
    var products = data[1],
          endDate = data[2][1];

    track = products.length

    products.forEach(function(product){

      connection.query(query,[product,endDate],function (err, data){
        if (err) throw err;
        console.log("THIS IS PRODUCTS", products);
        console.log("THIS IS EACH PRODUCT",product);
        console.log("THIS IS DATA LENGTH", data.length);
        if (data.length!=0) {
        remaining.push(data[0].remaining);
      } else {
        remaining.push(0);
      }
        track--;
        if (track===0) {
          // console.log("COMPLETED BATCH",remaining);
          cb(null, remaining);
        }
      });
    });
  }
  };

this.getSalesAllProducts = function(data, cb) {
  if (request==="categ")
  getData('SELECT s.id, s.sale_id, p.description product, s.product_id p_id, c.description category, s.category_id c_id, SUM(s.quantity) quantity, SUM(s.quantity*s.price) revenue, SUM(s.cost) cost, SUM((s.quantity*s.price)-s.cost) profit  FROM sales_details s, products p, categories c WHERE s.product_id = p.id AND s.category_id = c.id AND DATE_FORMAT(s.date,"%m/%d/%Y") BETWEEN ? AND ? GROUP BY s.product_id',data,cb);
};

this.getSalesByProduct = function(data, cb) {
  getData('SELECT * FROM (SELECT s.id, s.sale_id, s.product_id p_id, DATE_FORMAT(s.date, "%m/%d/%Y") as date, p.description product, c.description category, s.quantity , s.cost, s.quantity*s.price revenue, (s.quantity*s.price)-s.cost profit FROM sales_details s, products p, categories c WHERE s.product_id = p.id AND s.category_id = c.id AND p.id = ? AND DATE_FORMAT(s.date,"%m/%d/%Y") BETWEEN ? AND ?) t GROUP BY t.date',data,cb);
};

this.getSalesAllCategories = function(data, cb) {
  getData('SELECT s.id, s.sale_id, c.description category, s.category_id c_id, SUM(s.quantity) quantity, SUM(s.quantity*s.price) revenue, SUM(s.cost) cost, SUM((s.quantity*s.price)-s.cost) profit  FROM sales_details s, products p, categories c WHERE s.product_id = p.id AND s.category_id = c.id AND DATE_FORMAT(s.date,"%m/%d/%Y") BETWEEN ? AND ? GROUP BY s.category_id',data,cb);
};

this.getSalesByCategory = function(data, cb) {
  getData('SELECT * FROM (SELECT s.id, s.sale_id, DATE_FORMAT(s.date, "%m/%d/%Y") as date, c.description category, s.quantity , s.cost, s.quantity*s.price revenue, (s.quantity*s.price)-s.cost profit  FROM sales_details s, products p, categories c WHERE s.product_id = p.id AND s.category_id = c.id AND c.id = ? AND DATE_FORMAT(s.date,"%m/%d/%Y") BETWEEN ? AND ?) t GROUP BY t.date',data,cb);
};

this.getPurchasesAllProducts = function (data, cb) {
      getData('SELECT pu.id, pu.product_id p_id, pu.category_id c_id, pr.description product, c.description category, s.name supplier, SUM(pu.quantity) quantity , SUM(pu.remaining) remaining, SUM(pu.unitcost) unitcost FROM purchases pu, products pr, categories c, suppliers s WHERE pu.product_id = pr.id AND pu.supplier_id=s.id AND pu.category_id = c.id AND DATE_FORMAT(pu.date,"%m/%d/%Y") BETWEEN ? AND ? GROUP BY pu.product_id', data, cb);
  };

this.getPurchasesByProduct = function (data, cb) {
      getData('SELECT * FROM (SELECT pu.id, DATE_FORMAT(pu.date, "%m/%d/%Y") as date, pr.description product, c.description category, s.name supplier, pu.quantity , pu.remaining, pu.unitcost FROM purchases pu, products pr, categories c, suppliers s WHERE pu.product_id = pr.id AND pu.supplier_id=s.id AND pu.category_id = c.id AND pr.id = ? AND DATE_FORMAT(pu.date,"%m/%d/%Y") BETWEEN ? AND ?) t GROUP BY t.date', data, cb);
  };

this.getPurchasesAllCategories = function (data, cb) {
      getData('SELECT pu.id, c.description category, pu.category_id c_id, s.name supplier, SUM(pu.quantity) quantity , SUM(pu.remaining) remaining, SUM(pu.unitcost) unitcost FROM purchases pu, products pr, categories c, suppliers s WHERE pu.product_id = pr.id AND pu.supplier_id=s.id AND pu.category_id = c.id AND DATE_FORMAT(pu.date,"%m/%d/%Y") BETWEEN ? AND ? GROUP BY pu.category_id', data, cb);
  };
this.getPurchasesByCategory = function (data, cb) {
      getData('SELECT * FROM (SELECT pu.id, DATE_FORMAT(pu.date, "%m/%d/%Y") as date, c.description category, s.name supplier, pu.quantity , pu.remaining, pu.unitcost FROM purchases pu, products pr, categories c, suppliers s WHERE pu.product_id = pr.id AND pu.supplier_id=s.id AND pu.category_id = c.id AND c.id = ? AND DATE_FORMAT(pu.date,"%m/%d/%Y") BETWEEN ? AND ?) t GROUP BY t.date', data, cb);
  };

this.getInventoryRemainingAll = function(data,cb) {
  var sqlQuery = "SELECT product_id p_id, inv_aft_action remaining FROM inventory_log WHERE product_id = ? AND DATE_FORMAT(date, '%Y-%m-%d') <= STR_TO_DATE(?, '%m/%d/%Y') ORDER BY date DESC LIMIT 1";
  getDataAndLoop(sqlQuery, data, cb);
};

this.getInventoryRemainingSingle = function(data, cb) {
  var sqlquery = "SELECT product_id p_id, inv_aft_action remaining FROM inventory_log WHERE product_id = ? AND DATE_FORMAT(date, '%Y-%m-%d') <= STR_TO_DATE(?, '%m/%d/%Y') ORDER BY id DESC LIMIT 1";
  // var sqlquery = "SELECT product_id p_id, inv_aft_action remaining FROM inventory_log WHERE product_id = ? AND DATE_FORMAT(date,'%m/%d/%Y') <= ? ORDER BY id DESC LIMIT 1";

  getDataAndLoop(sqlquery, data, cb);
};
this.getCategory = function(data,cb) {
  getData("SELECT id, description category FROM categories WHERE id = ?",data,cb);
}
this.getProduct = function(data, cb) {
  getData("SELECT p.id p_id, p.description product, c.description category, p.category_id c_id FROM products p, categories c WHERE p.category_id = c.id AND id = ?",data, cb);
};

this.getAllProducts = function(cb) {
  getAllData("SELECT p.id p_id, p.description product, c.description category, p.category_id c_id FROM products p, categories c WHERE p.category_id = c.id ORDER BY p.id", cb);
};

};
