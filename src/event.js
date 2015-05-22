assert = require('./assert');

module.exports = {
	events: {},
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
		fns = this.events[event];
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
			parent.$emit(event, info);
		}
	},
	$broadcast: function(event, info) {
		var childs = null;
		var scope = this;
		while(childs = scope.childs) {
			for(var i = 0; i < childs.length; i++) {
				childs[i].$emit(event, info);
			}
		}
	}
}