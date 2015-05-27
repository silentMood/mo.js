var config = require('../config');
var _ = require('../utils');

go = {
	// handleClick: function() {
	// 	self.parent.$broadcast("TriggerAllElementsLeftTransition");
	// },
	bind: function(expression) {
		// var self = this;
		// //need refactor
		// self.parent.$on("AllElementsLeftTransitionEnd", function() {
		// 	self.parent.$broadcast('ClearAllElementsEnterTransition');
		// 	self.parent.$broadcast('ClearAllElementsLeftTransition');
		// 	self.$dispatch('SceneSwitch', expression);
		// });

		// self.el.addEventListener('click', self.handleClick);
	},
	unbind: function() {
		// this.el.removeEventListener('click', this.handleClick);
		// this.parent.$off('AllElementsLeftTransitionEnd');
	}
}

module.exports = {
  go: go
}