<?php
  require "config.php";

  $connect = mysqli_connect($host, $username, $password) or die("Connection failed.");
  mysqli_select_db($connect, $database);
 ?>
