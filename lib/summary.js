var hbs = require('handlebars');

var tmplName = require('./template-name'),
    salesQueries = require('./sales-data-queries'),
    helpers = require('./helpers');

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

exports.redirect = function(req,res) {
  var type = req.body.type+'/',
      month = req.body.month+'/',
      week = req.body.week;
      res.redirect('/summary/table/'+type+month+week);
    };

exports.show = function(req,res,next) {
  var type = req.params.type,
      month = req.params.month,
      week = Number(req.params.week);

  var query = salesQueries.getQuery(type),
      tmpl = tmplName.get(type),
      types = [{type: 'product'},{type: 'category'}];

  types = types.map(function(option){
            option.selected = option.type.toLowerCase() === type ? 'selected' : '';
            return option;
            });
            
  hbs.registerHelper('capFL', helpers.capFirstLetter);

  req.getConnection(function(err, connection) {

    connection.query(query, [month,week], function(err, rows){
      if (err) return next(err);

      console.log("SUCCESSFULLY RETRIEVED DATA");
      var context = {data: rows, types: types, period: month+" : week "+week};

      connection.query("SELECT week FROM sales GROUP BY week", function(err, weeks){
        if (err) return next(err);
        weeks = weeks.map(function(each) {

                        each.selected = each.week === week ? 'selected' : '';
                        return each;
                        });
        context.weeks = weeks;

          connection.query("SELECT monthname(date) month FROM sales GROUP BY year(date)", function(err, months){
            if (err) return next(err);

            months = months.map(function(each){
                             each.selected = each.month === month ? 'selected' : '';
                             return each;
                             });
            context.months = months;
            res.render(tmpl, context);
        });
    });
  });
});
};
