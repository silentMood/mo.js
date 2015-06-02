module.exports = {
	$dispatch: function(eventName, info) {
		var parent = null;
		var scope = this;
		while(parent = scope.parent) {
			scope = parent;
			scope.$emit(eventName, info);
		}
	},
	$broadcast: function(eventName, info) {
		var scopes = [this];
		while(scopes.length) {
			var scope = scopes[0];
			var childs = scope.childs
			for(var i = 0; i < childs.length; i++) {
				childs[i].$emit(eventName, info);
				scopes.push(childs[i]);
			}
			scopes.shift();
		}
	}
}