exports.getQuery = function(type) {
  switch(type) {
    case "product":  return "SELECT s.week, p.description product, c.description category, SUM(s.quantity) quantity,  SUM(s.cant_sell) cantsell, SUM(s.quantity*s.price) revenue, SUM(s.cost) cost, SUM(s.revenue-s.cost) profit, SUM((s.revenue-s.cost)/s.revenue) profitMargin, SUM(s.inventory) inventory FROM sales s, products p, categories c WHERE monthname(date)= ? AND week= ? AND s.product_id=p.id AND s.category_id=c.id GROUP BY s.product_id ORDER BY product";
    case "category": return "SELECT s.week, c.description category, SUM(s.quantity) quantity,  SUM(s.cant_sell) cantsell, SUM(s.revenue) revenue, SUM(s.cost) cost, SUM(s.profit) profit, s.profit_margin profitMargin, SUM(s.inventory) inventory FROM sales s, categories c WHERE monthname(s.date)= ? AND s.week= ? AND s.category_id=c.id GROUP BY s.category_id ORDER BY s.category_id";
    default:         return null;
  }
};


//THIS WORKS IN MYSQL:
//SELECT s.week, p.description product, c.description category, SUM(s.quantity) quantity, SUM(s.inventory) inventory, SUM(s.profit) profit, s.profit_margin profitMargin, SUM(s.cant_sell) nosell FROM sales s, products p, categories c WHERE monthname(date)='February' AND week=1 AND s.product_id=p.id AND s.category_id=c.id GROUP BY s.product_id ORDER BY product;
