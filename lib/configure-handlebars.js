var handlebars = require('handlebars');

var tmplName = function(type) {
  switch (type) {
    case "m&l" : return "Most&Least.handlebars";
    case "product" : return "products.handlebars";
    case "category" : return "categories.handlebars";
  }
};

var compile = function(type, week) {

  var n = week,
      context = context(type,week),
      tmplName = tmplName(type);
      src = fs.readFileSync('./templates/'+tmplName, 'utf8'),
      tmpl = handlebars.compile(src);

  return tmpl(context);
};

exports.getContext = context;
exports.compile = compile;
exports.getTmplName = tmplName;
