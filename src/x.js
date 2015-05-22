var assert = require('./assert');
var _ = require('./utils');
var event = require('./event');
var compiler = require('./compile');

function X(opts) {
	var el = null;
	if(opts && opts.elId) {
		el = document.querySelector('#' + opts.elId);
	}
	else {
		el = document.body;
	}

	attrs = el.attributes;
	for(var i = 0; i < attrs.length; i ++) {
		attr = attrs.item(i);
		if(attr.nodeName.match(/mainScene/i)) {
			this.currentView = attr.value;
		}
	}
	if(!this.currentView) {
		this.currentView = 'scene1';
	}

	this.el = el;
	this.childs = this.scenes = [];
	template = document.getElementById(this.currentView).innerHTML;

	this.el.innerHTML = template;
	compiler.$compile(this.el, this);
}

X.prototype = _.extend(event, {});

module.exports = X;