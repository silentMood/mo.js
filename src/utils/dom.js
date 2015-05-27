module.exports = {
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
	}
}