var   mysql = require('mysql'),
      myConnection = require('express-myconnection'),
      bodyParser = require('body-parser');

var sql = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1amdan13l',
  database : 'nelisa_copy'
});

var content,
    sms;
var mProfProd = "SELECT g.week, p.description, MAX(g.quantity) FROM (SELECT week, product_id, quantity FROM sales WHERE monthname(date) = 'February' GROUP BY product_id) g, products p, categories c WHERE g.product_id = p.id AND g.week = 1 ";
SELECT s.*
FROM `Persons` o                    # 'o' from 'oldest person in group'
  LEFT JOIN `Persons` b             # 'b' from 'bigger age'
      ON o.Group = b.Group AND o.Age < b.Age
WHERE b.Age is NULL
var queryProduct =
var queryCategory = "SELECT s.week, c.description, "
sql.connect();
sql.query("SELECT", function(err, result){

});


var smsData = Nelisa.whatSheWants();

function getWeekData(week) {
  switch(week) {
    case 1 : return smsData[0];
    case 2 : return smsData[1];
    case 3 : return smsData[2];
    case 4 : return smsData[3];
    case 5 : return smsData[4];
    default : return null;
  }
}

content = getWeekData(1);

sms = content.week.toUpperCase()+'\nMOST=>>\nPop-P: '+content['most popular product'].product+'\nProf-P: '+content['most profitable product'].product+'\nPop-C: '+content['most popular category'].category+'\nProf-C: '+content['most profitable category'].category+'\nLEAST=>>\nPop-P: '+content['least popular product'].product+'\nProf-P: '+content['least profitable product'].product+'\nPop-C: '+content['least popular category'].category+'\nProf-C: '+content['least profitable category'].category;

exports.content = function(week){
  return sms;
};

// console.log(sms);
