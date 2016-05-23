USE nelisa_another_copy;

UPDATE sales
SET quantity = quantity - cant_sell;

ALTER TABLE sales
DROP cant_sell;

CREATE TABLE sales_details LIKE sales;
INSERT INTO sales_details SELECT * FROM sales;

ALTER TABLE sales_details
ADD sale_id INT AFTER id,
ADD CONSTRAINT details_sale_id FOREIGN KEY (sale_id) REFERENCES sales(id);

UPDATE sales_details
SET sale_id = id;

ALTER TABLE sales
DROP FOREIGN KEY sales_product_id,
DROP FOREIGN KEY sales_category_id,
DROP category_id,
DROP product_id,
ADD unique_products INT AFTER total_quantity,
ADD sum_total decimal(10,2) AFTER unique_products,
CHANGE cost total_cost decimal(10,2) NOT NULL,
CHANGE quantity total_quantity INT NOT NULL;

UPDATE sales
SET unique_products = 1,
    sum_total = price * total_quantity;

ALTER TABLE sales
DROP price;

DELIMITER $$
 DROP PROCEDURE IF EXISTS initialize_inventory$$
 CREATE PROCEDURE initialize_inventory()
 BEGIN
 DECLARE p_id INT;
 SELECT COUNT(id) FROM products INTO @count;
 SET p_id = 1;

 WHILE p_id  <= @count DO
 SELECT remaining FROM purchases WHERE product_id = p_id ORDER BY date DESC LIMIT 1 INTO @remaining;
 UPDATE products
 SET inventory = @remaining
 WHERE id = p_id;
 SET p_id = p_id + 1;
 END WHILE;

 END$$
DELIMITER ;

CALL initialize_inventory();

DELIMITER $$
CREATE TRIGGER invlog_add_sale
BEFORE INSERT ON sales_details FOR EACH ROW
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
  SET @sale_id := new.sale_id;
  SET @quantity := new.quantity;
  SET @product_id := new.product_id;
  SET @inv_bef_sale := (SELECT inventory FROM products WHERE id = @product_id);
  SET @inv_aft_sale := @inv_bef_sale - @quantity;
  INSERT INTO inventory_log (date, action, action_id, product_id, quantity, inv_bef_action, inv_aft_action)
  VALUES (@date, 'SALE', @sale_id , @product_id, @quantity, @inv_bef_sale, @inv_aft_sale);
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
  SET @inv_bef_purchase := (SELECT inventory FROM products WHERE id = @product_id);
  SET @inv_aft_purchase := @inv_bef_purchase+@quantity;

  INSERT INTO inventory_log (date, action, action_id, product_id, quantity, inv_bef_action, inv_aft_action)
  VALUES (@date, 'PURCHASE', @purchase_id ,  @product_id,@quantity, @inv_bef_purchase, @inv_aft_purchase);
  END IF;
END$$
DELIMITER ;
