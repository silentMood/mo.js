module.exports = function(expression) {
	if(!expression) {
		error = new Error("assert failed");
		throw error;
	}
};