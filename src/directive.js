var config = require('./config');
var directives = require('./directives/index')

function register(nodeName, expression, scene, el) {
	//todo add some assert
	Dir = directives[nodeName];
	if(Dir) {
		Dir(expression, scene, el);
	}
}

module.exports = {
	$register: register
};