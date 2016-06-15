const fs = require('fs');

exports.getGraphData = function(req, res,next){
  var data;
  req.getConnection(function(err,connection){
    connection.query("SELECT s.week, p.description product, c.description category, SUM(s.quantity) quantity, SUM(s.quantity*s.price) revenue, SUM(s.cost) cost, SUM((s.quantity*s.price)-s.cost) profit FROM sales_details s, products p, categories c WHERE s.product_id=p.id AND s.category_id=c.id GROUP BY s.product_id ORDER BY s.product_id", function(err, result){
      if (err) return next(err);
      data = {data: result};
      res.send(JSON.stringify(data));
      //   console.log("Sent data");
      // fs.writeFile('./public/data/sales.json', JSON.stringify(data), function(err){
      //   if (err) return next (err);
      //   console.log("Data written to file");
        // res.redirect('/graphs');
      // });
      });
  });
};

exports.getAvailableDates = function(req,res,next) {
  var allSaleDates, uniqueSaleDates, allPurchaseDates, uniquePurchaseDates, dataService;
        req.services(function(err, services){
          dataService = services.salesDataService;
          dataService.getAllSaleDates(function(err, saleDates){
            if (err) return next (err);
            allSaleDates = saleDates.map(function(sale){
              return sale.date;
            });
            uniqueSaleDates = Array.from(new Set(allSaleDates));
          dataService = services.purchasesDataService;
          dataService.getAllPurchaseDates(function(err, purchaseDates){
            if (err) return next (err);
            allPurchaseDates = purchaseDates.map(function(purchase){
              return purchase.date;
            });

            res.send(JSON.stringify({availableDates: uniqueDates}));
          })
          });
      });
};
