'use strict';

var express = require('express'),
    exphbs = require('express-handlebars'),
    path = require('path'),
    mysql = require('mysql'),
    myConnection = require('express-myconnection'),
    bodyParser = require('body-parser'),
    // sassMiddleware = require('node-sass-middleware'),
    // postcssMiddleware = require('postcss-middleware'),
    autoprefixer = require('autoprefixer'),
    session = require('express-session');

const fs = require('fs');
const exec = require('child_process').exec;

var tmplName = require('./lib/template-name'),
    stats = require('./lib/stats'),
    summary = require('./lib/summary'),
    products = require('./lib/products'),
    categories = require('./lib/categories'),
    suppliers = require('./lib/suppliers'),
    sales = require('./lib/sales'),
    purchases = require('./lib/purchases'),
    helpers = require('./lib/helpers'),
    chart = require('./lib/chartMethods');


var loginMethod = require('./lib/loginMethods'),
    signup = require('./lib/signup'),
    authenticate = require('./lib/authenticate'),
    users = require('./lib/userMethods');

var ConnectionProvider = require('./routes/connectionProvider');

var UserDataService = require('./data-services/userDataService'),
    PurchasesDataService = require('./data-services/purchasesDataService'),
    SalesDataService = require('./data-services/salesDataService'),
    ProductDataService = require('./data-services/productDataService'),
    CategoryDataService = require('./data-services/categoryDataService'),
    ChartDataService = require('./data-services/graphDataService');
    // ProductServicePromise = require('./data-services/productServicePromise');

var app = express();

var dbOptions = {
    host: 'localhost',
    user: 'root',
    password: '1amdan13l',
    port: 3306,
    database: 'nelisa_another_copy'
};

var dataServiceSetup = function(connection) {
	return {
		userDataService: new UserDataService(connection),
		purchasesDataService: new PurchasesDataService(connection),
		salesDataService: new SalesDataService(connection),
		productDataService: new ProductDataService(connection),
		categoryDataService: new CategoryDataService(connection),
		chartDataService: new ChartDataService(connection)
		// productServicePromise: new ProductServicePromise(connection)
	};
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
              },
              negValRowHL: function(string) {
                return string.match(/-/) ? "rgba(185,46,16,0.5)" : 'rgba(64,64,64,0.5)';
              }
  }
});

app.engine('handlebars', hbs.engine);

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, "views"));

// app.use('/css', sassMiddleware({
//     src: path.join(__dirname, 'public', 'sass'),
//     dest: path.join(__dirname, 'public', 'css'),
//     debug: true,
//     outputStyle: 'expanded',
//     // prefix:  '/css'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
// }));

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
app.use(bodyParser.json());

app.use(session({secret: "pizzadough", /*cookie: {maxAge: 600000},*/ resave:true, saveUninitialized: false}));

app.use(authenticate);

app.get('/', function (req, res) {
  res.redirect("/home");
});

app.get('/home', loginMethod.home);

app.get('/about', function (req, res){
  res.render("about");
});

app.get('/login',loginMethod.loginDialogue);
app.post('/login/check',loginMethod.verifyAndLogIn);

app.get('/signup', signup.home);
app.post('/signup', signup.checkUser, signup.addUser);

app.get('/admin', loginMethod.home);

app.get('/user', loginMethod.home);

app.get('/logout', loginMethod.signout);

app.get('/stats', stats.home);
app.post('/stats/:type', stats.redirect);
app.get('/stats/:type/:month/:week',  stats.show);
app.get('/stats/weeks/:month', stats.getWeeks);
// app.get('/stats/:type', stats.show);

app.get('/summary', summary.home);
app.post('/summary/table', summary.redirect);
app.get('/summary/table/:type/:month/:week', summary.show);
app.get('/summary/weeks/:month', stats.getWeeks);

// app.get('/summary/table', summary.show);


app.get('/products', products.show);
app.get('/products/filter/:searchBy/:search', products.search);
app.post('/products/search', products.search);
app.get('/products/search/filter/:searchBy/:search', products.search);
app.get('/products/add', products.showAddPage);
app.post('/products', products.add);
// app.get('/products/edit', products.get);
app.get('/products/edit/:id', products.get);
app.post('/products/update', products.update);
// app.get('/products/delete', products.delete);
app.get('/products/delete/:id', products.delete);

app.get('/categories', categories.show);
app.get('/categories/filter/:searchBy/:search', categories.search);
app.post('/categories/search', categories.search);
app.get('/categories/search/filter/:searchBy/:search', categories.search);
app.get('/categories/add', categories.showAddPage);
app.post('/categories/add', categories.add);
app.get('/categories/edit/:id', categories.get);
app.post('/categories/update', categories.update);
app.get('/categories/delete/:id', categories.delete);

app.get('/suppliers', suppliers.show);
app.get('/suppliers/add', suppliers.showAddPage);
app.post('/suppliers', suppliers.add);
app.get('/suppliers/edit/:id', suppliers.get);
app.post('/suppliers/update', suppliers.update);
app.get('/suppliers/delete/:id', suppliers.delete);

app.get('/sales', sales.home);
app.get('/sales/filter/:searchBy/:search', sales.search);
app.post('/sales/search', sales.search);
app.get('/sales/search/filter/:searchBy/:search', sales.search);
app.get('/sales/add', sales.showAddPage);
app.post('/sales/add/execute', sales.add);

app.get('/purchases', purchases.show);
app.get('/purchases/filter/:searchBy/:search', purchases.search);
app.post('/purchases/search', purchases.search);
app.get('/purchases/search/filter/:searchBy/:search', purchases.search);
app.get('/purchases/add', purchases.showAddPage);
app.post('/purchases/add/execute', purchases.add);

app.get('/users', users.show);
app.get('/users/add', users.addHome);
app.post('/users/add/update', users.addCheck, users.add);
app.get('/users/edit/:id', users.edit);
app.post('/users/delete', users.delete);
app.post('/users/edit/update', users.update);

app.post('/graphs/data', chart.getGraphData);
app.get('/graphs/available-dates', chart.getAvailableDates);

app.get('/graphs', chart.home);



//USING PARAMETERS FOR DYNAMIC GRAPH SELECTION
// app.get('/graphs/data/:month/:week', function(req, res,next){
//   var data;
        //  var month = req.params.month,
        //      week = req.params.week;
//   req.getConnection(function(err,connection){
//     connection.query('SELECT s.id id, s.product_id p_id, p.description description, s.quantity quantity FROM sales_details s, products p WHERE s.product_id=p.id && monthName(s.date) = ?, s.week = ?ORDER BY s.id',[month,week] ,function(err, result){
//       if (err) return next(err);
//       data = {data: result};
//       // res.send(JSON.stringify(data));
//       //   console.log("Sent data");
//       fs.writeFile('./public/data/sales.json', JSON.stringify(data), function(err){
//         if (err) return next (err);
//         console.log("Data written to file");
//         res.redirect('/graphs');
//       });
//       });
//   });
// });

app.get('/admin/dashboard', function(req,res){
  res.render('admin_home',{layout: 'admin'});
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
