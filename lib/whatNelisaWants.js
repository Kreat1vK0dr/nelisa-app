var group = require('./group_data');

function returnWhatNelisaWants() {
  var data = group.salesByProduct();
  var dataCat = group.salesByCategory();
          // NOTE: USING REDUCE HERE INSTEAD OF FIRST FILTERING TO GET EACH WEEK SAVES HALF THE TIME IT WOULD TAKE IF YOU FIRST FILTER.
          // var weekSummary = [];

          // var weeknames = getWeekNames();
          //
          //   weeknames.forEach(function(week)
          // var data = groupSalesByProduct().filter(function(product) {
          //                 return product.week === week;
          //               });

          var byProduct = data.reduce(function(summary, week) {

            summary.push(week.reduce(function(obj, lineitem){

              if (!obj.week) {
                    obj.week = lineitem.week;
                    obj['most popular product'] = {product: lineitem.product , quantity: lineitem.quantity};
                    obj['least popular product'] = {product: lineitem.product  , quantity: lineitem.quantity};
                    obj['most profitable product'] = {product: lineitem.product, profit: lineitem.profit};
                    obj['least profitable product'] = {product: lineitem.product, profit: lineitem.profit};
                  } else {
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
            },{}));
            return summary;
          },[]);

      for (var i = 0; i<dataCat.length;i++) {
        for (var j = 0; j<dataCat[i].length; j++){
            if (j === 0) {
                  byProduct[i]['most popular category'] = {category: dataCat[i][j].category, quantity: dataCat[i][j].quantity};
                  byProduct[i]['least popular category'] = {category: dataCat[i][j].category, quantity: dataCat[i][j].quantity};
                  byProduct[i]['most profitable category'] = {category: dataCat[i][j].category, profit: dataCat[i][j].profit};
                  byProduct[i]['least profitable category'] = {category: dataCat[i][j].category, profit: dataCat[i][j].profit};
                } else {
                        if (dataCat[i][j].quantity > byProduct[i]['most popular category'].quantity) {
                  byProduct[i]['most popular category'].category = dataCat[i][j].category;
                  byProduct[i]['most popular category'].quantity = dataCat[i][j].quantity;
                  }
                  if (dataCat[i][j].quantity < byProduct[i]['least popular category'].quantity) {
                    byProduct[i]['least popular category'].category = dataCat[i][j].category;
                    byProduct[i]['least popular category'].quantity = dataCat[i][j].quantity;
                  }
                  if (dataCat[i][j].profit > byProduct[i]['most profitable category'].profit) {
                    byProduct[i]['most profitable category'].category = dataCat[i][j].category;
                    byProduct[i]['most profitable category'].profit = dataCat[i][j].profit;
                  }
                  if (dataCat[i][j].profit < byProduct[i]['least profitable category'].profit) {
                    byProduct[i]['least profitable category'].category = dataCat[i][j].category;
                    byProduct[i]['least profitable category'].profit = dataCat[i][j].profit;
                  }
                }
        }
}
return byProduct;
}

exports.whatSheWants = function() {
  return returnWhatNelisaWants();
};
