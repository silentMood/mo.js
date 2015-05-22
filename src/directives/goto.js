var config = require('../config');
var _ = require('../utils');

function go(expression) {
	var self = this;
	
	self.parent.$on("AllElementsLeftTransitionEnd", function() {
		self.$dispatch('SceneSwitch', expression);
	});

	self.el.addEventListener('click', function(){
		self.parent.$broadcast("TriggerAllElementsLeftTransition");	
	});
}

module.exports = {
  go: go
}