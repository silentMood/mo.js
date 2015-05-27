var router = require('../router');
var _ = require('../utils');

go = {
	handleClick: function() {
		router.$route(this.expression);
	},
	bind: function(expression) {
		this.handleClick = this.handleClick.bind(this);
		this.el.addEventListener('click', this.handleClick);
	},
	unbind: function() {
		this.el.removeEventListener('click', this.handleClick);
	}
}

module.exports = {
  go: go
}