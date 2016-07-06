module.exports = function (connection) {

    var getAllData = function (query, cb) {
        connection.query(query, cb);
    };

    var getData = function (query, data, cb) {
        connection.query(query, data, cb);
    };

    var changeData = function (query, data, cb) {
        connection.query(query, data, cb);
    };

    this.getCategory = function (data, cb) {
        getData("SELECT * FROM categories WHERE id = ?", data, cb);
    };

    this.getAllCategories = function (cb) {
        getData("SELECT * FROM categories", cb);
    };

    this.deleteCategory = function (data, cb) {
        changeData("DELETE FROM categories WHERE id = ?", data, cb);
    };

    this.addCategory = function (data, cb) {
        changeData('INSERT INTO categories SET ?', data, cb);
    };

    this.updateCategory = function (data, cb) {
        changeData('UPDATE categories SET description = ? WHERE id = ?', data, cb);
    };

    this.searchCategories = function (data, cb) {
        getData('SELECT id, description  FROM categories WHERE description LIKE ? ORDER BY id', data, cb);
    };

};
