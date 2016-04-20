# NOTE: RUN $ mysql --local-infile -u <user> -p BEFORE EXECUTING THIS SCRIPT
DROP DATABASE IF EXISTS nelisa_another_copy;
CREATE DATABASE nelisa_another_copy;
#CREATE USER user@localhost IDENTIFIED BY 'password';
#GRANT ALL PRIVILEGES ON nelisa_another_copy.* TO r@localhost;
#FLUSH PRIVILEGES;

USE nelisa_another_copy;

CREATE TABLE categories(
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  description VARCHAR(30) NOT NULL
);

LOAD DATA LOCAL INFILE './data/products/categories.csv' INTO TABLE categories
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
(description);

CREATE TABLE products(
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  description VARCHAR(30) NOT NULL,
  category_id INT,
  inventory_remaining INT,
  CONSTRAINT products_category_id FOREIGN KEY (category_id) REFERENCES categories(id)
  ON UPDATE CASCADE
  ON DELETE SET NULL
);

LOAD DATA LOCAL INFILE './data/products/products.csv' INTO TABLE products
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(description,@category)
SET category_id = (SELECT id FROM categories WHERE description = @category);

CREATE TABLE sales(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    day VARCHAR(9),
    week INT,
    date DATE,
    product_id INT,
    category_id INT,
    quantity INT,
    price DECIMAL(9,2),
    CONSTRAINT sales_product_id FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
    CONSTRAINT sales_category_id FOREIGN KEY (category_id) REFERENCES categories(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
    );

LOAD DATA LOCAL INFILE './data/sales/all_initial_sales.csv' INTO TABLE sales
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(@day, @date, @product, quantity, price)
SET date = @date,
    day = weekday(@date),
    week = CASE WHEN dayofmonth(@date)%7!=0 THEN floor(dayofmonth(@date)/7)+1 ELSE floor(dayofmonth(@date)/7) END,
    category_id = (SELECT category_id FROM products WHERE description = @product),
    product_id = (SELECT id FROM products WHERE description = @product);

CREATE TABLE suppliers(
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  name VARCHAR(30)
);

LOAD DATA LOCAL INFILE './data/suppliers/suppliers.csv' INTO TABLE suppliers
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
(name);

CREATE TABLE purchases(
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  date DATE,
  supplier VARCHAR(30),
  supplier_id INT,
  product_id INT,
  category_id INT,
  quantity INT,
  remaining INT,
  costea DECIMAL(9,2),
  CONSTRAINT purchases_product_id FOREIGN KEY (product_id) REFERENCES products(id)
  ON UPDATE CASCADE
  ON DELETE SET NULL,
  CONSTRAINT purchases_category_id FOREIGN KEY (category_id) REFERENCES categories(id)
  ON UPDATE CASCADE
  ON DELETE SET NULL,
  CONSTRAINT purchases_supplier_id FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
  ON UPDATE CASCADE
  ON DELETE SET NULL
);

LOAD DATA LOCAL INFILE './data/purchases/purchases.csv' INTO TABLE purchases
FIELDS TERMINATED BY ';'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(@supplier,date,@product,@quantity,costea)
SET supplier = @supplier,
    supplier_id = (SELECT id FROM suppliers WHERE name = @supplier),
    product_id = (SELECT id FROM products WHERE description = @product),
    category_id = (SELECT category_id FROM products WHERE description = @product),
    quantity = @quantity,
    remaining = @quantity;

CREATE TABLE inventory_log(
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  action VARCHAR(20),
  action_id INT,
  product_id INT,
  date DATE,
  quantity INT,
  inv_bef_action INT,
  inv_aft_action INT,
  cant_sell INT
);

DELIMITER $$
CREATE TRIGGER invlog_add_sale
BEFORE INSERT ON sales FOR EACH ROW
BEGIN
  DECLARE date DATE;
  DECLARE sale_id INT;
  DECLARE product_id INT;
  DECLARE quantity INT;
  DECLARE inv_bef_sale INT;
  DECLARE inv_aft_sale INT;

  IF (new.date = CURDATE())
  THEN
  SET @date := new.date;
  SET @sale_id := new.id;
  SET @quantity := new.quantity;
  SET @product_id := new.product_id;
  SET @inv_bef_sale := (SELECT remaining FROM inventory WHERE product_id = @product_id);
  SET @inv_aft_sale := @inv_bef_sale - @quantity;

  INSERT INTO inventory_log (date, action, action_id, product_id, quantity, inv_bef_action, inv_aft_action)
  VALUES (@date, 'sale', @sale_id , @product_id, @inv_bef_sale, @inv_aft_sale);
  END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER invlog_add_purchase
BEFORE INSERT ON purchases FOR EACH ROW
BEGIN
  DECLARE date DATE;
  DECLARE purchase_id INT;
  DECLARE product_id INT;
  DECLARE quantity INT;
  DECLARE inv_bef_purchase INT;
  DECLARE inv_aft_purchase INT;

  IF (new.date = CURDATE())
  THEN
  SET @date := new.date;
  SET @purchase_id := new.id;
  SET @quantity := new.quantity;
  SET @product_id := new.product_id;
  SET @inv_bef_purchase := (SELECT remaining FROM inventory WHERE product_id = @product_id);
  SET @inv_aft_purchase := @inv_bef_purchase+@quantity;

  INSERT INTO inventory_log (date, action, action_id, product_id, quantity, inv_bef_action, inv_aft_action)
  VALUES (@date, 'purchase', @purchase_id , @quantity, @product_id, @inv_bef_purchase, @inv_aft_purchase);
  END IF;
END$$
DELIMITER ;
#NOW RUN THE 'onceoff_db.js' FILE.

#==================================================================================================
