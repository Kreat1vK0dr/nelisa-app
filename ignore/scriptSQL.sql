CREATE DATABASE nelisa;
CREATE USER user@localhost IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON nelisa.* TO user@localhost;
FLUSH PRIVILEGES;

CREATE DATABASE nelisa;
CREATE USER daniel@localhost IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON nelisa.* TO daniel@localhost;
FLUSH PRIVILEGES;

# BEFORE YOU CAN RUN THIS YOU NEED TO
LOAD DATA LOCAL INFILE '/sales/week2.csv' INTO TABLE nelisa.sales_raw FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n';

--
-- set @date = "2016-01-01";
-- set @week = floor(dayofmonth(@date)/7);
-- select WEEK(@date,1);
-- select dayofmonth(@date);
-- select if(dayofmonth(@date)%7!=0, "is not evenly divisible by 7", floor(dayofmonth(@date)/7) );
-- select if(dayofmonth(@date)%7!=0, @week+1, @week);
-- select week(@date,1);

create table sales_raw(
    day varchar(9) not null,
    date DATE,
    item varchar(30),
    quantity numeric(10,0),
    price numeric(10,2)

);

create table sales(
    id int primary key auto_increment not null,
    day varchar(9),
    date DATE,
    product varchar(30),
    quantity int,
    price decimal(9,2)
    );

    create table purchases(
        id int primary key auto_increment not null,
        supplier varchar(30),
        date DATE,
        product varchar(30),
        quantity int,
        cost decimal(9,2),
        totalcost decimal(9,2)
        );

create table products(
  id int primary key auto_increment not null,
  category_id int not null,
  description varchar(50) not null,
  foreign key (category_id) references categories(id)
);

//for some reason the following DOES NOT WORK. Took the formatting from an example on stackoverflow.

ALTER TABLE sales ADD
revenue decimal(10,2) not null,
cost decimal(10,2) not null,
profit decimal(10,2) not null,
profit_margin decimal(10,2) not null;

//only this repetition works...

ALTER TABLE sales
ADD revenue decimal(10,2) not null,
 ADD cost decimal(10,2) not null,
 ADD profit decimal(10,2) not null,
 ADD profit_margin decimal(10,2) not null;


UPDATE business AS b
INNER JOIN business_geocode AS g ON b.business_id = g.business_id
SET b.mapx = g.latitude,
  b.mapy = g.longitude
WHERE  (b.mapx = '' or b.mapx = 0) and
  g.latitude > 0


// First add the columns
ALTER TABLE sales ADD
product_id int not null,
category_id int not null;
day_id int not null;

//then update values
UPDATE sales
INNER JOIN products ON sales.product = products.description
SET sales.product_id = products.id;

UPDATE sales
INNER JOIN products ON sales.product_id = products.id
SET sales.category_id = products.category_id;



//then add constraint
ALTER TABLE sales ADD
constraint sales_category_id FOREIGN KEY (category_id) REFERENCES categories(id),
constraint sales_product_id FOREIGN KEY (product_id) REFERENCES products(id);


create table categories(
    id int primary key auto_increment not null,
    description varchar(30) not null
);

create table suppliers(
    id int primary key auto_increment not null,
    name varchar(30) not null
    );

ALTER TABLE purchases ADD
supplier_id int not null;
remaining int not null;

UPDATE purchases
set remaining = quantity;

UPDATE purchases
INNER JOIN suppliers ON purchases.supplier = suppliers.name
SET purchases.supplier_id = suppliers.id;

ALTER TABLE purchases ADD
constraint purchases_supplier_id FOREIGN KEY (supplier_id) REFERENCES suppliers(id);

ALTER TABLE purchases ADD
product_id int not null;

UPDATE purchases
INNER JOIN products ON purchases.product = products.description
SET purchases.product_id = products.id;

ALTER TABLE purchases ADD
constraint purchases_product_id FOREIGN KEY (product_id) REFERENCES products(id);

alter table sales add week int AFTER date;
UPDATE sales SET week = CASE WHEN dayofmonth(date)%7!=0 THEN floor(dayofmonth(date)/7)+1 ELSE floor(dayofmonth(date)/7) END;

UPDATE sales SET day_id = WEEKDAY(date);

ALTER TABLE sales ADD
day_name varchar(9) not null;

UPDATE sales SET day_name = dayname(date);


if(dayofmonth(@date)%7!=0, @week+1, @week)

set @date = "2016-04-04";
select week(date,1)%month(date)+1;

SELECT id, value, (value/2) AS calculated FROM mytable

UPDATE mytable SET calculated = value/2;

select s.date "Date", s.week "Week", p.description "Product", c.description "Category", s.quantity "Quantity", s.price "Price"
from sales s, products p, categories c
where s.product_id = p.id and s.category_id = c.id
ORDER BY s.date ASC;

select s.date "Date", p.description "Product", c.description "Category", s.quantity "Quantity", s.price "Price"
from sales s, products p, categories c
where s.product_id = p.id and s.category_id = c.id
ORDER BY s.date ASC;

UPDATE sales SET profit_margin = profit/revenue;

ALTER TABLE sales
ADD inv_rem_bef int not null,
ADD inv_rem_aft int not null;

ALTER TABLE sales
ADD inv_rem int not null;
ADD notsold int not null;

CREATE TABLE inventory(
  id int primary key auto_increment not null,
  product_id int not null,
  available int not null,
  constraint inventory_product_id foreign key (product_id) REFERENCES products(id);
)

DELIMITER //
CREATE FUNCTION inventory (productID, y1 decimal)
RETURNS decimal
DETERMINISTIC
BEGIN
  DECLARE dist decimal;
  SET dist = SQRT(x1 - y1);
  RETURN dist;
END //
DELIMITER ;

UPDATE inventory
SET available = SUM(purchases.quantity) - SUM(sales.quantity) WHERE product_id

SELECT s.*
FROM `Persons` o                    # 'o' from 'oldest person in group'
  LEFT JOIN `Persons` b             # 'b' from 'bigger age'
      ON o.Group = b.Group AND o.Age < b.Age
WHERE b.Age is NULL


#OPTIONS ON HOW TO FIND MAXIMUM
SELECT article, dealer, price
FROM   shop
WHERE  price=(SELECT MAX(price) FROM shop);
#RELATED EXAMPLE (BELOW) DOESN'T WORK IN THIS CONTEXT BECAUSE NO TABLE 's' EXISTS.
SELECT * FROM (SELECT week, product_id, SUM(quantity) as quantity
FROM sales
WHERE monthname(date) = 'February' AND week=1
GROUP BY product_id) s
WHERE s.quantity=(SELECT MAX(s.quantity) FROM s);
#RATHER USE ONE OF THE BELOW EXAMPLES.
SELECT s1.article, s1.dealer, s1.price
FROM shop s1
LEFT JOIN shop s2 ON s1.price < s2.price
WHERE s2.article IS NULL;

SELECT article, dealer, price
FROM shop
ORDER BY price DESC
LIMIT 1;
#RELATED EXAMPLE:
SELECT s.week, s.product_id as id, p.description, SUM(s.quantity) quantity FROM sales s, products p
WHERE
month(s.date)=2 AND week=1 AND s.product_id=p.id
GROUP BY s.product_id
ORDER BY quantity DESC
LIMIT 1
