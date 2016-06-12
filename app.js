'use strict';

var express = require('express'),
    exphbs = require('express-handlebars'),
    path = require('path'),
    mysql = require('mysql'),
    myConnection = require('express-myconnection'),
    bodyParser = require('body-parser'),
    sassMiddleware = require('node-sass-middleware'),
    // postcssMiddleware = require('postcss-middleware'),
    autoprefixer = require('autoprefixer'),
    session = require('express-session');

    const fs = require('fs');
    const exec = require('child_process').exec;

var tmplName = require('./lib/template-name'),
    stats = require('./lib/stats'),
    summary = require('./lib/summary'),
    ProductMethods = require('./lib/products'),
    CategoryMethods = require('./lib/categories'),
    suppliers = require('./lib/suppliers'),
    sales = require('./lib/sales'),
    purchases = require('./lib/purchases'),
    helpers = require('./lib/helpers'),
    UserDataService = require('./data-services/userDataService'),
    PurchasesDataService = require('./data-services/purchasesDataService'),
    SalesDataService = require('./data-services/salesDataService'),
    chart = require('./data-services/graphDataService'),
    loginMethod = require('./lib/loginMethods'),
    signup = require('./lib/signup'),
    authenticate = require('./lib/authenticate'),
    users = require('./lib/userMethods'),
    ConnectionProvider = require('./routes/connectionProvider');

var products = new ProductMethods(),
    categories = new CategoryMethods();


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
		salesDataService: new SalesDataService(connection)
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
app.use(bodyParser.json());
app.use(session({secret: "pizzadough", cookie: {maxAge: 600000}, resave:true, saveUninitialized: false}));
app.use(authenticate);
app.get('/', function (req, res) {
  res.redirect("/home");
});

app.get('/home', loginMethod.home);

app.get('/about', function (req, res){
  res.render("about");
});

app.get('/products', products.show);

app.get('/login',loginMethod.loginDialogue);
app.post('/login/check',loginMethod.verifyAndLogIn);

app.get('/signup', signup.home);
app.post('/signup', signup.checkUser, signup.addUser);

app.get('/admin', loginMethod.home);

app.get('/user', loginMethod.home);

app.get('/logout', function(req,res){
  delete req.session.user;
  delete req.session.context;
  res.redirect('/');
});

app.get('/stats', stats.home);
app.post('/stats/:type', stats.redirect);
app.get('/stats/:type/:month/:week',  stats.show);
// app.get('/stats/:type', stats.show);

app.get('/summary', summary.home);
app.post('/summary/table', summary.redirect);
app.get('/summary/table/:type/:month/:week', summary.show);
// app.get('/summary/table', summary.show);

app.get('/products', products.show);
app.get('/products/add', products.showAdd);
app.post('/products', products.add);
// app.get('/products/edit', products.get);
app.get('/products/edit/:id', products.get);
app.post('/products/update', products.update);
// app.get('/products/delete', products.delete);
app.get('/products/delete/:id', products.delete);

app.get('/categories', categories.show);
app.get('/categories/add', categories.showAdd);
app.post('/categories', categories.add);
app.get('/categories/edit/:id', categories.get);
app.post('/categories/update', categories.update);
app.get('/categories/delete/:id', categories.delete);

app.get('/suppliers', suppliers.show);
app.get('/suppliers/add', suppliers.showAdd);
app.post('/suppliers', suppliers.add);
app.get('/suppliers/edit/:id', suppliers.get);
app.post('/suppliers/update', suppliers.update);
app.get('/suppliers/delete/:id', suppliers.delete);

app.get('/sales', sales.home);
app.get('/sales/filter/:search', sales.search);
app.get('/sales/add', sales.addHome);
app.post('/sales/add/execute', sales.execute);

app.get('/purchases', purchases.home);
app.get('/purchases/filter/:search', purchases.search);
app.get('/purchases/add', purchases.addHome);
app.post('/purchases/add/execute', purchases.execute);

app.get('/users', users.show);
app.post('/users/edit', users.edit);
app.post('/users/delete', users.delete);
app.post('/users/edit/update', users.update);

app.get('/graphs/data', chart.getGraphData);

app.get('/graphs', function(req,res){
  var context = req.session.context;
  context.name = "Daniel";
  context.graph = "Sales by Product";
  res.render('data_home',context);
});



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
