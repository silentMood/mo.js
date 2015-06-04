assert = require('../assert');

module.exports = {
	$on: function(eventName, fn) {
		assert(typeof eventName === 'string');
		assert(typeof fn === 'function');

		//make sure do have the events
		if(!this.events) {
			this.events = {};
		}
		//make sure do have the event queue
		if(!this.events[eventName]) {
			this.events[eventName] = [];
		}

		for(var idx = 0; idx < this.events[eventName].length; idx++) {
			if(fn === this.events[eventName][idx]) {
				//warn
				return console.warn('same fn should only bind once');
			}
		}
		this.events[eventName].push(fn);
	},
	$once: function(eventName, fn) {
		var self = this;
		
		self.$on(eventName, function() {
			fn();
			self.$off(eventName, arguments.callee);
		});
	},
	$off: function(eventName, fn) {
		assert(typeof eventName === 'string');

		if(!this.events) return;
		if(!!fn) {
			for(var idx = 0; idx < this.events[eventName].length; idx++) {
				if(fn === this.events[eventName][idx]) {
					//remove the bind fn
					this.events[eventName].splice(idx, idx + 1);
					break;
				}
			}
			if(!this.events[eventName].length) this.events[eventName] = null;
		} else {
			//remove all the fn
			this.events[eventName] = null;
		}
	},
	$emit: function(eventName, info) {
		var fns = this.events[eventName];
		if (fns && fns instanceof Array) {
			fns.forEach(function(fn, idx) {
				fn(info);
			});
		}
	}
}