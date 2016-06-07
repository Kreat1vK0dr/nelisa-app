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
    ProductMethods = require('./lib/products_CRUD'),
    CategoryMethods = require('./lib/categories_CRUD'),
    suppliers = require('./lib/suppliers_CRUD'),
    sales = require('./lib/sales'),
    purchases = require('./lib/purchases'),
    helpers = require('./lib/helpers'),
    UserDataService = require('./data-services/userDataService'),
    chart = require('./data-services/graphDataService'),
    loginMethod = require('./lib/loginMethods'),
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
		userDataService: new UserDataService(connection)
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
app.use(bodyParser.json())
app.use(session({secret: "pizzadough", cookie: {maxAge: 600000}, resave:true, saveUninitialized: false}));

app.get('/', function (req, res) {
  res.redirect("/home");
});

app.get('/home', function (req, res) {
    res.render("home");
});

app.get('/about', function (req, res){
  res.render("about");
});

app.get('/products', products.show);


app.get('/admin',loginMethod.authenticate, loginMethod.adminHome);
app.get('/admin/login',loginMethod.adminDialogue);
app.post('/admin/login/check',loginMethod.verifyAndLogIn);

app.get('/stats', loginMethod.authenticate,stats.home);
app.post('/stats/:type', loginMethod.authenticate,stats.redirect);
app.get('/stats/:type/:month/:week', loginMethod.authenticate, stats.show);
// app.get('/stats/:type', stats.show);

app.get('/summary', loginMethod.authenticate,summary.home);
app.post('/summary/table',loginMethod.authenticate, summary.redirect);
app.get('/summary/table/:type/:month/:week',loginMethod.authenticate, summary.show);
// app.get('/summary/table', summary.show);

app.get('/products', loginMethod.authenticate,products.show);
app.get('/products/add', loginMethod.authenticate,products.showAdd);
app.post('/products',loginMethod.authenticate, products.add);
// app.get('/products/edit', products.get);
app.get('/products/edit/:id',loginMethod.authenticate, products.get);
app.post('/products/update', loginMethod.authenticate,products.update);
// app.get('/products/delete', products.delete);
app.get('/products/delete/:id',loginMethod.authenticate, products.delete);

app.get('/categories', loginMethod.authenticate,categories.show);
app.get('/categories/add',loginMethod.authenticate, categories.showAdd);
app.post('/categories',loginMethod.authenticate, categories.add);
app.get('/categories/edit/:id',loginMethod.authenticate, categories.get);
app.post('/categories/update', loginMethod.authenticate,categories.update);
app.get('/categories/delete/:id',loginMethod.authenticate, categories.delete);

app.get('/suppliers', loginMethod.authenticate,suppliers.show);
app.get('/suppliers/add',loginMethod.authenticate, suppliers.showAdd);
app.post('/suppliers',loginMethod.authenticate, suppliers.add);
app.get('/suppliers/edit/:id', loginMethod.authenticate,suppliers.get);
app.post('/suppliers/update',loginMethod.authenticate, suppliers.update);
app.get('/suppliers/delete/:id',loginMethod.authenticate, suppliers.delete);

app.get('/sales/add',loginMethod.authenticate, sales.addHome);
app.post('/sales/add/execute', loginMethod.authenticate,sales.execute);
app.get('/purchases/add',loginMethod.authenticate, purchases.addHome);
app.post('/purchases/add/execute',loginMethod.authenticate, purchases.execute);

app.get('/users',loginMethod.authenticate, users.show);
app.post('/users/edit',loginMethod.authenticate, users.edit);
app.post('/users/edit/update',loginMethod.authenticate, users.update);

app.get('/graphs/data',loginMethod.authenticate, chart.getGraphData);

app.get('/graphs',loginMethod.authenticate, function(req,res){
  const context = {name: "Daniel", graph: "Sales by Product", layout: "admin"};
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
