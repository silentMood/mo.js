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
	hasClass: function (el, className) {
  	return !!el.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'));
	},
	addClass: function (el, className) {
  	if (!this.hasClass(el,className)) el.className += " "+className;
	},
	removeClass: function (el, className) {
	  if (this.hasClass(el,className)) {
	    var reg = new RegExp('(\\s|^)'+className+'(\\s|$)');
	    el.className=el.className.replace(reg,' ');
	  }
	},
	getAttrValByName: function(el, attrName) {
		var attrs = el.attributes;
		for(var i = 0; i < attrs.length; i++) {
			var attr = attrs.item(i);
			if(attr.nodeName.match(attrName)) {
				return attr.value;
			}
		}
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