const fs = require('fs');

function generateDateList(dateRange){
  const fromDate = Date.parse(dateRange[0]),
        toDate = Date.parse(dateRange[1]),
        oneDay = 1000*60*60*24;
  var   dates = [];

  for (var i = fromDate; i<=toDate; i+=oneDay) {
    var date = new Date(i),
        day = date.getDate().toString(),
        month = (date.getMonth() + 1).toString(),
        year = date.getFullYear(),
        d = day.length===1 ? "0"+day : day,
        m = month.length===1 ? "0"+month : month,
        pushDate = m+"/"+d+"/"+year;
console.log("day.length:",day.length)
console.log("day:",day)
console.log("d:",d)
    dates.push(pushDate);
  }
  console.log("THIS IS GENERATED DATE LIST",dates);
  return dates;
}

function createDataset(data,datasetToSend,track,compareDates) {
        if (compareDates && track===2) {
          datasetToSend.push(data);
        } else if (compareDates && track===1){
          datasetToSend.push(data);
        } else if (!compareDates && track===1){
          datasetToSend.push(data);
        }
        return datasetToSend;
      }

exports.home = function(req,res){
  var context = req.session.context,
      dataService;

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
      showRemaining,
      showAll,
      multiFilters;

  var dataReceived = req.body;

  console.log("THIS IS RECEIVED DATA", dataReceived);
  console.log("THIS IS RECEIVED DATA SELECTION", dataReceived['dataSelection[]']);

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
    showAll = allProducts || allCategories;
    displayValue = filterOption ==="value";
    displayQuantity = filterOption ==="quantity";
    compareDates = inputDates.length === 4;
    numberOfFilters = filterSelection.length;
    multiFilters = numberOfFilters > 1;
    showTimeLine = ((byProduct || byCategory) && (allProducts || allCategories)) ? false : true;

    getPurchasesQuantity = filterSelection.indexOf('purchased')!=-1;
    getSalesQuantity = filterSelection.indexOf('sold')!=-1;
    showRemaining = filterSelection.indexOf("remaining")!=-1;
    getSalesAndPurchases = getPurchasesQuantity && getSalesQuantity;
    getAllQuantities = getPurchasesQuantity && getSalesQuantity && showRemaining;

  req.services(function(err,services){
    var date1 = inputDates[0],
        date2 = inputDates[1],
        date1Comp = inputDates[2],
        date2Comp = inputDates[3];
    var dates = compareDates ? [[date1,date2],[date1Comp,date2Comp]] : [[date1,date2]];
    dataService = services.chartDataService;

    var track = dates.length,
        datasetToSend = [];
        console.log("THIS IS INITIAL TRACK LENGTH", track);
        console.log("THIS IS DATES",dates);
    dataToSend.compareDateRange = compareDates;
    dataToSend.dates = dates;
    dataToSend.multifilter = multiFilters;
    dataToSend.showTimeLine = showTimeLine;
    dataToSend.compareData = multiFilters;
    dataToSend.dataOption = dataReceived.dataOption;
    dataToSend.dataToShow = dataReceived.dataSelection;
    dataToSend.axisLabel = displayQuantity ? "Quantity" : "Value (ZAR)";
    dataToSend.valuesToShow = filterSelection;

dates.forEach(function(dateRange){
  var dateList = generateDateList(dateRange);
if (byProduct && allProducts) {
  if (displayValue || (getSalesQuantity && !multiFilters) && !showRemaining){
      dataService.getSalesAllProducts(dateRange, function(err, data){
        if (err) return next(err);
        dataToSend.dataset = createDataset(data,datasetToSend,track,compareDates);
        console.log("Fetched SALES data byProduct for ALL PRODUCTS");
        track--;
        console.log("THIS IS TRACK",track);
        if (track===0) {
          console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
          res.send(JSON.stringify(dataToSend));
        }
    });
  } else if (getPurchasesQuantity && !multiFilters && !showRemaining) {
    dataService.getPurchasesAllProducts(dateRange, function(err, data){
      if (err) return next(err);
      dataToSend.dataset = createDataset(data,datasetToSend,track,compareDates);
      console.log("Fetched PURCHASES data byProduct for ALL PRODUCTS");
      track--;
      console.log("THIS IS TRACK",track);
      if (track===0) {
        console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
        res.send(JSON.stringify(dataToSend));
      }
  });
  } else if (getSalesAndPurchases && !showRemaining) {
    dataService.getSalesAllProducts(dateRange, function(err, data){
      if (err) return next(err);
      var sales = data;
      dataService.getPurchasesAllProducts(dateRange, function(err, data){
        if (err) return next(err);
        var purchases = data;
        var combinedData = sales.map(function(sale){
                            var purchaseAtSaleDate = purchases.find(function(purchase){ return purchase.p_id===sale.p_id;});
                            sale.purchased = purchaseAtSaleDate ? +purchaseAtSaleDate.quantity : 0;
                            return sale;
                          });
        dataToSend.dataset = createDataset(combinedData,datasetToSend,track,compareDates);
        console.log("Fetched PURCHASES data byProduct for ALL PRODUCTS");
        track--;
        console.log("THIS IS TRACK",track);
        if (track===0) {
          console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
          res.send(JSON.stringify(dataToSend));
        }
    });
    });

  } else if (displayQuantity && !multiFilters && showRemaining){
      dataService.getAllProducts(function(err, data){
        if (err) return next(err);
        const products = data;
        const productIdList = products.map(function(product){return product.p_id;});
        dataService.getInventoryRemainingAll([showTimeLine,productIdList,dateRange], function(err, data){
          const remaining = data;
          const toSend = productIdList.map(function(id, index){
            var product = products.find(function(p){return p.p_id === id;});
            product.remaining = remaining[index];
            return product;
          });

          dataToSend.dataset = createDataset(toSend,datasetToSend,track,compareDates);
          console.log("Fetched SALES data byProduct for ALL PRODUCTS");
          track--;
          console.log("THIS IS TRACK",track);
          if (track===0) {
            console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
            res.send(JSON.stringify(dataToSend));
          }

        });
    });
  } else if (multiFilters && getSalesQuantity && !getPurchasesQuantity && showRemaining){
      dataService.getSalesAllProducts(dateRange, function(err, data){
        if (err) return next(err);
        const salesData = data;
        const productIdList = salesData.map(function(sale){return sale.p_id;});
        dataService.getInventoryRemainingAll([showTimeLine,productIdList,dateRange], function(err, data){
          const remaining = data;
          const toSend = productIdList.map(function(id, index){
            var product = salesData.find(function(p){return p.p_id === id;});
            product.remaining = remaining[index];
            return product;
          });

          dataToSend.dataset = createDataset(toSend,datasetToSend,track,compareDates);
          console.log("Fetched SALES data byProduct for ALL PRODUCTS");
          track--;
          console.log("THIS IS TRACK",track);
          if (track===0) {
            console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
            res.send(JSON.stringify(dataToSend));
          }

        });
  });
} else if (multiFilters && getPurchasesQuantity && !getSalesQuantity && showRemaining){
      dataService.getPurchasesAllProducts(dateRange, function(err, data){
        if (err) return next(err);
        const purchasesData = data;
        const productIdList = purchasesData.map(function(sale){return sale.p_id;});
        dataService.getInventoryRemainingAll([showTimeLine,productIdList,dateRange], function(err, data){
          const remaining = data;
          const toSend = productIdList.map(function(id, index){
            var product = purchasesData.find(function(p){return p.p_id === id;});
            product.remaining = remaining[index];
            product.purchased = product.quantity;
            return product;
          });

          dataToSend.dataset = createDataset(toSend,datasetToSend,track,compareDates);
          console.log("Fetched SALES data byProduct for ALL PRODUCTS");
          track--;
          console.log("THIS IS TRACK",track);
          if (track===0) {
            console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
            res.send(JSON.stringify(dataToSend));
          }

        });
  });
} else if (getAllQuantities){
  dataService.getSalesAllProducts(dateRange, function(err, data){
    if (err) return next(err);
    const salesData = data;
    const productIdList = salesData.map(function(sale){return sale.p_id;});
    dataService.getInventoryRemainingAll([showTimeLine,productIdList,dateRange], function(err, data){
      const remaining = data;
      const toSend = productIdList.map(function(id, index){
        var product = salesData.find(function(p){return p.p_id === id;});
        product.remaining = remaining[index];
        return product;
      });
      dataService.getPurchasesAllProducts(dateRange, function(err, data){
        if (err) return next(err);
        const purchasesData = data;
        const combinedData = toSend.map(function(product){
                            var purchaseDuringDateRange = purchasesData.find(function(purchase){
                              console.log("THIS IS PRODUCT",product);
                              console.log("THIS IS PURCHASE",purchase);
                              console.log("THIS IS PURCHASE PID",purchase.p_id);
                              console.log("THIS IS PRODUCT PID",product.p_id);
                              return purchase.p_id===product.p_id;});
                            product.purchased = purchaseDuringDateRange ? +purchaseDuringDateRange.quantity : 0;
                            return product;
                          });

          dataToSend.dataset = createDataset(combinedData,datasetToSend,track,compareDates);
          console.log("Fetched SALES data byProduct for ALL PRODUCTS");
          track--;
          console.log("THIS IS TRACK",track);
          if (track===0) {
            console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
            res.send(JSON.stringify(dataToSend));
          }

        });
  });
  });
}
  } else if (byProduct && !allProducts) {
    if (displayValue || (getSalesQuantity && !multiFilters && !showRemaining)){

    dataService.getSalesByProduct([dataSelection,dateRange[0],dateRange[1]], function(err, data){
      if (err) return next(err);
      const dbData = data;
      const product = dbData[0].product;
      var dataset = dateList.map(function(d){
        var existing = dbData.find(function(i){return i.date===d;});
        console.log("THIS IS EXISTING DATA", existing);
        if (existing) {
          console.log("DATA DOES EXIST");
          return existing;
        } else {
          return {date: d, product: product, quantity: 0, revenue: 0, profit: 0, cost: 0};
        }
      });
      dataToSend.dataset = createDataset(dataset,datasetToSend,track,compareDates);
      console.log("Fetched SALES data byProduct for ONE PRODUCT");
      track--;
      console.log("THIS IS TRACK",track);
      if (track===0) {
        console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
        res.send(JSON.stringify(dataToSend));
      }
  });
} else if (getPurchasesQuantity && !multiFilters && !showRemaining) {
  dataService.getPurchasesByProduct([dataSelection,dateRange[0],dateRange[1]], function(err, data){
    if (err) return next(err);
    const dbData = data;
    const product = dbData[0].product;
    var dataset = dateList.map(function(d){
      var existing = dbData.find(function(i){return i.date===d;});
      if (existing) {
        return existing;
      } else {
        return {date: d, product: product, quantity: 0};
      }
    });
    dataToSend.dataset = createDataset(dataset,datasetToSend,track,compareDates);
    console.log("Fetched PURCHASES data byProduct for ONE PRODUCT");
    track--;
    console.log("THIS IS TRACK",track);
    if (track===0) {
      console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
      res.send(JSON.stringify(dataToSend));
    }

});
} else if (getSalesAndPurchases && !showRemaining) {
  dataService.getSalesByProduct([dataSelection,dateRange[0],dateRange[1]], function(err, data){
    if (err) return next(err);
    var sales = data;
    const product = sales[0].product;
    dataService.getPurchasesByProduct([dataSelection,dateRange[0],dateRange[1]], function(err, data){
      if (err) return next(err);
      var purchases = data;
      var combinedData = dateList.map(function(d){
                          var purchaseAtDate = purchases.find(function(i){return i.date===d;});
                          var saleAtDate = sales.find(function(i){return i.date===d;});
                          return {date: d,
                                  product: product,
                                  quantity: saleAtDate ? saleAtDate.quantity : 0,
                                  purchased: purchaseAtDate ? purchaseAtDate.quantity : 0,
                                  revenue: saleAtDate ? saleAtDate.revenue : 0,
                                  profit: saleAtDate ? saleAtDate.profit : 0,
                                  cost: saleAtDate ? saleAtDate.cost : 0
                                };
                      });

      dataToSend.dataset = createDataset(combinedData,datasetToSend,track,compareDates);

      console.log("Fetched PURCHASES data byProduct for ONE PRODUCT");
      track--;
      console.log("THIS IS TRACK",track);
      if (track===0) {
        console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
        res.send(JSON.stringify(dataToSend));
      }
  });
  });
} else if (displayQuantity && !multiFilters && showRemaining) {
      dataService.getInventoryRemainingSingle([showTimeLine,dataSelection,dateList,byCategory], function(err, data){
        const remaining = data;

        dataToSend.dataset = createDataset(remaining,datasetToSend,track,compareDates);
        console.log("Fetched SALES data byProduct for ALL PRODUCTS");
        track--;
        console.log("THIS IS TRACK",track);
        if (track===0) {
          console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
          res.send(JSON.stringify(dataToSend));
      }
    });
} else if (multiFilters && getSalesQuantity && !getPurchasesQuantity && showRemaining){
    dataService.getSalesByProduct([dataSelection,dateRange[0],dateRange[1]], function(err, data){
      if (err) return next(err);
      const dbData = data;
      const product = dbData[0].product;
      dataService.getInventoryRemainingSingle([showTimeLine,dataSelection,dateList,byCategory], function(err, data){
        const remaining = data;
        var dataset = remaining.map(function(d){
          var existing = dbData.find(function(i){return i.date===d.date;});
          d.quantity = existing ? existing.quantity : 0;
            return d;
        });
        dataToSend.dataset = createDataset(dataset,datasetToSend,track,compareDates);
        console.log("Fetched SALES data byProduct for ALL PRODUCTS");
        track--;
        console.log("THIS IS TRACK",track);
        if (track===0) {
          console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
          res.send(JSON.stringify(dataToSend));
        }

      });
});
} else if (multiFilters && getPurchasesQuantity && !getSalesQuantity && showRemaining){
    dataService.getPurchasesByProduct([dataSelection,dateRange[0],dateRange[1]], function(err, data){
      if (err) return next(err);
      const dbData = data;
      const product = dbData[0].product;
      dataService.getInventoryRemainingSingle([showTimeLine,dataSelection,dateList,byCategory], function(err, data){
        const remaining = data;
        var dataset = remaining.map(function(d){
          var existing = dbData.find(function(i){return i.date===d.date;});
            d.purchased = existing ? existing.quantity : 0;
            return d;
        });
        dataToSend.dataset = createDataset(dataset,datasetToSend,track,compareDates);
        console.log("Fetched SALES data byProduct for ALL PRODUCTS");
        track--;
        console.log("THIS IS TRACK",track);
        if (track===0) {
          console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
          res.send(JSON.stringify(dataToSend));
        }

      });
});
} else if (getAllQuantities){
dataService.getSalesByProduct([dataSelection,dateRange[0],dateRange[1]], function(err, data){
  if (err) return next(err);
  const sales = data;
    dataService.getPurchasesByProduct([dataSelection,dateRange[0],dateRange[1]], function(err, data){
      if (err) return next(err);
      const purchases = data;
      dataService.getInventoryRemainingSingle([showTimeLine,dataSelection,dateList,byCategory], function(err, data){
        const remaining = data;
        var dataset = remaining.map(function(d){
          var saleExisting = sales.find(function(i){return i.date===d.date;});
          var purchaseExisting = purchases.find(function(i){return i.date===d.date;});

          d.quantity = saleExisting ? saleExisting.quantity : 0;
          d.purchased = purchaseExisting ? purchaseExisting.quantity : 0;
          return d;
        });
        dataToSend.dataset = createDataset(dataset,datasetToSend,track,compareDates);
        console.log("Fetched SALES data byProduct for ALL PRODUCTS");
        track--;
        console.log("THIS IS TRACK",track);
        if (track===0) {
          console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
          res.send(JSON.stringify(dataToSend));
        }

      });
});
});
}
} else if (byCategory && allCategories) {
  if (displayValue || (getSalesQuantity && !multiFilters) && !showRemaining){

  dataService.getSalesAllCategories(dateRange, function(err, data){
    if (err) return next(err);
    dataToSend.dataset = createDataset(data,datasetToSend,track,compareDates);
    console.log("Fetched SALES data byCategory for ALL CATEGORIES");
    track--;
    console.log("THIS IS TRACK",track);
    if (track===0) {
      console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
      res.send(JSON.stringify(dataToSend));
    }
});
} else if (getPurchasesQuantity && !multiFilters && !showRemaining) {
  dataService.getPurchasesAllCategories(dateRange, function(err, data){
    if (err) return next(err);
    dataToSend.dataset = createDataset(data,datasetToSend,track,compareDates);
    console.log("Fetched PURCHASES data byCategory for ALL CATEGORIES");
    track--;
    console.log("THIS IS TRACK",track);
    if (track===0) {
      console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
      res.send(JSON.stringify(dataToSend));
    }

});
} else if (getSalesAndPurchases && !showRemaining) {
  dataService.getSalesAllCategories(dateRange, function(err, data){
    if (err) return next(err);
    var sales = data;
    console.log("Fetched SALES data byCategory for ALL CATEGORIES");
    dataService.getPurchasesAllCategories(dateRange, function(err, data){
      if (err) return next(err);
      var purchases = data;
      var combinedData = sales.map(function(sale){
                          var purchaseAtSaleDate = purchases.find(function(purchase){ return purchase.c_id===sale.c_id;});
                          sale.purchased = purchaseAtSaleDate ? +purchaseAtSaleDate.quantity : 0;
                          return sale;
                        });
      dataToSend.dataset = createDataset(combinedData,datasetToSend,track,compareDates);
      console.log("Fetched PURCHASES data byCategory for ALL CATEGORIES");
      track--;
      console.log("THIS IS TRACK",track);
      if (track===0) {
        console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
        res.send(JSON.stringify(dataToSend));
      }
  });
  });
} else if (displayQuantity && !multiFilters && showRemaining){
    dataService.getAllProducts(function(err, data){
      if (err) return next(err);
      const products = data;
      const allCategories = products.map(function(product){return product.c_id;});
      const categoryList = Array.from(new Set(allCategories));
      console.log("THIS IS ALL CATEGORIES", allCategories);
      const categoryProductList = categoryList.map(function(id){
                                        return products.filter(function(p){
                                          return p.c_id === id;
                                        }).map(function(p){
                                            return p.p_id;
                                          });
                                  });

      var track2 = categoryList.length;
      var productRemByCat = [];
      categoryProductList.forEach(function(productIdList){
      dataService.getInventoryRemainingAll([showTimeLine,productIdList,dateRange,byCategory], function(err, data){
        productRemByCat.push(data);
        track2--;
        if (track2===0) {
        const toSend = categoryList.map(function(id, index){
          var category = products.find(function(p){return p.c_id===id;}).category;
          var remaining = productRemByCat[index].reduce(function(sum,remaining) {
                  return sum + remaining;
        },0);
        console.log({category: category, remaining: remaining});
        return {category: category, remaining: remaining};
      });

        dataToSend.dataset = createDataset(toSend,datasetToSend,track,compareDates);
        console.log("Fetched SALES data byCategory for ALL CATEGORIES");
        track--;
        // console.log("THIS IS TRACK",track);
        if (track===0) {

          console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
          res.send(JSON.stringify(dataToSend));
        }
      }
      });
      });
  });
} else if (multiFilters && getSalesQuantity && !getPurchasesQuantity && showRemaining){

    dataService.getSalesAllCategories(dateRange, function(err, data){
      if (err) return next(err);
      const salesData = data;
      dataService.getAllProducts(function(err, data){
        if (err) return next(err);
        const products = data;
        const allCategories = products.map(function(product){return product.c_id;});
        const categoryList = Array.from(new Set(allCategories));
        const categoryProductList = categoryList.map(function(catId){
                                    return products.filter(function(p){
                                                    return p.c_id === catId;
                                                  }).map(function(p){
                                                    return p.p_id;
                                                  });
                                    });

      var track2 = categoryList.length;
      var productRemByCat = [];

      categoryProductList.forEach(function(productIdList){
      dataService.getInventoryRemainingAll([showTimeLine,productIdList,dateRange,byCategory], function(err, data){
        productRemByCat.push(data);
        track2--;
        if (track2===0) {
        const toSend = categoryList.map(function(catId, index){
          var salesCategory = salesData.find(function(groupedSales){return groupedSales.c_id === catId}),
              totalRemaining = productRemByCat[index].reduce(function(sum,remaining) {
                            return sum + remaining;
                          },0);
          salesCategory.remaining = totalRemaining;
          return salesCategory;
        });
        dataToSend.dataset = createDataset(toSend,datasetToSend,track,compareDates);
        console.log("Fetched SALES data byCategory for ALL CATEGORIES");
        track--;
        console.log("THIS IS TRACK",track);
        if (track===0) {
          console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
          res.send(JSON.stringify(dataToSend));
        }
}
      });
});
});
});
} else if (multiFilters && getPurchasesQuantity && !getSalesQuantity && showRemaining){
    dataService.getPurchasesAllCategories(dateRange, function(err, data){
      if (err) return next(err);
      const purchasesData = data;
      dataService.getAllProducts(function(err, data){
        if (err) return next(err);
        const products = data;
        const allCategories = products.map(function(product){return product.c_id;});
        const categoryList = Array.from(new Set(allCategories));
        const categoryProductList = categoryList.map(function(catId){
                                  return products.filter(function(p){
                                                    return p.c_id === catId;
                                                  }).map(function(p){
                                                    return p.p_id;
                                                  });
                                    });

      var track2 = categoryList.length;
      var productRemByCat = [];

      categoryProductList.forEach(function(productIdList){
      dataService.getInventoryRemainingAll([showTimeLine,productIdList,dateRange,byCategory], function(err, data){
        productRemByCat.push(data);
        track2--;
        if (track2===0) {
        const toSend = categoryList.map(function(catId, index){
          var purchasesCategory = purchasesData.find(function(groupedPurchases){return groupedPurchases.c_id === catId}),
          totalRemaining = productRemByCat[index].reduce(function(sum,remaining) {
                            return sum + remaining;
                          },0);
          if (purchasesCategory) {
          purchasesCategory.remaining = totalRemaining;
          purchasesCategory.purchased = purchasesCategory.quantity;
          return purchasesCategory;
        } else {
          return {remaining: 0, purchased: 0, category: products.find(function(p){return p.c_id===catId;}).category};
        }
        });
        dataToSend.dataset = createDataset(toSend,datasetToSend,track,compareDates);
        console.log("Fetched SALES data byCategory for ALL CATEGORIES");
        track--;
        console.log("THIS IS TRACK",track);
        if (track===0) {
          console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
          res.send(JSON.stringify(dataToSend));
        }
}
      });
});
});
});
} else if (getAllQuantities){
  dataService.getSalesAllCategories(dateRange, function(err, data){
    if (err) return next(err);
    const salesData = data;
    dataService.getPurchasesAllCategories(dateRange, function(err, data){
      if (err) return next(err);
      const purchasesData = data;
      var combinedData = salesData.map(function(sale){
                          var purchaseDuringDateRange = purchasesData.find(function(purchase){ return purchase.c_id===sale.c_id;});
                          sale.purchased = purchaseDuringDateRange ? +purchaseDuringDateRange.quantity : 0;
                          return sale;
                        });
      dataService.getAllProducts(function(err, data){
        if (err) return next(err);
        const products = data;
        const allCategories = products.map(function(product){return product.c_id;});
        const categoryList = Array.from(new Set(allCategories));
        const categoryProductList = categoryList.map(function(catId){
                                    return products.filter(function(p){
                                                    return p.c_id === catId;
                                                  }).map(function(p){
                                                    return p.p_id;
                                                  });
                                    });

      var track2 = categoryList.length;
      var productRemByCat = [];

      categoryProductList.forEach(function(productIdList){
      dataService.getInventoryRemainingAll([showTimeLine,productIdList,dateRange,byCategory], function(err, data){
        productRemByCat.push(data);
        track2--;
        if (track2===0) {
        const toSend = categoryList.map(function(catId, index){
          var categoryData = combinedData.find(function(groupedPurchases){return groupedPurchases.c_id === catId}),
          totalRemaining = productRemByCat[index].reduce(function(sum,remaining) {
                            return sum + remaining;
                          },0);
          if (categoryData) {
          categoryData.remaining = totalRemaining;
          return categoryData;
        } else {
          return {quantity: 0, purchased: 0, remaining: 0, category: products.find(function(p){return p.c_id===catId;}).category};
        }
        });

        dataToSend.dataset = createDataset(toSend,datasetToSend,track,compareDates);
        console.log("Fetched SALES data byCategory for ALL CATEGORIES");
        track--;
        console.log("THIS IS TRACK",track);
        if (track===0) {
          console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
          res.send(JSON.stringify(dataToSend));
        }
}
      });
});
});
});
});
}
} else if (byCategory && !allCategories) {
  if (displayValue || (getSalesQuantity && !multiFilters) && !showRemaining){
  dataService.getSalesByCategory([dataSelection,dateRange[0],dateRange[1]], function(err, data){
    if (err) return next(err);
    const dbData = data;
    const category = dbData[0].category;
    var dataset = dateList.map(function(d){
      var existing = dbData.find(function(i){return i.date===d;});
      if (existing) {
        return existing;
      } else {
        return {date: d, category: category, quantity: 0, revenue: 0, profit: 0, cost: 0};
      }
    });
    dataToSend.dataset = createDataset(dataset,datasetToSend,track,compareDates);
    console.log("Fetched SALES data byCategory for ONE CATEGORY");
    track--;
    console.log("THIS IS TRACK",track);
    if (track===0) {
      console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
      res.send(JSON.stringify(dataToSend));
    }
});
} else if (getPurchasesQuantity && !multiFilters && !showRemaining) {
  dataService.getPurchasesByCategory([dataSelection,dateRange[0],dateRange[1]], function(err, data){
    if (err) return next(err);
    const dbData = data;
    const category = dbData[0].category;
    var dataset = dateList.map(function(d){
      var existing = dbData.find(function(i){return i.date===d;});
      if (existing) {
        return existing;
      } else {
        return {date: d, category: category, quantity: 0};
      }
    });
    dataToSend.dataset = createDataset(dataset,datasetToSend,track,compareDates);
    console.log("Fetched PURCHASES data byCategory for ONE CATEGORY");
    track--;
    console.log("THIS IS TRACK",track);
    if (track===0) {
      console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
      res.send(JSON.stringify(dataToSend));
    }
});
} else if (getSalesAndPurchases && !showRemaining) {
  dataService.getSalesByCategory([dataSelection,dateRange[0],dateRange[1]], function(err, data){
    if (err) return next(err);
    var sales = data;
    console.log("Fetched SALES data byCategory for ONE CATEGORY");
    dataService.getPurchasesByCategory([dataSelection,dateRange[0],dateRange[1]], function(err, data){
      if (err) return next(err);
      var purchases = data;
      var combinedData = dateList.map(function(d){
                          var purchaseAtDate = purchases.find(function(i){return i.date===d;});
                          var saleAtDate = sales.find(function(i){return i.date===d;});
                          return {date: d,
                                  category: category,
                                  quantity: saleAtDate ? saleAtDate.quantity : 0,
                                  purchased: purchaseAtDate ? purchaseAtDate.quantity : 0,
                                  revenue: saleAtDate ? saleAtDate.revenue : 0,
                                  profit: saleAtDate ? saleAtDate.profit : 0,
                                  cost: saleAtDate ? saleAtDate.cost : 0
                                };
                      });

      dataToSend.dataset = createDataset(combinedData,datasetToSend,track,compareDates);
      console.log("Fetched PURCHASES data byCategory for ONE CATEGORY");
      track--;
      console.log("THIS IS TRACK",track);
      if (track===0) {
        console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
        res.send(JSON.stringify(dataToSend));
      }
  });
  });

} else if (displayQuantity && !multiFilters && showRemaining){
    dataService.getAllProducts(function(err, data){
      if (err) return next(err);
      const products = data;
      const productIdList = data.filter(function(product){
                          return product.c_id===dataSelection;
                        }).map(function(product){
                          return product.p_id;
                        });
      dataService.getInventoryRemainingSingle([showTimeLine,productIdList,dateList,byCategory], function(err, data){
        const toSend = data;
        dataToSend.dataset = createDataset(toSend,datasetToSend,track,compareDates);
        console.log("Fetched SALES data byCategory for ONE CATEGORY");
        track--;
        console.log("THIS IS TRACK",track);
        if (track===0) {
          console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
          res.send(JSON.stringify(dataToSend));
        }
      });
      });
  } else if (multiFilters && getSalesQuantity && !getPurchasesQuantity && showRemaining) {

    dataService.getSalesByCategory([dataSelection,dateRange[0],dateRange[1]], function(err, data){
      if (err) return next(err);
      const dbData = data;
      const category = dbData[0].category;
      dataService.getAllProducts(function(err, data){
        if (err) return next(err);
        const productIdList = data.filter(function(product){
                            return product.c_id===dataSelection;
                          }).map(function(product){
                            return product.p_id;
                          });
      dataService.getInventoryRemainingSingle([showTimeLine,productIdList,dateList,byCategory], function(err, data){
        const remaining = data;
          var dataset = remaining.map(function(d){
            var existing = dbData.find(function(i){return i.date===d.date;});
            d.category = category;
            d.quantity = existing ? existing.quantity : 0;
              return d;
          });
          dataToSend.dataset = createDataset(dataset,datasetToSend,track,compareDates);
        console.log("Fetched SALES data byCategory for ONE CATEGORY");
        track--;
        console.log("THIS IS TRACK",track);
        if (track===0) {
          console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
          res.send(JSON.stringify(dataToSend));
        }
});
      });
});
} else if (multiFilters && getPurchasesQuantity && !getSalesQuantity && showRemaining) {
    dataService.getPurchasesByCategory([dataSelection,dateRange[0],dateRange[1]], function(err, data){
      if (err) return next(err);
      const dbData = data;
      const category = dbData[0].category;
      dataService.getAllProducts(function(err, data){
        if (err) return next(err);
        const productIdList = data.filter(function(product){
                            return product.c_id===dataSelection;
                          }).map(function(product){
                            return product.p_id;
                          });
      dataService.getInventoryRemainingSingle([showTimeLine,productIdList,dateList,byCategory], function(err, data){

        const remaining = data;
          var dataset = remaining.map(function(d){
            var existing = dbData.find(function(i){return i.date===d.date;});
            d.category = category;
            d.purchased = existing ? existing.quantity : 0;
              return d;
          });
          dataToSend.dataset = createDataset(dataset,datasetToSend,track,compareDates);
        console.log("Fetched SALES data byCategory for ONE CATEGORY");
        track--;
        console.log("THIS IS TRACK",track);
        if (track===0) {
          console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
          res.send(JSON.stringify(dataToSend));
        }
});
      });
});
} else if (getAllQuantities){
  dataService.getSalesByCategory([dataSelection,dateRange[0],dateRange[1]], function(err, data){
    if (err) return next(err);
    const sales = data;
    const category = sales[0].category;
    dataService.getPurchasesByCategory([dataSelection,dateRange[0],dateRange[1]], function(err, data){
      if (err) return next(err);
      const purchases = data;
      dataService.getAllProducts(function(err, data){
      if (err) return next(err);
      const productIdList = data.filter(function(product){
                          return product.c_id===dataSelection;
                        }).map(function(product){
                          return product.p_id;
                        });
      dataService.getInventoryRemainingSingle([showTimeLine,productIdList,dateList,byCategory], function(err, data){

        const remaining = data;
        var dataset = remaining.map(function(d){
          var saleExisting = sales.find(function(i){return i.date===d.date;});
          var purchaseExisting = purchases.find(function(i){return i.date===d.date;});
          d.category = category;
          d.quantity = saleExisting ? saleExisting.quantity : 0;
          d.purchased = purchaseExisting ? purchaseExisting.quantity : 0;
          return d;
        });
        dataToSend.dataset = createDataset(dataset,datasetToSend,track,compareDates);
        console.log("Fetched SALES data byCategory for ONE CATEGORY");
        track--;
        console.log("THIS IS TRACK",track);
        if (track===0) {
          console.log("ABOUT TO SEND DATA: ", dataToSend.dataset[0]);
          res.send(JSON.stringify(dataToSend));
        }

      });
});
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
