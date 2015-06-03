var mount = require('./mount');

module.exports = {
	app: null,
	$config: function(app) {
		this.app = app;
	},
	$route: function(sceneId) {
		var self = this;
		var scene = self.app.$getSceneBySceneId(sceneId);
		if(!scene) {
			//error
			return console.log('the scene you want to redirect does not exist');
		}
		
		if(self.app.currentScene.$isInit()) {
			mount.$mount(self.app.currentScene);
		} else {
			//after old scene unmount finish
			self.app.currentScene.$once('hook:goto', function() {
				//reset the current scene
				self.app.currentScene = scene;
				//mount the new scene
				mount.$mount(self.app.currentScene);
			})
			//unmount the old scene
			mount.$unmount(self.app.currentScene);
		}
	}
}