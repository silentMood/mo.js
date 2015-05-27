assert = require('./assert');

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
				return console.log('same fn should only bind once');
			}
		}
		this.events[eventName].push(fn);
	},
	$off: function(eventName, fn) {
		assert(typeof eventName === 'string');

		if(!!fn) {
			for(var idx = 0; idx < this.events[eventName].length; idx++) {
				if(fn === this.events[eventName][idx]) {
					//remove the bind fn
					this.events[eventName].splice(idx, idx + 1);
					break;
				}
			}
		} else {
			//remove all the fn
			this.events[eventName] = []
		}
	},
	$emit: function(eventName, info) {
		var fns = this.events[eventName];
		if (fns && fns instanceof Array) {
			fns.forEach(function(fn, idx) {
				fn(info);
			});
		}
	},
	$dispatch: function(eventName, info) {
		var parent = null;
		var scope = this;
		while(parent = scope.parent) {
			scope = parent;
			scope.$emit(eventName, info);
		}
	},
	$broadcast: function(eventName, info) {
		var scopes = [this];
		while(scopes.length) {
			var scope = scopes[0];
			var childs = scope.childs
			for(var i = 0; i < childs.length; i++) {
				childs[i].$emit(eventName, info);
				scopes.push(childs[i]);
			}
			scopes.shift();
		}
	}
}