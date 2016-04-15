var tmplName = require('./template-name'),
    salesQueries = require('./sales-data-queries');

exports.home = function(req,res,next){
  req.getConnection(function(err, connection){
    connection.query("SELECT week FROM sales GROUP BY week", function(err, rows){
      if (err) return next(err);
      context = {weeks: rows};
      connection.query("SELECT monthname(date) month FROM sales GROUP BY year(date)", function(err, rows){
        if (err) return next(err);
        context.months = rows;
        console.log(context);
        res.render('summary_home', context);
});
});
});
};

exports.show = function(req,res, next) {
  var type = req.body.type,
      month = req.body.month,
      week = req.body.week;

  var query = salesQueries.getQuery(type),
      tmpl = tmplName.get(type);
      
console.log("");
console.log("THIS IS QUERY:", query);
console.log("");

  req.getConnection(function(err, connection) {
    connection.query(query, [month,week], function(err, rows){
      if (err) return next(err);

      console.log("SUCCESSFULLY RETRIEVED DATA");
      var context = {data: rows};
      connection.query("SELECT week FROM sales GROUP BY week", function(err, rows){
        if (err) return next(err);
        context.weeks = rows;
          connection.query("SELECT monthname(date) month FROM sales GROUP BY year(date)", function(err, rows){
            if (err) return next(err);
            context.period = month+" : week "+week;
            context.months = rows;
            res.render(tmpl, context);
        });
    });
  });
});
};
