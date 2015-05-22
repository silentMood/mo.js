var config = require('../config');
var _ = require('../utils');

function go(expression) {
	self = this;

	self.el.addEventListener('click', function(){
		self.$dispatch('SceneSwitch', expression);
	});
}

module.exports = {
  go: go
}