//life cycle control
//this means the scene
module.exports = {
	_status: 0,
	$pushStatus: function(err) {
		if(err) {
			//error
			return console.error(err);
		}
		var next = arguments.callee.bind(this);
		this._status++;
		switch(this._status) {
			case 1:
				this.$emit('hook:prepare', next);
				break;
			case 2:
				this.$emit('hook:ready', next);
				break;
			case 3:
				this.$emit('hook:go');
				break;
			case 4:
				this.$emit('hook:hold', next);
				break;
			case 5:
				this.$emit('hook:left', next);
				break;
			case 6:
				//reset status
				this._status = 0;
				//can go
				this.$emit('hook:goto');
				break;
		}
	},
	$canLeft: function() {
		return this._status === 3;
	}
}