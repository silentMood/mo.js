var config = require('./config');
var directives = require('./directives/index')

function register(dirname, expression, scene, el) {
	//todo add some assert
	Dir = directives[dirname];
	if(Dir) {
		Dir(expression, scene, el);
	}
	else {
		var err = new Error('can not recognise' + dirname + 'directive');
		throw err;
	}
}

module.exports = {
	$register: register
};