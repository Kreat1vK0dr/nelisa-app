exports.getSQLquery = function(minmax, month, week){
  switch (minmax) {
    case "mPopProd":    return "SELECT s.week, s.product_id as id, p.description name, SUM(s.quantity) quantity FROM sales s, products p WHERE month(s.date)="+month+" AND week="+week+" AND s.product_id=p.id GROUP BY s.product_id ORDER BY quantity DESC LIMIT 1";
    case "lPopProd":    return "SELECT s.week, s.product_id as id, p.description name, SUM(s.quantity) quantity FROM sales s, products p WHERE month(s.date)="+month+" AND week="+week+" AND s.product_id=p.id GROUP BY s.product_id ORDER BY quantity ASC LIMIT 1";
    case "mProfProd":   return "SELECT s.week, s.product_id id, p.description name, SUM(s.profit) profit FROM sales s, products p WHERE month(s.date)="+month+" AND week="+week+" AND s.product_id=p.id GROUP BY s.product_id ORDER BY profit DESC LIMIT 1";
    case "lProfProd":   return "SELECT s.week, s.product_id id, p.description name, SUM(s.profit) profit FROM sales s, products p WHERE month(s.date)="+month+" AND week="+week+" AND s.product_id=p.id GROUP BY s.product_id ORDER BY profit ASC LIMIT 1";
    case "mPopCat":     return "SELECT s.week, s.category_id as id, c.description name, SUM(s.quantity) quantity FROM sales s, categories c WHERE month(s.date)="+month+" AND week="+week+" AND s.category_id=c.id GROUP BY s.category_id ORDER BY quantity DESC LIMIT 1";
    case "lPopCat":     return "SELECT s.week, s.category_id as id, c.description name, SUM(s.quantity) quantity FROM sales s, categories c WHERE month(s.date)="+month+" AND week="+week+" AND s.category_id=c.id GROUP BY s.category_id ORDER BY quantity ASC LIMIT 1";
    case "mProfCat":    return "SELECT s.week, s.category_id id, c.description name, SUM(s.profit) profit FROM sales s, categories c WHERE month(s.date)="+month+" AND week="+week+" AND s.category_id=c.id GROUP BY s.category_id ORDER BY profit DESC LIMIT 1";
    case "lProfCat":    return "SELECT s.week, s.category_id id, c.description name, SUM(s.profit) profit FROM sales s, categories c WHERE month(s.date)="+month+" AND week="+week+" AND s.category_id=c.id GROUP BY s.category_id ORDER BY profit ASC LIMIT 1";
    default:            return null;
  }
};