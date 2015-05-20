var compiler = require('./compile');

window.X = {
	bootstrap: function() {
		compiler.$compile();
	}
}