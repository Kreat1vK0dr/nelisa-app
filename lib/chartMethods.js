const fs = require('fs');

exports.home = function(req,res){
  // var context = req.session.context;
  var context ={},
      dataService;

  context.name = "Daniel";
  context.graph = "Sales by Product";
  req.services(function(err, services){
    dataService = services.productDataService;
    dataService.getAllProducts(function(err, products){
      if (err) return next (err);
      context.products = products;
    dataService = services.categoryDataService;
    dataService.getAllCategories(function(err, categories){
      if (err) return next (err);
      context.categories = categories;
      res.render('data_home',context);
    });
  });
});
};

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

function uniqueDates(datesFromQuery){
  var allDates,
      uniqueDates;

  allDatesArray = datesFromQuery.map(function(i){
    return i.date;
  });
  uniqueDates = Array.from(new Set(allDatesArray));
  return uniqueDates;
}

function dateDetails(allDates,saleDates,purchaseDates) {
  var dateDetails,
      purchaseDate,
      salesDate,
      onlyPurchaseDate,
      onlySalesDate,
      both;

  dateDetails = allDates.map(function(date){
    purchaseDate = purchaseDates.indexOf(date) != -1;
    salesDate = saleDates.indexOf(date) != -1;
    onlyPurchaseDate = purchaseDate && !salesDate;
    onlySalesDate = salesDate && !purchaseDate;
    both = purchaseDate && salesDate;

    if (onlyPurchaseDate) {
      return {date: date, toolTipText: "Only purchases data available", cssClass: "purchase-date"};
    } else if (onlySalesDate) {
      return {date: date, toolTipText: "Only sales data available", cssClass: "sale-date"};
    } else if (both) {
      return {date: date, toolTipText: "Sales and purchases data available", cssClass: "date"};
    }
  });

  return dateDetails;
}

function allUniqueDates(uniqueSaleDates, uniquePurchaseDates) {
  var allDates,
      uniqueDates;

  allDates = uniqueSaleDates.concat(uniquePurchaseDates);
  uniqueDates = Array.from(new Set(allDates));
  return uniqueDates;
}

exports.getAvailableDates = function(req,res,next) {
  var uniqueSaleDates,
      uniquePurchaseDates,
      allDates,
      availableDates,
      availableDateDetails,
      dataService;

        req.services(function(err, services){
          dataService = services.salesDataService;
          dataService.getAllSaleDates(function(err, saleDates){
            if (err) return next (err);
          uniqueSaleDates = uniqueDates(saleDates);

          dataService = services.purchasesDataService;
          dataService.getAllPurchaseDates(function(err, purchaseDates){
            if (err) return next (err);

            uniquePurchaseDates =  uniqueDates(purchaseDates);

            availableDates = allUniqueDates(uniqueSaleDates, uniquePurchaseDates);

            availableDateDetails = dateDetails(availableDates,uniqueSaleDates,uniquePurchaseDates);

            console.log(dateDetails);
            res.send(JSON.stringify({availableDates: availableDates, dateDetails: availableDateDetails}));
          });
          });
      });
};
