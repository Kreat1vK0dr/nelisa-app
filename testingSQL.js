var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1amdan13l',
  database : 'events'
});

connection.connect();

// connection.query('SELECT * from potluck', function(err, rows) {
//   if (!err)
//     console.log('The solution is: ', rows);
//   else
//     console.log('Error while performing Query.');
// });
// //
var obj = {NAME: "Daniel", email: "daniel@daniel", food: "oxtail", confirmed: "Y", signup_date: new Date('2016-04-01') };
connection.query('DELETE from potluck WHERE name = ?',"Daniel", function(err, res) {
  if(err) throw err;
  console.log("Rows Affected", res.changedRows);
  console.log("Rows Changed", res.affectedRows);
});
connection.query('INSERT INTO potluck SET ?', obj, function(err,res){
  if(err) throw err;

  console.log('Last insert ID:', res.insertId);
  console.log('Changed Rows:', res.changedRows);
  console.log('Affected Rows:', res.affectedRows);
});

con.query(
  'UPDATE employees SET location = ? Where ID = ?',
  ["South Africa", 5],
  function (err, result) {
    if (err) throw err;

    console.log('Changed ' + result.changedRows + ' rows');
  }
);

// connection.query('SELECT * from potluck', function(err, rows) {
//   if (!err)
//     console.log('The solution is: ', rows);
//   else
//     console.log('Error while performing Query.');
// });
