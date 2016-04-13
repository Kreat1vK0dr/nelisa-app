var mysql = require('mysql'),
    myConnection = require('express-myconnection'),
    express = require('express'),
    minmax = require('minmax-queries');

var connection = mysql.createConnection({
          host     : 'localhost',
          user     : 'root',
          password : '1amdan13l',
          database : 'nelisa_copy'
});

// var minmax = require('./minmax-queries');
var queries = ["mPopProd","lPopProd","mProfProd","lProfProd","mPopCat","lPopCat","mProfCat","lProfCat"];
  }
}

// app.get("/sendSMS", function(req,res){
//   res.render('sms_home');
// });

// app.get("/sendSMS/:month/:week", function(req, res){
//   var month = req.params.month,
//       week = req.params.week;

    var month = 2,
        week = 1;


var configureSMS = function(month, week){
      connection.connect();
      var most = ["MOST=>>"],
          least = ["LEAST=>>"],
          week,
          sms,
          track = queries.length;

      queries.forEach(function(query){
        var sql = minmax.getSQL(query, month, week);
        connection.query(sql, function(err, rows) {
              if (err) throw err;
              var result = rows,
                  text="";
            week = "WEEK"+result[0].week+"\n";
            text += query.toLowerCase().indexOf("pop")!==-1 ? "Pop-" : "Prof-";
            text += query.toLowerCase().indexOf("prod")!==-1 ? "P: "+result[0].name : "C: "+result[0].name;
            if(query[0]==="m"){
              most.push(text);
            } else {
              least.push(text);
            }
            --track;
            if (track===0) {
                connection.end();
                 sms = week+most.concat(least).join("\n");
                 console.log("SMS LENGTH: "+sms.length+" characters.");
                 console.log(sms);
                 return sms;
              }
          });
      });
  };
  //

exports.configureSMS = configureSMS;

// configureSMS(2,1);
