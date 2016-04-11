var _ = require('lodash');
var fs = require('fs');
var _ = require('lodash');
var d = require('./drawTable');
var febSales = './sales';


// EXTRACTING PURCHASES DATA
function extractPurchases() {
var pContents = fs.readFileSync('./purchases/purchases.csv', 'utf8');
var purchases = pContents.replace(/,/g,'.').split("\n").filter(function(array){return array!=="";}).map(function(purchase) {
                  purchase = purchase.split(";");
                  purchase[3] = Number(purchase[3]);
                  purchase[4] = Number(purchase[4].replace(/R/,""));
                  // console.log("This is purchase:", purchase);
                  return purchase;
                });
var obj = {};
return purchases.reduce(function(arr, item){
          if (!obj[item[2]]) {
            obj[item[2]] = true;
                arr.push( {
                              product: item[2],
                              purchases: [{
                                            date:   item[1],
                                            quantity: item[3],
                                            unitCost: item[4],
                                            supplier: item[0],
                                            remaining: item[3]
                                          }]
                          });
                          return arr;
            } else {
                      arr.forEach(function(pushed) {
                        if (pushed.product === item[2]) {
                          pushed.purchases.push({
                                        date:   item[1],
                                        quantity: item[3],
                                        remaining: item[3],
                                        unitCost: item[4],
                                        supplier: item[0]
                                      });
                        }
                      });
                      return arr;
            }
        },[]);
}//end of extract purchases.
// console.log(extractPurchases());
// console.log(purchasesReduce);
//
// purchasesReduce.forEach(function(a) {console.log(a);});

// purchasesReduce.reduce(function(a) {console.log(a.purchased);});

// console.log(purchases);





function getCost(item, quantity) {

  function findProduct(product) {
    return product.product === item;
  }

  function findPurchases(purchases) {
    var productDetails = purchases.find(findProduct);
    return productDetails.purchases;
  }

  var qOver = quantity, allPurchases = extractPurchases() , cost = 0;
  var purchases = findPurchases(allPurchases);
  if (qOver>0) {
        for (var j=0; j<purchases.length; j++) {
          if (purchases[j].remaining>0)  {
            if (purchases[j].remaining-qOver<0) {
              qOver -= purchases[j].remaining;
                cost += purchases[j].remaining * purchases[j].unitCost;
              purchases[j].remaining -= purchases[j].remaining;
            continue;
          } else if (purchases[j].remaining-qOver>=0) {
                purchases[j].remaining -= qOver;
                cost += qOver * purchases[j].unitCost;
                qOver -= qOver;
                break;
          }
        }
      }
    }
      return cost;
      }

// function getPurchases(product) {
//   var purchases = extractPurchases();
//   purchases.forEach(function(item){
//     if (item.product === product) {
//       console.log(item);
//     }
//   });
// }


// EXTRACTING SALES DATA

function getSalesFileContents() {
  var files = fs.readdirSync(febSales);
  var weekitemlist = [];
  var weeknumber;
        files.forEach(function(week) {
              weeknumber = week.replace('.csv',"");
              var contents = fs.readFileSync(febSales+'/'+week, 'utf8');
              // console.log(contents);
              var itemlist = contents.split('\n');
              // console.log(itemlist);
              weekitemlist.push(itemlist);

});
          return weekitemlist;
}

// console.log(getSalesFileContents());

function createItemArray(itemlist) {
    itemarray = [];
              itemlist.forEach(function(period) {
            // console.log("This is",period,"for",week);
                    period.forEach(function(item) {

                          var item = item.split(',');
                          if(item!="") {
                          itemarray.push(item);
                            }
                });
                // console.log("This is itemarray for",week,":",itemarray);
              });
              return itemarray;
}

// console.log(createItemArray());

function extractDetailedSalesData() {
  var weeknumber;
  var weekitemlist;
  var itemarray;
  var totalarray;
  var salesDataDetailed = [];
  var weekarrayreduce = [];
  var files = fs.readdirSync(febSales);
        files.forEach(function(week) {
              weeknumber = week.replace('.csv',"");
              weekitemlist = [];
              var contents = fs.readFileSync(febSales+'/'+week, 'utf8');
              // console.log(contents);
              var itemlist = contents.split('\n');
              // console.log(itemlist);
              weekitemlist.push(itemlist);

              itemarray = createItemArray(weekitemlist);

          itemarray.map(function(sale) {
                var p = Number(sale[4].replace(/R/,""));
                var q = Number(sale[3]);
                var c = getCost(sale[2], q);
                var rev = p*q;
                var profit = rev - c;
                var obj = {
                          week: weeknumber,
                          day: sale[0],
                          date: sale[1],
                          product: sale[2],
                          quantity: q,
                          unitprice: p,
                          revenue: rev,
                          totalcost: c,
                          profit: profit
                        };
                  salesDataDetailed.push(obj);
                  return obj;
            });
      });
      return salesDataDetailed;
    }


function getWeekNames() {
  return fs.readdirSync(febSales).map(function(filename) {
    return filename.replace('.csv',"");
  });
}

function createListOfProducts(fromThisList) {
     var obj = {};
     return fromThisList.reduce(function(arr, item){
       if (!obj[item.product]) {
         obj[item.product] = 1;
         arr.push(item.product);
       }
       return arr;
     }, []);
   }


function summarizeSalesDataByWeek() {
  var weeknames = getWeekNames();
  var allWeekDataSummarize = [];
    weeknames.forEach(function(week) {
      var weekDataSummarize = [];
    var data = extractDetailedSalesData().filter(function(sale) {
                    return sale.week === week;
                  });

    var listOfProducts = createListOfProducts(data);

          listOfProducts.forEach(function(product) {

                    var productSales = data.filter(function(name) {
                        return name.product === product;
                    });

                    weekDataSummarize.push(productSales.reduce(function(product, sale){
                      if (!product.product) {
                        product = {week: week, product: sale.product, quantity: sale.quantity, unitprice: sale.unitprice, revenue: sale.revenue, totalcost: sale.totalcost, profit: sale.profit }
                      } else if (product.product === sale.product){
                                product.quantity += sale.quantity;
                                product.revenue += sale.revenue;
                                product.totalcost += sale.totalcost;
                                product.profit += sale.profit;

                                if (product.unitprice!==sale.unitprice) {
                                  product.unitprice = [product.unitprice, sale.unitprice];
                                } else if (typeof product.unitprice === 'object' && product.unitprice.indexOf(sale.unitprice)===-1) {
                                  product.unitprice.push(sale.unitprice);
                                }
                            }
                            return product;
                          },{})
                        );
        });
        allWeekDataSummarize.push(weekDataSummarize);
      });
      return allWeekDataSummarize;
    }

// console.log(summarizeSalesDataByWeek());

// function getDetailsByPrice(product, price) {
//   var product = product;
//   var sales = extractSales();
//   function findProduct(item) {
//     return item ;
//   }
//   var salesByProduct = sales.find(findProduct);
// }


// extractSalesSummarize();

// console.log(extractSalesSummarize());
// var sales = extractSalesSummarize();
// sales.forEach(function(week) {
//   console.log(week['Mixed Sweets 5s']);
// })

// console.log(getCost('Milk 1'), 10));
// console.log(weekarrayreduce);
//****************************************************
function returnWhatNelisaWants() {
  var salesDataSummarized = summarizeSalesDataByWeek();
  var weekSummary = [];
  salesDataSummarized.forEach(function(week) {
      // console.log(week);

    weekSummary.push(week.reduce(function(obj, lineitem) {
                  if (!obj.week) {
                        obj.week = lineitem.week;
                        obj['most popular product'] = {product: lineitem.product , quantity: lineitem.quantity};
                        obj['least popular product'] = {product: lineitem.product  , quantity: lineitem.quantity};
                        obj['most profitable product'] = {product: lineitem.product  , profit: lineitem.profit};
                        obj['least profitable product'] = {product: lineitem.product  , profit: lineitem.profit};
                      } else {
                        // console.log("This is week[key].quantity",week[key].quantity);
                        // console.log("This is obj[week.week]['most popular product']:",obj[week.week]['most popular product']);

                        // obj[week.week]['most popular category'] = {};
                        // obj[week.week]['most popular category'].product = {};
                        // obj[week.week]['most popular category'].quantity = {};
                        // obj[week.week]['least popular category'] = {};
                        // obj[week.week]['least popular category'].product = {};
                        // obj[week.week]['least popular category'].quantity = {};
                        // obj[week.week]['most profitable product'] = {product: key , quantity: week[key].revenue/*MINUS COST*/};
                        // obj[week.week]['most profitable product'].category = {};
                        // obj[week.week]['most profitable product'].revenue = {};
                        // obj[week.week]['most profitable category'] = {};
                        // obj[week.week]['most profitable category'].category = {};
                        // obj[week.week]['most profitable category'].revenue = {};
                        // return obj;

                  if (lineitem.quantity > obj['most popular product'].quantity) {
            obj['most popular product'].product = lineitem.product;
            obj['most popular product'].quantity = lineitem.quantity;
            }
            if (lineitem.quantity < obj['least popular product'].quantity) {
              obj['least popular product'].product = lineitem.product;
              obj['least popular product'].quantity = lineitem.quantity;
            }
            if (lineitem.profit > obj['most profitable product'].profit) {
              obj['most profitable product'].product = lineitem.product;
              obj['most profitable product'].profit = lineitem.profit;
            }
            if (lineitem.profit < obj['least profitable product'].profit) {
              obj['least profitable product'].product = lineitem.product;
              obj['least profitable product'].profit = lineitem.profit;
            }
            // return obj;
        }
        return obj;
    },{})
  );
});
return weekSummary;
}

// console.log(returnWhatNelisaWants());
//********************************************************************************************************
// FUN STUFF
//********************************************************************************************************
function sortBy(key) {
  function compare(a,b) {
    return a[key] - b[key];
  }
  return compare;
}

var extract = summarizeSalesDataByWeek().reduce(function(a,b){
 return  a.concat(b);
});

var find = extract.filter(function(item) {
  return item.week === 'week4';
});
var sorted = find.sort(sortBy('quantity'));
// console.log(find);

console.log(d.drawTable(d.dataTable(sorted)));
