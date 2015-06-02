module.exports = {
	//no need to test
	extend: function() {
		var res = {};
		var args = Array.prototype.slice.call(arguments);
		args.forEach(function(arg) {
			Object.keys(arg).forEach(function(key) {
				res[key] = arg[key];
			});
		});
		return res;
	},
	
	mixin: function(target, source) {
		var keys = Object.keys(source);
		var key;
		for(var idx = 0; idx < keys.length; idx++) {
			key = keys[idx];
			if(target[key]) continue;
			target[key] = source[key];
		}
	}
}