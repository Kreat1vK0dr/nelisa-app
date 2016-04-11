var group = require('./group_data');

function returnWhatNelisaWants() {
  var data = group.salesByProduct();
  var dataCat = group.salesByCategory();

          var byProduct = data.reduce(function(summary, week) {

            summary.push(week.reduce(function(obj, lineitem){

              if (!obj.week) {
                    obj.week = lineitem.week;
                    obj.data = [{what: 'most popular product',item: lineitem.product, quantity: lineitem.quantity, inventory: lineitem.inventory, profit: lineitem.profit, profitMargin: lineitem.profitMargin}];
                    obj.data.push({what: 'least popular product', item: lineitem.product, quantity: lineitem.quantity, inventory: lineitem.inventory, profit: lineitem.profit, profitMargin: lineitem.profitMargin});
                    obj.data.push({what: 'most profitable product', item: lineitem.product, quantity: lineitem.quantity, inventory: lineitem.inventory, profit: lineitem.profit, profitMargin: lineitem.profitMargin});
                    obj.data.push({what: 'least profitable product', item: lineitem.product, quantity: lineitem.quantity, inventory: lineitem.inventory, profit: lineitem.profit, profitMargin: lineitem.profitMargin});
                  } else {
                      var mpopP = obj.data.find(function(i) {return i.what === "most popular product";});
                      var lpopP = obj.data.find(function(i) {return i.what === "least popular product";});
                      var mprofP = obj.data.find(function(i) {return i.what === "most profitable product";});
                      var lprofP = obj.data.find(function(i) {return i.what === "least profitable product";});

                            if (lineitem.quantity > mpopP.quantity) {
                      mpopP.item = lineitem.product;
                      mpopP.quantity = lineitem.quantity;
                      mpopP.inventory = lineitem.inventory;
                      mpopP.profit = lineitem.profit;
                      mpopP.profitMargin = lineitem.profitMargin;
                      }
                      if (lineitem.quantity < lpopP.quantity) {
                        lpopP.item = lineitem.product;
                        lpopP.quantity = lineitem.quantity;
                        lpopP.inventory = lineitem.inventory;
                        lpopP.profit = lineitem.profit;
                        lpopP.profitMargin = lineitem.profitMargin;
                      }
                      if (lineitem.profit > mprofP.profit) {
                        mprofP.item = lineitem.product;
                        mprofP.profit = lineitem.profit;
                        mprofP.quantity = lineitem.quantity;
                        mprofP.inventory = lineitem.inventory;
                        mprofP.profitMargin = lineitem.profitMargin;
                      }
                      if (lineitem.profit < lprofP.profit) {
                        lprofP.item = lineitem.product;
                        lprofP.profit = lineitem.profit;
                        lprofP.quantity = lineitem.quantity;
                        lprofP.inventory = lineitem.inventory;
                        lprofP.profitMargin = lineitem.profitMargin;
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
                  byProduct[i].data.push({what: 'most popular category', item: dataCat[i][j].category, quantity: dataCat[i][j].quantity, inventory: dataCat[i][j].inventory, profit: dataCat[i][j].profit, profitMargin: dataCat[i][j].profitMargin});
                  byProduct[i].data.push({what: 'least popular category', item: dataCat[i][j].category, quantity: dataCat[i][j].quantity, inventory: dataCat[i][j].inventory, profit: dataCat[i][j].profit, profitMargin: dataCat[i][j].profitMargin});
                  byProduct[i].data.push({what: 'most profitable category', item: dataCat[i][j].category, quantity: dataCat[i][j].quantity, inventory: dataCat[i][j].inventory, profit: dataCat[i][j].profit, profitMargin: dataCat[i][j].profitMargin});
                  byProduct[i].data.push({what: 'least profitable category', item: dataCat[i][j].category, quantity: dataCat[i][j].quantity, inventory: dataCat[i][j].inventory, profit: dataCat[i][j].profit, profitMargin: dataCat[i][j].profitMargin});

                } else {
                        var mpopC = byProduct[i].data.find(function(i) {return i.what === 'most popular category';});
                        var lpopC = byProduct[i].data.find(function(i) {return i.what === 'least popular category';});
                        var mprofC = byProduct[i].data.find(function(i) {return i.what === 'most profitable category';});
                        var lprofC = byProduct[i].data.find(function(i) {return i.what === 'least profitable category';});

                        if (dataCat[i][j].quantity > mpopC.quantity) {
                  mpopC.item = dataCat[i][j].category;
                  mpopC.quantity = dataCat[i][j].quantity;
                  mpopC.inventory = dataCat[i][j].inventory;
                  mpopC.profit = dataCat[i][j].profit;
                  mpopC.profitMargin = dataCat[i][j].profitMargin;
                  }
                  if (dataCat[i][j].quantity < lpopC.quantity) {
                    lpopC.item = dataCat[i][j].category;
                    lpopC.quantity = dataCat[i][j].quantity;
                    lpopC.inventory = dataCat[i][j].inventory;
                    lpopC.profit = dataCat[i][j].profit;
                    lpopC.profitMargin = dataCat[i][j].profitMargin;
                  }
                  if (dataCat[i][j].profit > mprofC.profit) {
                    mprofC.item = dataCat[i][j].category;
                    mprofC.profit = dataCat[i][j].profit;
                    mprofC.quantity = dataCat[i][j].quantity;
                    mprofC.inventory = dataCat[i][j].inventory;
                    mprofC.profitMargin = dataCat[i][j].profitMargin;
                  }
                  if (dataCat[i][j].profit < lprofC.profit) {
                    lprofC.item = dataCat[i][j].category;
                    lprofC.profit = dataCat[i][j].profit;
                    lprofC.quantity = dataCat[i][j].quantity;
                    lprofC.inventory = dataCat[i][j].inventory;
                    lprofC.profitMargin = dataCat[i][j].profitMargin;
                  }
                }
        }
}
return byProduct;
}

exports.whatSheWants = function() {
  return returnWhatNelisaWants();
};
