DROP TABLE IF EXISTS inventory;

CREATE TABLE inventory(
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  product_id INT NOT NULL,
  remaining INT
  -- FOREIGN KEY (product_id) REFERENCES products(id)
  #CONSTRAINT product_id FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO inventory (product_id)
SELECT id FROM products;

SELECT i.id, p.description FROM inventory i, products p WHERE i.product_id = p.id;
