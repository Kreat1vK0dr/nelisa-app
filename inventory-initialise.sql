UPDATE products p INNER JOIN  (SELECT product_id, SUM(remaining) remaining FROM purchases GROUP BY product_id) i ON p.id = i.product_id SET p.inventory = i.remaining;

UPDATE products
SET inventory =
