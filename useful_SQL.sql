#How to view comparison of summed amount across different groups between two different tables.
select * from (
    (select product_id id, SUM(quantity) sumSales FROM sales_details GROUP BY product_id) s left join (select product_id id, SUM(quantity) sumPurchases FROM purchases GROUP BY product_id) p on s.id=p.id
);
