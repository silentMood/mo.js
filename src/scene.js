_ = require('./utils');
event = require('./event');

function Scene() {
	
}

Scene.prototype = _.extend(event, {
	$status: 0,
	$pushLifeStatus: function() {
		$status++;

		switch ($status) {
			//before attached
			case 1:
				break;
			//attached
			case 2:
				break;
			default:
				break;
		}
	}
});

module.exports = Scene;