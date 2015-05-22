module.exports = function(expression) {
	if(!expression) {
		var error = new Error("assert failed");
		throw error;
	}
};