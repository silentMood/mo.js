//this module control lifecycle
module.exports = {
	$mount: function(scene) {	
		//life cycle
		scene.$pushStatus();
	},
	$unmount: function() {
		//life cycle
		scene.$pushStatus();
	}
}