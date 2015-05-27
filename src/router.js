var mount = require('./mount');

module.exports = {
	app: null,
	$config: function(app) {
		this.app = app;
	},
	$route: function(sceneId) {
		var self = this;
		var scene = self.app.scenes[sceneId];
		if(!scene) {
			//error
			return console.log('the scene you want to redirect does not exist');
		}
		//when old scene unmount ok then mount new scene
		self.app.currentScene.$on('hook:goto', function() {
			self.app.currentScene.$off('hook:goto', arguments.callee);
			//reset the current scene
			self.app.currentScene = scene;
			//mount the new scene
			mount.$mount(self.app.currentScene);
		})
		//unmount the old scene
		mount.$unmount(self.app.currentScene);
	}
}