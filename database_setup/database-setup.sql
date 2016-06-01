# NOTE: RUN $ mysql --local-infile -u <user> -p BEFORE EXECUTING THIS SCRIPT
DROP DATABASE IF EXISTS nelisa_another_copy;
CREATE DATABASE nelisa_another_copy;
#CREATE USER user@localhost IDENTIFIED BY 'password';
#GRANT ALL PRIVILEGES ON nelisa_another_copy.* TO r@localhost;
#FLUSH PRIVILEGES;

USE nelisa_another_copy;

#CREATE TABLE adminTypes(
#  admin_code INT PRIMARY KEY NOT NULL,
#  description VARCHAR(10) NOT NULL
#);

#INSERT INTO adminTypes
#(admin_code,description)
#VALUES
#(1,'superuser'),(2,'general');

CREATE TABLE users(
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  username VARCHAR(30) NOT NULL,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(10) NOT NULL,
  #admin_role INT NOT NULL,
  admin_role VARCHAR(10),
  date_added DATE,
  last_login DATE
#  CONSTRAINT users_admin_type FOREIGN KEY (admin_type) REFERENCES adminTypes(admin_code)
);

CREATE TABLE adminPass(
  password VARCHAR(100) NOT NULL
);

CREATE TABLE categories(
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  description VARCHAR(30) NOT NULL
);

LOAD DATA LOCAL INFILE '../data/products/categories.csv' INTO TABLE categories
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
(description);

CREATE TABLE products(
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  description VARCHAR(30) NOT NULL,
  category_id INT,
  price DECIMAL(9,2) NOT NULL,
  inventory INT,
  CONSTRAINT products_category_id FOREIGN KEY (category_id) REFERENCES categories(id)
);

LOAD DATA LOCAL INFILE '../data/products/products.csv' INTO TABLE products
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(description,@category, price)
SET category_id = (SELECT id FROM categories WHERE description = @category);

CREATE TABLE sales (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    day INT,
    week INT,
    date DATE NOT NULL,
    product_id INT NOT NULL,
    category_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(9,2) NOT NULL,
    cost DECIMAL(9,2) COMMENT "Cost of Sales",
    cant_sell INT COMMENT ">0 if quantity of attempted sale greater than inventory remaining",
    CONSTRAINT sales_product_id FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT sales_category_id FOREIGN KEY (category_id) REFERENCES categories(id)
    );

LOAD DATA LOCAL INFILE '../data/sales/all_initial_sales.csv' INTO TABLE sales
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(@day, @date, @product, quantity, price)
SET date = @date,
    day = weekday(@date),
    week = CASE WHEN dayofmonth(@date)%7!=0 THEN floor(dayofmonth(@date)/7)+1 ELSE floor(dayofmonth(@date)/7) END,
    category_id = (SELECT category_id FROM products WHERE description = @product),
    product_id = (SELECT id FROM products WHERE description = @product);

DELETE FROM sales WHERE quantity = 0;

CREATE TABLE suppliers(
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  name VARCHAR(30)
);

LOAD DATA LOCAL INFILE '../data/suppliers/suppliers.csv' INTO TABLE suppliers
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
(name);

CREATE TABLE purchases(
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  date DATE NOT NULL,
  supplier_id INT NOT NULL,
  product_id INT NOT NULL,
  category_id INT NOT NULL,
  quantity INT NOT NULL,
  remaining INT NOT NULL,
  unitcost DECIMAL(9,2),
  CONSTRAINT purchases_product_id FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT purchases_category_id FOREIGN KEY (category_id) REFERENCES categories(id),
  CONSTRAINT purchases_supplier_id FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

LOAD DATA LOCAL INFILE '../data/purchases/purchases.csv' INTO TABLE purchases
FIELDS TERMINATED BY ';'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(@supplier,date,@product,@quantity,unitcost)
SET supplier_id = (SELECT id FROM suppliers WHERE name = @supplier),
    product_id = (SELECT id FROM products WHERE description = @product),
    category_id = (SELECT category_id FROM products WHERE description = @product),
    quantity = @quantity,
    remaining = @quantity;

CREATE TABLE inventory_log(
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  date DATE NOT NULL,
  action VARCHAR(20) NOT NULL,
  action_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  inv_bef_action INT NOT NULL,
  inv_aft_action INT NOT NULL,
  cant_sell INT
);


#NOW RUN THE 'onceoff_db.js' FILE.

#==================================================================================================
