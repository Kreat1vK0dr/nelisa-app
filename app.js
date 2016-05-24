'use strict';

var express = require('express'),
    exphbs = require('express-handlebars'),
    path = require('path'),
    mysql = require('mysql'),
    myConnection = require('express-myconnection'),
    bodyParser = require('body-parser'),
    sassMiddleware = require('node-sass-middleware'),
    postcssMiddleware = require('postcss-middleware'),
    autoprefixer = require('autoprefixer'),
    session = require('express-session');

var tmplName = require('./lib/template-name'),
    stats = require('./lib/stats'),
    summary = require('./lib/summary'),
    ProductMethods = require('./lib/products_CRUD'),
    CategoryMethods = require('./lib/categories_CRUD'),
    sales = require('./lib/sales'),
    helpers = require('./lib/helpers'),
    Login = require('./data-services/loginDataService'),
    loginMethod = require('./lib/loginMethods'),
    ConnectionProvider = require('./routes/connectionProvider');

var app = express();

var dbOptions = {
    host: 'localhost',
    user: 'root',
    password: '1amdan13l',
    port: 3306,
    database: 'nelisa_another_copy'
};

var dataServiceSetup = function(connection){
	return {
		loginService: new Login(connection)
	}
};

var myConnectionProvider = new ConnectionProvider(dbOptions, dataServiceSetup);
app.use(myConnectionProvider.setupProvider);

app.use(myConnection(mysql, dbOptions, 'pool'));

app.set('port', (process.env.PORT || 5000));

var hbs = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, "views/layouts"),
  partialsDir: path.join(__dirname, "views/partials"),
  helpers: {
              capFL: function(string) {
                return string.slice(0,1).toUpperCase()+string.slice(1);
              },
              bracketNegative: function(string) {
                return string.match(/-/) ? '('+string.replace('-','')+')' : string;
              }
  }
});

app.engine('handlebars', hbs.engine);

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, "views"));

app.use('/css', sassMiddleware({
    src: path.join(__dirname, 'public', 'sass'),
    dest: path.join(__dirname, 'public', 'css'),
    debug: true,
    outputStyle: 'expanded',
    // prefix:  '/css'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

// app.use(postcssMiddleware({
//     src: function (req) {
//         return path.join(req.path);
//     },
//     plugins: [autoprefixer({
//         browsers: ['> 1%', 'IE 7', 'last 2 versions'],
//         cascade: false
//     })]
// }));

app.use(express.static('public'));

//setup middleware
app.use(myConnection(mysql, dbOptions, 'single'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
        extended: false
    }))
    // parse application/json
app.use(bodyParser.json())
app.use(session({secret: "pizzadough", cookie: {maxAge: 600000}, resave:true, saveUninitialized: false}));

app.get('/', function (req, res) {
  res.redirect("/home");
});

app.get('/home', function (req, res) {
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
app.get('/products', products.show);
app.get('/products/add', products.showAdd);
app.post('/products', products.add);
app.get('/products/edit/:id', products.get);
app.post('/products/update', products.update);
app.get('/products/delete/:id', products.delete);

var categories = new CategoryMethods();
app.get('/categories', categories.show);
app.get('/categories/add', categories.showAdd);
app.post('/categories', categories.add);
app.get('/categories/edit/:id', categories.get);
app.post('/categories/update', categories.update);
app.get('/categories/delete/:id', categories.delete);

app.get('/admin',loginMethod.login);
app.get('/admin/login',loginMethod.adminDialogue);
app.post('/admin/login/check',loginMethod.checkBeforeLoggingIn);
app.get('/admin/sales', sales.home);
app.post('/admin/sales/add', sales.execute);
// app.get('/admin/login/check',loginMethod.checkBeforeLoggingIn);

app.get('/admin/dashboard', function(req,res){
  res.render('admin_home',{layout: 'admin'});
});
// app.get('/data',function(req, res){
// 	console.log('body: ' + JSON.stringify(req.body));
//   // res.send(req.body);
// });

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
