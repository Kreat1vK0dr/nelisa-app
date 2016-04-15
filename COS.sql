SELECT s.sku,

       (MarginPos - SUM(case when s.totalqty < p.cumeqty - p.qty then p.price * p.qty
                             when s.totalqty between p.cumeqty - p.qty and p.qty
                             then s.price * (s.totalqty - (p.cumeqty - p.qty))
                             else 0
                        end)
       ) as Margin

FROM (select s.sku, SUM(price*qty) as MarginPos, SUM(qty) as totalqty FROM sales s) s
LEFT OUTER JOIN (select p.*,
                (select SUM(p.qty) from purchase p2 where p2.sku = p.sku and p2.sale_id <= p.sale_id) as cumeqty
                FROM purchase p)
     on s.sku = p.sku
group by s.sku, MarginPos

SELECT s.product_id,

      
