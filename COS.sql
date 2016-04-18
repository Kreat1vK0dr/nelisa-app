SELECT s.product_id,

       (MarginPos - SUM(case when s.qty < p.qty - p.qty then p.price * p.qty
                             when s.totalqty between p.cumeqty - p.qty and p.qty
                             then s.price * (s.totalqty - (p.cumeqty - p.qty))
                             else 0
                        end)
       ) as Margin

FROM (select s.sku, SUM(price*qty) as MarginPos, SUM(qty) as totalqty FROM sales s) s
LEFT OUTER JOIN (select p.*,
                (select SUM(p.qty) from purchase p2 where p2.sku = p.sku and p2.sale_id <= p.sale_id) as cumeqty
                FROM purchase p)
     on s.product_id = p.product_id
group by s.sku, MarginPos

SELECT s.*,p.* FROM sales s, purchases p WHERE s.date


select s1.date,
((SELECT SUM(quantity) FROM sales s2 WHERE s1.date>=s2.date AND s1.product_id=1)-(SELECT SUM(quantity) FROM purchases WHERE day(date)<=28 ORDER BY date desc)) inventory_remaining FROM sales s1, purchases p1 WHERE s1.product_id=p1.product_id AND s1.product_id=1 AND day(s1.date)= 28;


# FOR SALES
select date,  ((SELECT SUM(quantity) FROM sales s2 WHERE s1.date>=s2.date AND product_id=1)) sumSales FROM sales s1 WHERE product_id=1 AND day(date)=28;

# FOR PURCHASES
SELECT SUM(quantity) FROM purchases WHERE day(date)<=28 AND product_id=1 ORDER BY date desc;

# COMBINED DOESN'T WORK
(((SELECT SUM(quantity) FROM sales s2 WHERE s1.date>=s2.date AND product_id=1) FROM sales s1 WHERE product_id=1 AND day(date)=28)-(SELECT SUM(quantity) FROM purchases WHERE day(date)<=28 AND product_id=1 ORDER BY date desc));
