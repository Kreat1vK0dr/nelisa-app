// var handlebars = require('handlebars');
// $(function () {
// var jsdom = require('jsdom');
// var $ = null;
// jsdom.env('<div></div>', function(err, window) {
//   var $ = require("jquery")(window);
// }
// );

var pageinfo = {title: "What Nelisa Wants"};

//
var tmplScript = $("#pageTitle").html();

var tmpl = Handlebars.compile(tmplScript);

console.log(tmpl(pageinfo));

$('#title').append(tmpl(pageinfo));

// });
