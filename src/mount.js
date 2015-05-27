//this module control lifecycle
module.exports = {
	$mount: function(scene) {	
		//life cycle
		scene.$pushStatus();
	},
	$unmount: function(scene) {
		//life cycle
		if(!scene.$canUnmount()) {
			//warn
			console.log('can not leave, because the status is not right');
		};

		scene.$pushStatus();
	}
}