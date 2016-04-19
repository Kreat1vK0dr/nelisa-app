# NOTE: RUN $ mysql --local-infile -u <user> -p BEFORE EXECUTING THIS SCRIPT
DROP DATABASE IF EXISTS nelisa_another_copy;
CREATE DATABASE nelisa_another_copy;
#CREATE USER user@localhost IDENTIFIED BY 'password';
#GRANT ALL PRIVILEGES ON nelisa_another_copy.* TO r@localhost;
#FLUSH PRIVILEGES;

CREATE TABLE categories(
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  description VARCHAR(30) NOT NULL
);

LOAD DATA LOCAL INFILE './data/products/categories.csv' INTO TABLE sales
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
(category);

CREATE TABLE products(
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  description VARCHAR(30) NOT NULL,
  category VARCHAR(30),
  category_id INT,
  CONSTRAINT products_category_id FOREIGN KEY (category_id) REFERENCES categories(id)
  ON UPDATE CASCADE
  ON DELETE SET NULL
);

LOAD DATA LOCAL INFILE './data/products/products.csv' INTO TABLE products
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(description,category);

UPDATE products p
INNER JOIN categories c
ON p.category = c.description
SET p.category_id = c.id;

CREATE TABLE sales(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    day VARCHAR(9),
    week INT,
    date DATE,
    product VARCHAR(30),
    product_id INT,
    category VARCHAR(30),
    category_id INT,
    quantity INT,
    price DECIMAL(9,2),
    CONSTRAINT sales_product_id FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
    CONSTRAINT sales_category_id FOREIGN KEY (category_id) REFERENCES category(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
    );

LOAD DATA LOCAL INFILE './data/sales/all_initial_sales.csv' INTO TABLE sales
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(day, date, product, quantity, price);

UPDATE sales
SET week = CASE WHEN dayofmonth(date)%7!=0 THEN floor(dayofmonth(date)/7)+1 ELSE floor(dayofmonth(date)/7) END;

UPDATE sales s
INNER JOIN products p
ON s.product = p.description
SET s.product_id = p.id;

CREATE TABLE suppliers(
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  name VARCHAR(30)
);

LOAD DATA LOCAL INFILE './data/suppliers/suppliers.csv' INTO TABLE sales
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
(name);


CREATE TABLE purchases(
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  date DATE,
  supplier VARCHAR(30),
  product VARCHAR(30),
  product_id INT,
  quantity INT,
  costea DECIMAL(9,2),
  CONSTRAINT purchases_product_id FOREIGN KEY (product_id) REFERENCES products(id)
  ON UPDATE CASCADE
  ON DELETE SET NULL,
  CONSTRAINT purchases_supplier_id FOREIGN KEY (supplier_id) REFERENCES supplier(id)
  ON UPDATE CASCADE
  ON DELETE SET NULL
);

LOAD DATA LOCAL INFILE './data/purchases/purchases.csv' INTO TABLE sales
FIELDS TERMINATED BY ';'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(supplier,date,product,quantity,costea);

CREATE TABLE inventory(
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  product_id INT,
  category_id INT,
  remaining INT,
  CONSTRAINT inventory_product_id FOREIGN KEY (product_id) REFERENCES products(id)
  ON UPDATE CASCADE
  ON DELETE SET NULL,
  CONSTRAINT inventory_category_id FOREIGN KEY (category_id) REFERENCES category(id)
  ON UPDATE CASCADE
  ON DELETE SET NULL,
);

INSERT INTO inventory (product_id)
SELECT id FROM products;

CREATE TABLE inventory_log(
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  sale_id INT,
  date DATE,
  quantity INT,
  inv_rem_bef_sale INT,
  cant_sell INT,
  inv_rem_aft_sale INT
);

DELIMITER $$
CREATE TRIGGER invlog_bef_add_sale
BEFORE INSERT ON sales
BEGIN
  IF new.date == CURDATE()
  THEN
  SET @date = new.date;
  SET @sale_id = new.id;
  SET @quantity = new.quantity;
  SET @product_id = new.product_id;
  SET @inv_bef_sale = (SELECT remaining FROM inventory WHERE product_id = @product_id);
  SET @inv_aft_sale = CASE WHEN (@inv_bef_sale-@quantity)>=0 THEN @inv_bef_sale-@quantity
                           ELSE 0;
  INSERT INTO inventory_log
  (date, sale_id, product_id, inv_bef_sale, inv_aft_sale)
  VALUES (@date, @sale_id , @product_id, @inv_bef_sale, @inv_aft_sale);
  END IF;
END$$
DELIMITER;

#NOW RUN THE 'onceoff_db.js' FILE.

#==================================================================================================
