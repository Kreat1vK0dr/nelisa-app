<?PHP

$user_name = "root";
$password = "1amdan13l";
$database = "nelisa_another_copy";
$server = "localhost";

$db_handle = mysql_connect($server, $user_name, $password);

/*
It's just the same as before, except we're returning a value from the mysql_connect function, and putting it into a variable called $db_handle. When we connect to the database, we can use this file handle:

$db_found = mysql_select_db($database, $db_handle);

The resource link identifier (file handle) goes after the name of the database you want to open. You can then use this file handle to refer to your database connection.
*/

$db_handle = mysql_connect($server, $user_name, $password);

$db_found = mysql_select_db($database);

$sql = "SELECT * FROM `products` LIMIT 0, 30 ";

if ($db_found) {

$result = mysql_query($sql);
mysql_query($sql);
print $result;

while ( $db_field = mysql_fetch_assoc($result) ) {

print $db_field['description']."\n";

}

print "Database Found\n";
mysql_close($db_handle);

}
else {

print "Database NOT Found\n";
mysql_close($db_handle);
}


?>
