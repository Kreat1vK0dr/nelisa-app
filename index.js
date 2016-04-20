// 'use strict';

var express = require('express'),
    exphbs  = require('express-handlebars'),
    path = require('path'),
    mysql = require('mysql'),
    myConnection = require('express-myconnection'),
    bodyParser = require('body-parser'),
    sassMiddleware = require('node-sass-middleware'),
    postcssMiddleware = require('postcss-middleware');
    autoprefixer = require('autoprefixer');

var tmplName = require('./lib/template-name'),
    stats = require('./lib/stats'),
    summary = require('./lib/summary');
    ProductMethods = require('./lib/products_CRUD');

var dbOptions = {
      host: 'localhost',
      user: 'root',
      password: '1amdan13l',
      port: 3306,
      database: 'nelisa_copy'
};

var app = express();

app.set('port', (process.env.PORT || 5000));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));

app.set('view engine', 'handlebars');

app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, 'public', 'css')
    dest: path.join(__dirname, 'public','css','sass'),
    debug: true,
    response: false,
    outputStyle: 'compressed',
    prefix:  '/css'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

app.use(postcssMiddleware({
  src: function(req) {
    return path.join("public","css","sass", req.path);
  },
  plugins: [autoprefixer]

}));

app.use(express.static(path.join(__dirname, 'public')));

//setup middleware
app.use(myConnection(mysql, dbOptions, 'single'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/', function(req,res){
  app.engine('handlebars', exphbs({defaultLayout: 'main'}));
  res.redirect("/home");
});

app.get('/home', function(req,res) {
  res.render("home");
});

app.get('/stats', stats.home);
app.post('/stats/:type', stats.redirect);
app.get('/stats/:type/:month/:week', stats.show);
// app.get('/stats/:type', stats.show);

app.get('/summary', summary.home);
app.post('/summary/table', summary.redirect);
app.get('/summary/table/:type/:month/:week', summary.show);
// app.get('/summary/table', summary.show);

var products = new ProductMethods();
app.get('/products',products.show);
app.get('/products/edit/:id',products.get);
app.post('/products/update/:id',products.update);
app.post('/products/delete/:id',products.delete);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
