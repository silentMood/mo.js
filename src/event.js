assert = require('./assert');

module.exports = {
	$on: function(event, fn, context) {
		assert(typeof event === 'string');
		assert(typeof fn === 'function');

		if(!this.events) {
			this.events = {};
		}
		if(!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(fn.bind(context));
	},
	$emit: function(event, info) {
		var fns = this.events[event];
		if (fns && fns instanceof Array) {
			fns.forEach(function(fn, idx) {
				fn(info);
			});
		}
	},
	$dispatch: function(event, info) {
		var parent = null;
		var scope = this;
		while(parent = scope.parent) {
			scope = parent;
			scope.$emit(event, info);
		}
	},
	$broadcast: function(event, info) {
		var scopes = [this];
		while(scopes.length) {
			var scope = scopes[0];
			var childs = scope.childs
			for(var i = 0; i < childs.length; i++) {
				childs[i].$emit(event, info);
				scopes.push(childs[i]);
			}
			scopes.shift();
		}
	}
}