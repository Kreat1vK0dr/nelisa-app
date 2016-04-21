// 'use strict';

var express = require('express'),
    exphbs = require('express-handlebars'),
    path = require('path'),
    mysql = require('mysql'),
    myConnection = require('express-myconnection'),
    bodyParser = require('body-parser'),
    sassMiddleware = require('node-sass-middleware'),
    postcssMiddleware = require('postcss-middleware'),
    autoprefixer = require('autoprefixer');

var tmplName = require('./lib/template-name'),
    stats = require('./lib/stats'),
    summary = require('./lib/summary');
ProductMethods = require('./lib/products_CRUD');
CategoryMethods = require('./lib/categories_CRUD');

var dbOptions = {
    host: 'localhost',
    user: 'root',
    password: '1amdan13l',
    port: 3306,
    database: 'nelisa_another_copy'
};

var app = express();

app.set('port', (process.env.PORT || 5000));

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.use('/css', sassMiddleware({
    src: path.join(__dirname, 'public', 'sass'),
    dest: path.join(__dirname, 'public', 'css'),
    debug: true,
    outputStyle: 'expanded',
    // prefix:  '/css'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

app.use(postcssMiddleware({
    src: function (req) {
        return path.join(req.path);
    },
    plugins: [autoprefixer({
        browsers: ['> 1%', 'IE 7', 'last 2 versions'],
        cascade: false
    })]
}));

app.use(express.static('public'));

//setup middleware
app.use(myConnection(mysql, dbOptions, 'single'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
        extended: false
    }))
    // parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
    app.engine('handlebars', exphbs({
        defaultLayout: 'main'
    }));
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


app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
