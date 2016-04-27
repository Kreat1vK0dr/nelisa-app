<?php
$username = "root";
$password = "1amdan13l";
$host = "localhost";
$database = "nelisa_another_copy";

// require "config.php";

$connect = mysqli_connect($host, $username, $password) or die("Connection failed.");
mysqli_select_db($connect, $database);

// if (isset($_GET["category"])) {

  // require 'opendb.php';

  // $category = $_GET["category"];
  $category_id = 1;

  $query = "SELECT p.* FROM products p INNER JOIN categories c ON p.category_id=c.id WHERE c.id = '{$category_id}'";

  $data = mysqli_query($connect, $query);

  $products = array();

  while ($row = mysqli_fetch_object($data)) {
    array_push($products, $row);
  }

  echo json_encode($products);

  // require 'closedb.php';
  mysqli_close($connect);
// }
 ?>
