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
  req.getConnection(function(err, connection){
    connection.query("SELECT week FROM sales GROUP BY week", function(err, rows){
      if (err) return next(err);
      context = {weeks: rows};
      connection.query("SELECT monthname(date) month FROM sales GROUP BY year(date)", function(err, rows){
        if (err) return next(err);
        context.months = rows;
        console.log(context);
        res.render('stats_home', context);
});
});
});
};

exports.show  = function(req, res, next) {
  var month = req.body.month,
      week = Number(req.body.week),
      type = req.params.type;

  var tmpl = tmplName.get(type),
      stats = ["mPopProd","lPopProd","mProfProd","lProfProd","mPopCat","lPopCat","mProfCat","lProfCat"],
      monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
      track = stats.length,
      context = {title: "sales stats for "+monthNames[month-1]+" : WEEK "+week, data: []};

  req.getConnection(function(err, connection){
    if (err) return next(err);

    stats.forEach(function(stat){
      var sql = statsQueries.getQueryForTable(stat),
          description = getDescription(stat);

      connection.query(sql, [month,week],function(err, rows){
        if (err) return next(err);

        rows[0].stat = getDescription(stat);
        context.data.push(rows[0]);

        --track;

        if (track===0){
          connection.query("SELECT week FROM sales GROUP BY week", function(err, rows){
            if (err) return next(err);
            context.weeks = rows;
            connection.query("SELECT monthname(date) month FROM sales GROUP BY year(date)", function(err, rows){
              if (err) return next(err);
              context.months = rows;
              console.log(context);
              res.render(tmpl, context);
              // connection.end();
            });
          });
        }

      });
    });
  });
};
