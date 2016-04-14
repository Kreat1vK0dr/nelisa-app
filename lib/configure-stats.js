var statsQueries = require('./sales-stats-queries'),
    configTmpl = require('./lib/configure-handlebars');

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

exports.show  = function(req, res, next) {
  var stats = ["mPopProd","lPopProd","mProfProd","lProfProd","mPopCat","lPopCat","mProfCat","lProfCat"],
      monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

  var month = req.params.month-1,
      week = req.params.week,
      type = req.params.type;

  var tmpl = configTmpl.getTmplName(type);

  var groupP = group.salesByProduct(),
                        dataProd = {data: []};

                    for (var p of groupP[n-1]) {
                      dataProd.data.push(p);
                    }

                    dataProd.title = "Summary by Product for Week "+(n);

                    return dataProd;

  req.getConnect(function(err, connection){

    var track = queries.length,
        context = {title: "sales stats for "+monthNames[month]+" : week "+week, data: []};

    stats.forEach(function(stat){
      var sql = statsQueries.getQueryForTable(query, month, week),
          description = getDescription(stat);
      connection.query(sql, function(err, rows){
        if (err) return next(err);
        rows[0].stat = getDescription(stat);
        context.data.push(rows[0]);
        if (stat)
        --track;
        if (track===0){
          res.render(tmpl, context);
          connection.end();

        }
      });
    });
  });
};
