const fs = require('fs');

exports.home = function(req,res){
  // var context = req.session.context;
  var context ={},
      dataService;

  context.name = "Daniel";
  context.graph = "Sales by Product";
  req.services(function(err, services){
    // dataService = services.productServicePromise;
    dataService = services.productDataService;
    dataService.getAllProducts(function(err, products){
      if (err) return next (err);
      // context.products = dataService.getAllProducts();
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

exports.getGraphData = function(req, res,next) {
  console.log("Pressed SHOW GRAPH on client side", req.body);

  var dataToSend = {},
      dataService,
      byProduct,
      byCategory,
      allProducts,
      allCategories,
      displayValue,
      displayQuantity,
      getSalesAndPurchases,
      compareDates,
      showTimeLine,
      multiFilters;

  var dataReceived = req.body;

  console.log("THIS IS RECEIVED DATA", dataReceived);

var inputDates = dataReceived['inputDates[]'],
    dataOption = dataReceived.dataOption,
    dataSelection = dataReceived.dataSelection,
    display = dataReceived['filterSelection[]'],
    filterSelection = typeof display === "object" ? display : [display],
    filterOption = dataReceived.filterOption;

    byProduct = dataOption==="product";
    byCategory = dataOption==="category";
    allProducts = byProduct && dataSelection==="all";
    allCategories = byCategory && dataSelection==="all";
    displayValue = filterOption ==="value";
    displayQuantity = filterOption ==="quantity";
    compareDates = inputDates.length === 4;
    numberOfFilters = filterSelection.length;
    multiFilters = numberOfFilters > 1;

    showTimeLine = ((byProduct || byCategory) && (allProducts || allCategories)) ? false : true;

    getPurchasesQuantity = filterSelection.indexOf('purchased')!=-1;
    getSalesQuantity = filterSelection.indexOf('sold')!=-1;
    getSalesAndPurchases = getPurchasesQuantity && getSalesQuantity;

  req.services(function(err,services){
    var date1 = inputDates[0],
        date2 = inputDates[1],
        date1Comp = inputDates[2],
        date2Comp = inputDates[3];
    var dates = compareDates ? [[date1,date2],[date1Comp,date2Comp]] : [[date1,date2]];
    dataService = services.chartDataService;

    var track = dates.length;

    dataToSend.compareDateRange = compareDates;
    dataToSend.dates = dates;
    dataToSend.multifilter = multiFilters;
    dataToSend.showTimeLine = showTimeLine;
    dataToSend.compareData = multiFilters;
    dataToSend.dataOption = dataOption;
    dataToSend.dataToShow = dataSelection;
    dataToSend.valuesToShow = filterSelection;

dates.forEach(function(dateRange){
if (byProduct && allProducts) {
  if (displayValue || (getSalesQuantity && !multiFilters)){
      dataService.getSalesAllProducts(dateRange, function(err, data){
        if (err) return next(err);
        if (compareDates && track===2) {
          dataToSend.salesData = data;
        } else if (compareDates && track===1){
          dataToSend.salesDataCompare = data;
        } else if (!compareDates && track===1){
          dataToSend.salesData = data;
        }
        console.log("Fetched SALES data byProduct for ALL PRODUCTS");
        track--;
        console.log("THIS IS TRACK",track);
        if (track===0) {
          console.log("ABOUT TO SEND DATA: ", dataToSend);
          res.send(JSON.stringify(dataToSend));
        }
    });
  } else if (getPurchasesQuantity && !multiFilters) {
    dataService.getPurchasesAllProducts(dateRange, function(err, data){
      if (err) return next(err);
      if (compareDates && track===2) {
        dataToSend.purchasesData = data;
      } else if (compareDates && track===1){
        dataToSend.purchasesDataCompare = data;
      } else if (!compareDates && track===1){
        dataToSend.purchasesData = data;
      }
      console.log("Fetched PURCHASES data byProduct for ALL PRODUCTS");
      track--;
      console.log("THIS IS TRACK",track);
      if (track===0) {
        console.log("ABOUT TO SEND DATA: ", dataToSend);
        res.send(JSON.stringify(dataToSend));
      }
  });
  } else if (getSalesAndPurchases) {
    dataService.getSalesAllProducts(dateRange, function(err, data){
      if (err) return next(err);
      if (compareDates && track===2) {
        dataToSend.salesData = data;
      } else if (compareDates && track===1){
        dataToSend.salesDataCompare = data;
      } else if (!compareDates && track===1){
        dataToSend.salesData = data;
      }
      dataService.getPurchasesAllProducts(dateRange, function(err, data){
        if (err) return next(err);
        if (compareDates && track===2) {
          dataToSend.purchasesData = data;
        } else if (compareDates && track===1){
          dataToSend.purchasesDataCompare = data;
        } else if (!compareDates && track===1){
          dataToSend.purchasesData = data;
        }
        console.log("Fetched PURCHASES data byProduct for ALL PRODUCTS");
        track--;
        console.log("THIS IS TRACK",track);
        if (track===0) {
          console.log("ABOUT TO SEND DATA: ", dataToSend);
          res.send(JSON.stringify(dataToSend));
        }
    });
    });

  }
  } else if (byProduct && !allProducts) {
    if (displayValue || (getSalesQuantity && !multiFilters)){

    dataService.getSalesByProduct([dataSelection,dateRange[0],dateRange[1]], function(err, data){
      if (err) return next(err);
      if (compareDates && track===2) {
        dataToSend.salesData = data;
      } else if (compareDates && track===1){
        dataToSend.salesDataCompare = data;
      } else if (!compareDates && track===1){
        dataToSend.salesData = data;
      }
      console.log("Fetched SALES data byProduct for ONE PRODUCT");
      track--;
      console.log("THIS IS TRACK",track);
      if (track===0) {
        console.log("ABOUT TO SEND DATA: ", dataToSend);
        res.send(JSON.stringify(dataToSend));
      }
  });
} else if (getPurchasesQuantity && !multiFilters) {
  dataService.getPurchasesByProduct([dataSelection,dateRange[0],dateRange[1]], function(err, data){
    if (err) return next(err);
    if (compareDates && track===2) {
      dataToSend.purchasesData = data;
    } else if (compareDates && track===1){
      dataToSend.purchasesDataCompare = data;
    } else if (!compareDates && track===1){
      dataToSend.purchasesData = data;
    }      console.log("Fetched PURCHASES data byProduct for ONE PRODUCT");
    track--;
    console.log("THIS IS TRACK",track);
    if (track===0) {
      console.log("ABOUT TO SEND DATA: ", dataToSend);
      res.send(JSON.stringify(dataToSend));
    }

});
} else if (getSalesAndPurchases) {
  dataService.getSalesByProduct([dataSelection,dateRange[0],dateRange[1]], function(err, data){
    if (err) return next(err);
    if (compareDates && track===2) {
      dataToSend.salesData = data;
    } else if (compareDates && track===1){
      dataToSend.salesDataCompare = data;
    } else if (!compareDates && track===1){
      dataToSend.salesData = data;
    }
    dataService.getPurchasesByProduct([dataSelection,dateRange[0],dateRange[1]], function(err, data){
      if (err) return next(err);
      if (compareDates && track===2) {
        dataToSend.purchasesData = data;
      } else if (compareDates && track===1){
        dataToSend.purchasesDataCompare = data;
      } else if (!compareDates && track===1){
        dataToSend.purchasesData = data;
      }      console.log("Fetched PURCHASES data byProduct for ONE PRODUCT");
      track--;
      console.log("THIS IS TRACK",track);
      if (track===0) {
        console.log("ABOUT TO SEND DATA: ", dataToSend);
        res.send(JSON.stringify(dataToSend));
      }
  });
  });
}
} else if (byCategory && allCategories) {
  if (displayValue || (getSalesQuantity && !multiFilters)){

  dataService.getSalesAllCategories(dateRange, function(err, data){
    if (err) return next(err);
    if (compareDates && track===2) {
      dataToSend.salesData = data;
    } else if (compareDates && track===1){
      dataToSend.salesDataCompare = data;
    } else if (!compareDates && track===1){
      dataToSend.salesData = data;
    }    console.log("Fetched SALES data byCategory for ALL CATEGORIES");
    track--;
    console.log("THIS IS TRACK",track);
    if (track===0) {
      console.log("ABOUT TO SEND DATA: ", dataToSend);
      res.send(JSON.stringify(dataToSend));
    }
});
} else if (getPurchasesQuantity && !multiFilters) {
  dataService.getPurchasesAllCategories(dateRange, function(err, data){
    if (err) return next(err);
    if (compareDates && track===2) {
      dataToSend.purchasesData = data;
    } else if (compareDates && track===1){
      dataToSend.purchasesDataCompare = data;
    } else if (!compareDates && track===1){
      dataToSend.purchasesData = data;
    }    console.log("Fetched PURCHASES data byCategory for ALL CATEGORIES");
    track--;
    console.log("THIS IS TRACK",track);
    if (track===0) {
      console.log("ABOUT TO SEND DATA: ", dataToSend);
      res.send(JSON.stringify(dataToSend));
    }

});
} else if (getSalesAndPurchases) {
  dataService.getSalesAllCategories(dateRange, function(err, data){
    if (err) return next(err);
    if (compareDates && track===2) {
      dataToSend.salesData = data;
    } else if (compareDates && track===1){
      dataToSend.salesDataCompare = data;
    } else if (!compareDates && track===1){
      dataToSend.salesData = data;
    }    console.log("Fetched SALES data byCategory for ALL CATEGORIES");
    dataService.getPurchasesAllCategories(dateRange, function(err, data){
      if (err) return next(err);
      if (compareDates && track===2) {
        dataToSend.purchasesData = data;
      } else if (compareDates && track===1){
        dataToSend.purchasesDataCompare = data;
      } else if (!compareDates && track===1){
        dataToSend.purchasesData = data;
      }    console.log("Fetched PURCHASES data byCategory for ALL CATEGORIES");
      track--;
      console.log("THIS IS TRACK",track);
      if (track===0) {
        console.log("ABOUT TO SEND DATA: ", dataToSend);
        res.send(JSON.stringify(dataToSend));
      }
  });
  });
}
} else if (byCategory && !allCategories) {
  if (displayValue || (getSalesQuantity && !multiFilters)){
  dataService.getSalesByCategory([dataSelection,dateRange[0],dateRange[1]], function(err, data){
    if (err) return next(err);
    if (compareDates && track===2) {
      dataToSend.salesData = data;
    } else if (compareDates && track===1){
      dataToSend.salesDataCompare = data;
    } else if (!compareDates && track===1){
      dataToSend.salesData = data;
    }    console.log("Fetched SALES data byCategory for ONE CATEGORY");
    track--;
    console.log("THIS IS TRACK",track);
    if (track===0) {
      console.log("ABOUT TO SEND DATA: ", dataToSend);
      res.send(JSON.stringify(dataToSend));
    }
});
} else if (getPurchasesQuantity && !multiFilters) {
  dataService.getPurchasesByCategory([dataSelection,dateRange[0],dateRange[1]], function(err, data){
    if (err) return next(err);
    if (compareDates && track===2) {
      dataToSend.purchasesData = data;
    } else if (compareDates && track===1){
      dataToSend.purchasesDataCompare = data;
    } else if (!compareDates && track===1){
      dataToSend.purchasesData = data;
    }    console.log("Fetched PURCHASES data byCategory for ONE CATEGORY");
    track--;
    console.log("THIS IS TRACK",track);
    if (track===0) {
      console.log("ABOUT TO SEND DATA: ", dataToSend);
      res.send(JSON.stringify(dataToSend));
    }
});
} else if (getSalesAndPurchases) {
  dataService.getSalesByCategory([dataSelection,dateRange[0],dateRange[1]], function(err, data){
    if (err) return next(err);
    if (compareDates && track===2) {
      dataToSend.salesData = data;
    } else if (compareDates && track===1){
      dataToSend.salesDataCompare = data;
    } else if (!compareDates && track===1){
      dataToSend.salesData = data;
    }    console.log("Fetched SALES data byCategory for ONE CATEGORY");
    dataService.getPurchasesByCategory([dataSelection,dateRange[0],dateRange[1]], function(err, data){
      if (err) return next(err);
      if (compareDates && track===2) {
        dataToSend.purchasesData = data;
      } else if (compareDates && track===1){
        dataToSend.purchasesDataCompare = data;
      } else if (!compareDates && track===1){
        dataToSend.purchasesData = data;
      }    console.log("Fetched PURCHASES data byCategory for ONE CATEGORY");
      track--;
      console.log("THIS IS TRACK",track);
      if (track===0) {
        console.log("ABOUT TO SEND DATA: ", dataToSend);
        res.send(JSON.stringify(dataToSend));
      }
  });
  });

}
}
console.log("THIS IS TRACK",track);
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
      formattedDate,
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
