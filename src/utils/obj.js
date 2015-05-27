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
	},
	
	mixin: function(target, source) {
		keys = Object.keys(source);
		for(var idx = 0; idx < keys.length; idx++) {
			var key = keys[idx];
			if(target[key]) {
				continue;
			}
			target[key] = source[key];
		}
	}
}