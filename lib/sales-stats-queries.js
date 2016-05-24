exports.getQueryForSMS = function(stat){
  switch (stat) {
    case "mPopProd":    return "SELECT s.week, p.description name, SUM(s.quantity) quantity FROM sales_details s, products p WHERE monthname(s.date)= ? AND week= ? ? AND s.product_id=p.id GROUP BY s.product_id ORDER BY quantity DESC LIMIT 1";
    case "lPopProd":    return "SELECT s.week, p.description name, SUM(s.quantity) quantity FROM sales_details s, products p WHERE monthname(s.date)= ? AND week= ? ? AND s.product_id=p.id GROUP BY s.product_id ORDER BY quantity ASC LIMIT 1";
    case "mProfProd":   return "SELECT s.week, p.description name, SUM((s.quantity*s.price)-s.cost) profit FROM sales_details s, products p WHERE monthname(s.date)= ? AND week= ? ? AND s.product_id=p.id GROUP BY s.product_id ORDER BY profit DESC LIMIT 1";
    case "lProfProd":   return "SELECT s.week, p.description name, SUM((s.quantity*s.price)-s.cost) profit FROM sales_details s, products p WHERE monthname(s.date)= ? AND week= ? ? AND s.product_id=p.id GROUP BY s.product_id ORDER BY profit ASC LIMIT 1";
    case "mPopCat":     return "SELECT s.week, c.description name, SUM(s.quantity) quantity FROM sales_details s, categories c WHERE monthname(s.date)= ? AND week= ? ? AND s.category_id=c.id GROUP BY s.category_id ORDER BY quantity DESC LIMIT 1";
    case "lPopCat":     return "SELECT s.week, c.description name, SUM(s.quantity) quantity FROM sales_details s, categories c WHERE monthname(s.date)= ? AND week= ? ? AND s.category_id=c.id GROUP BY s.category_id ORDER BY quantity ASC LIMIT 1";
    case "mProfCat":    return "SELECT s.week, c.description name, SUM((s.quantity*s.price)-s.cost) profit FROM sales_details s, categories c WHERE monthname(s.date)= ? AND week= ? ? AND s.category_id=c.id GROUP BY s.category_id ORDER BY profit DESC LIMIT 1";
    case "lProfCat":    return "SELECT s.week, c.description name, SUM((s.quantity*s.price)-s.cost) profit FROM sales_details s, categories c WHERE monthname(s.date)= ? AND week= ? ? AND s.category_id=c.id GROUP BY s.category_id ORDER BY profit ASC LIMIT 1";
    default:            return null;
  }
};

exports.getQueryForTable = function(stat){
  switch (stat) {
    case "mPopProd":    return "SELECT s.week, p.description name, p.id id, SUM(s.quantity) quantity,  SUM(s.quantity*s.price) revenue, SUM(s.cost) cost, SUM((s.quantity*s.price)-s.cost) profit FROM sales_details s, products p WHERE monthname(s.date)= ? AND week= ? AND s.product_id=p.id GROUP BY s.product_id ORDER BY quantity DESC LIMIT 1";
    case "lPopProd":    return "SELECT s.week, p.description name, p.id id, SUM(s.quantity) quantity,  SUM(s.quantity*s.price) revenue, SUM(s.cost) cost, SUM((s.quantity*s.price)-s.cost) profit FROM sales_details s, products p WHERE monthname(s.date)= ? AND week= ? AND s.product_id=p.id GROUP BY s.product_id ORDER BY quantity ASC LIMIT 1";
    case "mProfProd":   return "SELECT s.week, p.description name, p.id id, SUM(s.quantity) quantity,  SUM(s.quantity*s.price) revenue, SUM(s.cost) cost, SUM((s.quantity*s.price)-s.cost) profit FROM sales_details s, products p WHERE monthname(s.date)= ? AND week= ? AND s.product_id=p.id GROUP BY s.product_id ORDER BY profit DESC LIMIT 1";
    case "lProfProd":   return "SELECT s.week, p.description name, p.id id, SUM(s.quantity) quantity,  SUM(s.quantity*s.price) revenue, SUM(s.cost) cost, SUM((s.quantity*s.price)-s.cost) profit FROM sales_details s, products p WHERE monthname(s.date)= ? AND week= ? AND s.product_id=p.id GROUP BY s.product_id ORDER BY profit ASC LIMIT 1";
    case "mPopCat":     return "SELECT s.week, c.description name, c.id id, SUM(s.quantity) quantity,  SUM(s.quantity*s.price) revenue, SUM(s.cost) cost, SUM((s.quantity*s.price)-s.cost) profit FROM sales_details s, categories c WHERE monthname(s.date)= ? AND week= ? AND s.category_id=c.id GROUP BY s.category_id ORDER BY quantity DESC LIMIT 1";
    case "lPopCat":     return "SELECT s.week, c.description name, c.id id, SUM(s.quantity) quantity,  SUM(s.quantity*s.price) revenue, SUM(s.cost) cost, SUM((s.quantity*s.price)-s.cost) profit FROM sales_details s, categories c WHERE monthname(s.date)= ? AND week= ? AND s.category_id=c.id GROUP BY s.category_id ORDER BY quantity ASC LIMIT 1";
    case "mProfCat":    return "SELECT s.week, c.description name, c.id id, SUM(s.quantity) quantity,  SUM(s.quantity*s.price) revenue, SUM(s.cost) cost, SUM((s.quantity*s.price)-s.cost) profit FROM sales_details s, categories c WHERE monthname(s.date)= ? AND week= ? AND s.category_id=c.id GROUP BY s.category_id ORDER BY profit DESC LIMIT 1";
    case "lProfCat":    return "SELECT s.week, c.description name, c.id id, SUM(s.quantity) quantity,  SUM(s.quantity*s.price) revenue, SUM(s.cost) cost, SUM((s.quantity*s.price)-s.cost) profit FROM sales_details s, categories c WHERE monthname(s.date)= ? AND week= ? AND s.category_id=c.id GROUP BY s.category_id ORDER BY profit ASC LIMIT 1";
    default:            return null;
  }
};
