assert = require('./assert');

module.exports = {
	$on: function(event, fn, context) {
		assert(typeof event !== 'string');
		assert(typeof fn !== 'function');

		if(!this.events) {
			this.events = {};
		}
		if(!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(fn.bind(context));
	},
	$emit: function(event) {
		fns = this.events[event];
		if (fns && fns instanceof Array) {
			fns.forEach(function(fn, idx) {
				fn();
			});
		}
	}
}