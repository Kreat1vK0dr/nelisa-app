var statsQueries = require('./sales-stats-queries'),
    tmplName = require('./template-name');

var getDescription = function(stat) {
  switch(stat) {
  case "mPopProd":  return "Most Popular Product";
  case "lPopProd":  return "Least Popular Product";
  case "mProfProd": return "Most Profitable Product";
  case "lProfProd": return "Least Profitable Product";
  case "mPopCat":   return "Most Popular Category";
  case "lPopCat":   return "Least Popular Category";
  case "mProfCat":  return "Most Profitable Category";
  case "lProfCat":  return "Least Profitable Category";
  }
};

exports.home = function(req, res, next) {
  var context = req.session.context;
  req.getConnection(function(err, connection){
    connection.query("SELECT week FROM sales GROUP BY week", function(err, rows){
      if (err) return next(err);
      context.weeks = rows;
      connection.query("SELECT monthname(date) month FROM sales GROUP BY monthname(date)", function(err, rows){
        if (err) return next(err);
        context.months = rows;
        console.log(context);
        res.render('stats_home', context);
});
});
});
};

exports.redirect  = function(req,res){
  res.redirect('/stats/'+req.params.type+'/'+req.body.month+'/'+req.body.week);
};

exports.show = function(req, res, next) {
  var month = req.params.month,
      week = Number(req.params.week),
      type = req.params.type,
      context = req.session.context;

  var tmpl = tmplName.get(type),
      stats = ["mPopProd","lPopProd","mProfProd","lProfProd","mPopCat","lPopCat","mProfCat","lProfCat"],
      track = stats.length;

      context.period =  month+" : week "+week;
      context.data = [];

  req.getConnection(function(err, connection){
    if (err) return next(err);

    stats.forEach(function(stat){
      var sql = statsQueries.getQueryForTable(stat),
          description = getDescription(stat);

      connection.query(sql, [month,week],function(err, row){
        if (err) return next(err);
        var statDetails = row[0];

          statDetails.profitMargin = ((statDetails.profit/statDetails.revenue)*100).toFixed(1);
          statDetails.revenue = statDetails.revenue.toFixed(2);
          statDetails.profit = statDetails.profit.toFixed(2);
          statDetails.cost = statDetails.cost.toFixed(2);

        statDetails.description = getDescription(stat);
        var idType = stat.match(/prod/i) ? "id" : "category_id",
            id = statDetails.id;
        connection.query("SELECT * FROM products WHERE ?? = ?",[idType,id], function(err, result){
        if (err) return next(err);
        console.log(result);
        var inventory;

        if (idType === "category_id" && result.length>1){
        inventory = result.reduce(function(sum,product){return sum+=product.inventory},0);
      } else {
        inventory = result[0].inventory;
      }

      statDetails.stockAvailable = inventory;

        context.data.push(statDetails);
        --track;

        if (track===0){
          connection.query("SELECT week FROM sales GROUP BY week", function(err, weeks){
            if (err) return next(err);
            console.log("This should be list of weeks", weeks);
            weeks = weeks.map(function(each){
                    each.selected = each.week === week ? 'selected' : '';
                    return each;
            });
            context.weeks = weeks;
            connection.query("SELECT monthname(date) month FROM sales GROUP BY monthname(date)", function(err, months){
              if (err) return next(err);
              console.log("This should be list of months", months);
              months = months.map(function(each){
                       each.selected = each.month === month ? 'selected' : '';
                       return each;
              });
              context.months = months;
              res.render(tmpl, context);
              // connection.end();
            });
          });
        }

      });
      });
    });
  });
};
