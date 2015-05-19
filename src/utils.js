module.exports = {
	extend: function(s, ss) {
		var res = {};
		var args = Array.prototype.slice.call(arguments);
		args.forEach(function(arg) {
			Object.keys(arg).forEach(function(key) {
				res[key] = arg[key];
			});
		});
		return res;
	}
}