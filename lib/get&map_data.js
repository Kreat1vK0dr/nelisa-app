var fs = require('fs'),
    draw = require('./drawTable'),
    f = require('./filter'),
    path = require('./filepaths');

var catFile = path.categoriesFile,
    prodFile = path.productsFile,
    salesFolder = path.salesFolder,
    purchasesFile = path.purchasesFile;


function getRawPurchasesData() {
var pContents = fs.readFileSync(purchasesFile, 'utf8');
  return pContents.replace(/,/g,'.').split("\n").filter(function(item){
    return item!=="" && item.match(/Shop;Date/i)===null;
    });
}

// console.log(getRawPurchasesData());

function rawPurchasesDataConverted() {
  return getRawPurchasesData().map(function(purchase) {
                    purchase = purchase.split(";");
                    purchase[3] = Number(purchase[3]);
                    purchase[4] = Number(purchase[4].replace(/R/,""));
                    // console.log("This is purchase:", purchase);
                    return purchase;
                  });
}

// console.log(rawPurchasesDataConverted());


function mappedPurchases() {
    var purchases = rawPurchasesDataConverted();
    var obj = {};
    return purchases.reduce(function(arr, item){
          if (!obj[item[2]]) {
            obj[item[2]] = true;
                arr.push( {
                              product: item[2],
                              purchases: [{
                                            date:   item[1],
                                            quantity: item[3],
                                            remaining: item[3],
                                            unitCost: item[4],
                                            supplier: item[0]

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

exports.mapSQLPurchases = function(SQLpurchases) {
    var purchases = SQLpurchases;
    var map = new Map();
    purchases.forEach(function(purchase){

          if (!map.get(purchase.product_id)) {
            map.set(purchase.product_id, [purchase]);
          }  else {
                  map.get(purchase.product_id).push(purchase);
                }
        });
    return map;
};//end of extract purchases.

function findPurchases(item, mappedData) {
  var productDetails = mappedData.find(function(purchases){
    return purchases.product === item;
      });
  return productDetails.purchases;
}

function getCostAndLogSaleAt(date, item, quantity, mappedPurchases) {
  var qOver = quantity , cost = 0;
  var purchases = findPurchases(item, mappedPurchases);
  if (qOver>0) {
        for (var j=0; j<purchases.length+1; j++) {
        if(purchases[j]!==undefined && new Date(purchases[j].date) <= new Date(date)){
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
      } else {
                cost = [cost, quantity-qOver];
                break;
      }
      }
    }
      return cost;
  }// END OF GET COST.

exports.SQLCostAndLogSaleAt = function(date, quantity, mappedPurchases, updatePurchasesArray) {
  var cost = 0, purchases = mappedPurchases, update = updatePurchasesArray;
  if (quantity > 0) {
      for (var j=0; j<purchases.length; j++) {
          if(purchases[j].date <= date){
            if (purchases[j].remaining>0)  {
              if (purchases[j].remaining<quantity) {
                cost += purchases[j].remaining * purchases[j].eacost;
                quantity -= purchases[j].remaining;
                purchases[j].remaining -= purchases[j].remaining;
                update.push([purchases[j].remaining, purchases[j].id]);
              continue;
            } else {
                  purchases[j].remaining -= quantity;
                  cost += quantity * purchases[j].eacost;
                  quantity -= quantity;
                  update.push([purchases[j].id, purchases[j].remaining]);
                  break;
            }
          }
        }
      }
    }

        return {cost: cost, quantity: quantity};
};// END OF GET COST.


  function getQuantityPurchasedBy(date, product) {
    var purchases = findPurchases(product, mappedPurchases()).filter(function(i){return new Date(i.date) <= new Date(date);});
    // console.log(draw.table(draw.dataTable(purchases)));
    return purchases.reduce(function(sum,i){sum += i.quantity; return sum;},0);
  }

  function getInventoryRemainingAt(date, product, mappedPurchases) {
    var purchases = findPurchases(product, mappedPurchases).filter(function(i){return new Date(i.date) <= new Date(date);});
    // console.log(draw.table(draw.dataTable(purchases)));
    return purchases.reduce(function(sum,i){sum += i.remaining; return sum;},0);
  }

exports.SQLInventoryRemainingAt = function(date, productID, mappedPurchases) {
    var purchases = mappedPurchases.get(productID).filter(function(i){return i.date <= date;});
    // console.log(draw.table(draw.dataTable(purchases)));
    return purchases.reduce(function(sum,i){sum += i.remaining; return sum;},0);
  };

  function getProductList(fromThisList) {
       var obj = {};
       return fromThisList.reduce(function(arr, item){
         if (!obj[item.product]) {
           obj[item.product] = 1;
           arr.push(item.product);
         }
         return arr;
       }, []);
     }

 function getWeekNames() {
   return fs.readdirSync(salesFolder).map(function(filename) {
     return filename.replace('.csv',"");
   });
  }

 function getRawSalesData() {
   var files = fs.readdirSync(salesFolder);
   var itemlistByWeek = [];
         files.forEach(function(week) {
               var contents = fs.readFileSync(salesFolder+'/'+week, 'utf8');
               var itemlist = contents.split('\n').filter(function(item){
                              return item!=="";
                              });
               itemlistByWeek.push(itemlist);
             });
      return itemlistByWeek;
    }

 function createSalesArray(itemlist) {
     itemarray = [];
               itemlist.forEach(function(item) {
                     var item = item.split(',');
                     itemarray.push(item);
               });
      return itemarray;
   }// END OF CREATE ITEM ARRAY

   //NOTE: PRODUCT_CATEGORY FILE MUST FIRST BE CREATED (IF IT DOESN'T YET EXIST). IF IT DOES EXIST THEN YOU ARE OK TO GO AHEAD AN RUN THE CODE.
   //USE EXPORTS MODULE TO EXPORT PRODUCT LIST. THEN CREATE A NEW FILE CALLED PRODUCT_CATEGORIES. DEFINE THE CATEGORY FOR EACH PRODUCT IN THE CELL TO THE RIGHT OF THE PRODUCT.
   //ONLY THEN CAN YOU IMPORT CATFILE SUCCESSFULLY.
   function mappedCategories() {
     var list = fs.readFileSync(catFile, "utf8");
     return list.split('\n').filter(function(item){
       return item!=="" && item.match(/product/i)===null;
     }).map(function(item) {
       var split = item.split(',');
       return {
                   product: split[0],
                   category: split[1]/*.toLowerCase()*/
             }
     });
   }

    function getCategory(mappedCategories, product) {
      var map = mappedCategories;
      return map.find(function(item){
          return item.product === product;
      }).category;
    }

 function mappedSales() {
   var weeknumber;
   var weekitemlist;
   // var itemarray;
   var allSalesData = [];
   var catMap = mappedCategories();
   var purchases = mappedPurchases();
   var salesData = getRawSalesData();
   for (var i = 0; i<salesData.length; i++) {

   var itemarray = createSalesArray(salesData[i]);

   allSalesData.push(itemarray.map(function(sale) {
         var cat = getCategory(catMap, sale[2]);
         var p = Number(sale[4].replace(/R/,""));
         var q = Number(sale[3]);
         var inv = getInventoryRemainingAt(sale[1], sale[2], purchases);
         var c = getCostAndLogSaleAt(sale[1], sale[2], q, purchases);
         var obj = {
                   week: "week"+(i+1),
                   day: sale[0],
                   date: sale[1],
                   category: cat,
                   product: sale[2],
                   quantity: q,
                   inventory: inv,
                   unitPrice: p
                   };
                  obj.revenue = typeof c==='object' ? p*c[1] : p*q;
                  obj.totalcost = typeof c==='object' ? c[0] : c;
                  obj.profit = typeof c==='object' ? p*c[1] - c[0] : p*q-c;
                  obj.profitMargin = Number(((obj.profit/obj.revenue)*100).toFixed(2));

               return obj;
           })
           );
              // return allSalesData;
         }
        return allSalesData;
       }

exports.mappedCategories = function() {
  return mappedCategories();
};

 exports.category = function(mappedCategories, product) {
   return getCategory(mappedCategories, product);
 };

 exports.mappedSales = mappedSales;

 exports.rawSalesData = function() {
   return getRawSalesData();
 };

 exports.weekNames = function() {
   return getWeekNames();
 };

exports.productList = function(data) {
  return getProductList(data);
};

exports.costAndLogSaleAt = function(date, product, quantity,mappedPurchases) {
  return getCostAndLogSaleAt(date, product, quantity, mappedPurchases);
};

exports.rawPurchasesData = function() {
  return getRawPurchasesData();
};

exports.rawPurchasesDataConverted = function() {
  return rawPurchasesDataConverted();
};

exports.mappedPurchases = function() {
  return mappedPurchases();
};

exports.salesArray = function(itemlist) {
  return createSalesArray(itemlist);
};

exports.findPurchases = function(item, mappedData) {
  return findPurchases(item, mappedData);
};

exports.quantityPurchasedBy = function(date, product) {
  return getQuantityPurchasedBy(date, product);
};

exports.inventoryRemainingAt = function(date, product, mappedPurchases) {
  return getInventoryRemainingAt(date, product, mappedPurchases);
};
// var filter = mappedPurchases().filter(function(i,idx){return idx === 0 || idx === 1;});
//
// console.log(filter);
// var filter = mappedSales().reduce(function(arr,i){arr.push(i[0]);return arr;},[]);
// console.log(filter);
// var output = getRawSalesData();
//   var result = createSalesArray(output[0])[0];
// console.log(result);
// var purchases = mappedPurchases();
// var result = mappedSales()[2].find(function(i){return i.date === "17-Feb" && i.product === "Bananas - loose";});
// console.log(result);
// mappedSales();
// var found = getQuantityPurchasedBy('15-Feb',"Milk 1l");
// console.log(found);
