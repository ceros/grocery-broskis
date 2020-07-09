module.exports = {
	promisy : function(database, query, parameters) {
		return new Promise(function(resolve, reject) {
			database.query(query, parameters, function (err, data) {
				return err ? reject(err) : resolve(data);
			});
		});
	}
} 
