<?php
if (isset($_GET["category"])) {

  require 'opendb.php';

  $category = $_GET["category"];

  $query = "SELECT * FROM products p INNER JOIN categories c ON p.category_id=c.id WHERE c.id = '{$category_id}'"

  $data = mysqli_query($connection, $query);

  $products = array();

echo $data;
  // while ($row = mysqli_fetch_object($data)) {
  //   array_push($products, $row['name']);
  // }
  //
  // echo json_encode($products);

  require 'closedb.php';
 ?>}
