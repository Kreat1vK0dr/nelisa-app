exports.get = function(type) {
  switch (type) {
    case "sales-stats" : return "sales-stats";
    case "product" : return "products-summary";
    case "category" : return "categories-summary";
  }
};
