var mysql = require('mysql');

module.exports = function (dbParams, servicesSetup) {

    if (!dbParams) throw Error('ATTENTION! Database parameters not supplied.');
        if (!servicesSetup) throw Error('ATTENTION! Service setup callback not supplied');

	this.dbParams = dbParams;
	var pool = mysql.createPool(dbParams);

    this.setupProvider = function(req, res, next){

    	var poolConnection;

    	req.services = function (callback) {

            pool.getConnection(function (err, connection) {
                if (err){
                	return callback(err);
                }
                poolConnection = connection;
                callback(null, servicesSetup(poolConnection));
            });
        };

		var end = res.end;
		res.end = function(data, encoding){
            if (poolConnection){
            	poolConnection.release();
            }
            res.end = end;
            res.end(data, encoding);

		};

    	next();
};


};
