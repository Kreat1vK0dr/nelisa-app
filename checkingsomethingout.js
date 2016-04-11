// var byProduct = data.reduce(function(summary, week) {
//
//   summary.push(week.reduce(function(weeksum, lineitem){
//
//     if (!obj.week) {
//           weeksum.push({week: lineitem.week, 'most popular product': lineitem.product , quantity: lineitem.quantity});
//           weeksum.push({week: lineitem.week, 'least popular product': lineitem.product , quantity: lineitem.quantity});
//           weeksum.push({week: lineitem.week, 'most profitable product': lineitem.product , quantity: lineitem.profit});
//           weeksum.push({week: lineitem.week, 'least profitable product': lineitem.product , quantity: lineitem.profit});
//         } else {
//           var mostpopprod = weeksum.find(function(item) {return item['most popular product'] && item.week === lineitem.week;});
//           var leastpopprod = weeksum.find(function(item) {return item['least popular product'] && item.week === lineitem.week;});
//           var mostprofprod = weeksum.find(function(item) {return item['most profitable product'] && item.week === lineitem.week;});
//           var leastprofprod = weeksum.find(function(item) {return item['least profitable product'] && item.week === lineitem.week;});
//                   if (lineitem.quantity > mostpopprod.quantity) {
//             mostpopprod['most popular product'] = lineitem.product;
//             mostpopprod.quantity = lineitem.quantity;
//             }
//             if (lineitem.quantity < leastpopprod.quantity) {
//               leastpopprod['least popular product'] = lineitem.product;
//               leastpopprod.quantity = lineitem.quantity;
//             }
//             if (lineitem.profit > mostprofprod.profit) {
//               mostprofprod['most profitable product'] = lineitem.product;
//               mostprofprod.profit = lineitem.profit;
//             }
//             if (lineitem.profit < leastprofprod.profit) {
//               leastprofprod['least profitable product'] = lineitem.product;
//               leastprofprod.profit = lineitem.profit;
//             }
//
//             // return obj;
//         }
//         return weeksum;
//   },[]));
//   return summary;
// },[]);
// //
// // for (var i = 0; i<dataCat.length;i++) {
// // for (var j = 0; j<dataCat[i].length; j++){
// //   if (j === 0) {
// //         byProduct[i]({week: lineitem.week, 'most popular category': lineitem.product , quantity: lineitem.quantity});
// //         byProduct[i]['least popular category'] = {category: dataCat[i][j].category, quantity: dataCat[i][j].quantity};
// //         byProduct[i]['most profitable category'] = {category: dataCat[i][j].category, profit: dataCat[i][j].profit};
// //         byProduct[i]['least profitable category'] = {category: dataCat[i][j].category, profit: dataCat[i][j].profit};
// //       } else {
// //               if (dataCat[i][j].quantity > byProduct[i]['most popular category'].quantity) {
// //         byProduct[i]['most popular category'].category = dataCat[i][j].category;
// //         byProduct[i]['most popular category'].quantity = dataCat[i][j].quantity;
// //         }
// //         if (dataCat[i][j].quantity < byProduct[i]['least popular category'].quantity) {
// //           byProduct[i]['least popular category'].category = dataCat[i][j].category;
// //           byProduct[i]['least popular category'].quantity = dataCat[i][j].quantity;
// //         }
// //         if (dataCat[i][j].profit > byProduct[i]['most profitable category'].profit) {
// //           byProduct[i]['most profitable category'].category = dataCat[i][j].category;
// //           byProduct[i]['most profitable category'].profit = dataCat[i][j].profit;
// //         }
// //         if (dataCat[i][j].profit < byProduct[i]['least profitable category'].profit) {
// //           byProduct[i]['least profitable category'].category = dataCat[i][j].category;
// //           byProduct[i]['least profitable category'].profit = dataCat[i][j].profit;
// //         }
// //       }
// // }
// // }
// // return byProduct;
// }
var _ = require('lodash');
var fs = require('fs');
var _ = require('lodash');
var d = require('./drawTable');
var f = require('./filter');
var get = require('./extract');
var exprt = require('./export');
var febSales = './sales';
var folderPath = "./product-list";


//NOTE: AVOID THE USE OF REPETITVE FILTERS IF YOU CAN LOOP. FILTERS ARE TIME CONSUMING. ESPECIALLY IF YOU HAVE LARGE AMOUNTS OF DATA.

function summarizedSalesByProduct() {
  // var dataSummarized = [];
    var data = get.mappedSalesData();

    return data.reduce(function(allSummary, week){
      var keeptrack = {};
      allSummary.push(week.reduce(function(weekSum, sale) {
              if (!keeptrack[sale.product]) {
                keeptrack[sale.product] = 1;
                weekSum.push({week: sale.week, category: sale.category, product: sale.product, quantity: sale.quantity, unitprice: sale.unitprice, revenue: sale.revenue, totalcost: sale.totalcost, profit: sale.profit });
              } else {
                  var product = weekSum.find(function(item) {return item.product === sale.product;});
                  product.quantity += sale.quantity;
                  product.revenue += sale.revenue;
                  product.totalcost += sale.totalcost;
                  product.profit += sale.profit;

                  if (typeof product.unitprice!== 'object' && product.unitprice!==sale.unitprice) {
                    product.unitprice = [product.unitprice, sale.unitprice];
                  } else if (typeof product.unitprice === 'object' && product.unitprice.indexOf(sale.unitprice)===-1) {
                    product.unitprice.push(sale.unitprice);
                  }
              }

        return weekSum;
      },[])
    );
    return allSummary;
    },[]);
      // return dataSummarized;
  }
  var byProduct = f.concat(summarizedSalesByProduct());
  var filtered = f.filterData(byProduct,[['product','Heart Chocolates'],['week','week2']]);
  var sorted = byProduct.sort(f.sortBy('quantity'));
  // console.log(d.drawTable(d.dataTable(byProduct)));
// console.log(summarizedSalesByProduct());

function summarizedSalesByCategory () {
  var data = summarizedSalesByProduct();

    return data.reduce(function(allWeekSum, week){
        var keeptrack = {};
        allWeekSum.push(week.reduce(function(weekSum, product){
                if (!keeptrack[product.category]) {
                  keeptrack[product.category] = 1;
                  weekSum.push({week: product.week, category: product.category, quantity: product.quantity, unitprice: product.unitprice, revenue: product.revenue, totalcost: product.totalcost, profit: product.profit});
                } else {
                  var category = weekSum.find(function(item) {return item.category === product.category;});
                  category.quantity += product.quantity;
                  category.revenue += product.revenue;
                  category.totalcost += product.totalcost;
                  category.profit += product.profit;

                  if (typeof category.unitprice!== 'object' && category.unitprice!==product.unitprice) {
                    category.unitprice = [category.unitprice, product.unitprice];
                  } else if (typeof category.unitprice === 'object' && category.unitprice.indexOf(product.unitprice)===-1) {
                    category.unitprice.push(product.unitprice);
                  }
                }
                return weekSum;
          },[]));
          return allWeekSum;
    },[]);
  }

function returnWhatNelisaWants() {
  var data = summarizedSalesByProduct();
  var dataCat = summarizedSalesByCategory();
          // NOTE: USING REDUCE HERE INSTEAD OF FIRST FILTERING TO GET EACH WEEK SAVES HALF THE TIME IT WOULD TAKE IF YOU FIRST FILTER.
          // var weekSummary = [];

          // var weeknames = getWeekNames();
          //
          //   weeknames.forEach(function(week)
          // var data = summarizedSalesByProduct().filter(function(product) {
          //                 return product.week === week;
          //               });


var byProduct = data.reduce(function(summary, week) {

  summary.push(week.reduce(function(obj, lineitem){

    if (!obj.week) {
          obj.week = lineitem.week;
          obj['MostPopProd'] = lineitem.product, lineitem.quantity;
          obj['LeastPopProd'] = lineitem.product,  lineitem.quantity;
          obj['MostProfProd'] = lineitem.product,  lineitem.profit;
          obj['LeastProfProd'] = lineitem.product, lineitem.profit;
        } else {
                  if (lineitem.quantity > obj['MostPopProd'].quantity) {
            obj['MostPopProd']= lineitem.product, lineitem.quantity;
            }
            if (lineitem.quantity < obj['LeastPopProd'].quantity) {
              obj['LeastPopProd'].product = lineitem.product,lineitem.quantity;
            }
            if (lineitem.profit > obj['MostProfProd'].profit) {
              obj['MostProfProd'].product = lineitem.product,lineitem.profit;
            }
            if (lineitem.profit < obj['LeastProfProd'].profit) {
              obj['LeastProfProd'].product = lineitem.product,lineitem.profit;
            }

            // return obj;
        }
        return obj;
  },{}));
  return summary;
},[]);
//
// for (var i = 0; i<dataCat.length;i++) {
// for (var j = 0; j<dataCat[i].length; j++){
//   if (j === 0) {
//         byProduct[i]['most popular category'] = {category: dataCat[i][j].category, quantity: dataCat[i][j].quantity};
//         byProduct[i]['least popular category'] = {category: dataCat[i][j].category, quantity: dataCat[i][j].quantity};
//         byProduct[i]['most profitable category'] = {category: dataCat[i][j].category, profit: dataCat[i][j].profit};
//         byProduct[i]['least profitable category'] = {category: dataCat[i][j].category, profit: dataCat[i][j].profit};
//       } else {
//               if (dataCat[i][j].quantity > byProduct[i]['most popular category'].quantity) {
//         byProduct[i]['most popular category'].category = dataCat[i][j].category;
//         byProduct[i]['most popular category'].quantity = dataCat[i][j].quantity;
//         }
//         if (dataCat[i][j].quantity < byProduct[i]['least popular category'].quantity) {
//           byProduct[i]['least popular category'].category = dataCat[i][j].category;
//           byProduct[i]['least popular category'].quantity = dataCat[i][j].quantity;
//         }
//         if (dataCat[i][j].profit > byProduct[i]['most profitable category'].profit) {
//           byProduct[i]['most profitable category'].category = dataCat[i][j].category;
//           byProduct[i]['most profitable category'].profit = dataCat[i][j].profit;
//         }
//         if (dataCat[i][j].profit < byProduct[i]['least profitable category'].profit) {
//           byProduct[i]['least profitable category'].category = dataCat[i][j].category;
//           byProduct[i]['least profitable category'].profit = dataCat[i][j].profit;
//         }
//       }
// }
// }
// return byProduct;
}

console.log(returnWhatNelisaWants());

// var returned = returnWhatNelisaWants();

    // console.log(d.drawTable(d.dataTable(returned)));
