(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(expression) {
	if(!expression) {
		var error = new Error("assert failed");
		throw error;
	}
};
},{}],2:[function(require,module,exports){
var config = require('../config');
var assert = require('../assert');
var Directive = require('../core/directive');
var _ = require('../utils');

var sceneIdentifier = 'scene';

function generateLinkFns(el, scene) {
	assert(scene !== null);

	var linkedAttrNames = [];

	var attrs = el.attributes;
	for(var i = 0; i < attrs.length; i++) {
		var attr = attrs.item(i);
		if(attr.nodeName.match(config.prefix)) {
			var dir = new Directive({
				dirName: attr.nodeName.replace(config.prefix, ''),
				expression: attr.value,
				scene: scene,
				el: el
			});
			//set app data structure, it's better to move inside
			scene.childs.push(dir);
			dir.parent = scene;
			//set the link fns
			scene.fns.push(dir.bind.bind(dir));
			scene.ufns.push(dir.unbind.bind(dir));
			//linkedAttrNames
			linkedAttrNames.push(attr.nodeName);
		}
	}
	//remove the linked attribute
	linkedAttrNames.forEach(function(name) {
		attrs.removeNamedItem(name);
	});
}

function compile(scene) {
	//assert error
	assert(scene !== null);

	var $nodes = [scene.el];
	while($nodes.length) {
		var $el = $nodes[0];
		generateLinkFns($el, scene);
		
		var $childNodes = $el.childNodes;
		if(!$childNodes.length) {
			$nodes.shift();
			continue;
		}
		for(var i = 0; i < $childNodes.length; i++) {
			if($childNodes[i].nodeType != document.TEXT_NODE) {
				$nodes.push($childNodes[i]);
			}
		}
		$nodes.shift();
	}
}

module.exports = {
	$compile: compile
};
},{"../assert":1,"../config":4,"../core/directive":6,"../utils":18}],3:[function(require,module,exports){
var compile = require('./compile');

module.exports = compile;
},{"./compile":2}],4:[function(require,module,exports){
module.exports = {
	prefix: 'd-',
	forceEndTime: 500,
	scenePrefix: 'scene'
};
},{}],5:[function(require,module,exports){
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
			var childs = scope.childs;
			if(scope.childs) {
				for(var i = 0; i < childs.length; i++) {
					childs[i].$emit(eventName, info);
					scopes.push(childs[i]);
				}
			}
			scopes.shift();
		}
	}
}
},{}],6:[function(require,module,exports){
var _ = require('../utils');
var base = require('./base');
var event = require('../core_mixins/event');
var directives = require('../directives/index');

function Directive(opts) {
	assert(opts.expression !== null);
	assert(opts.scene !== null);

	//events container
	this.events = {};
	//directive name
	this.dirName = opts.dirName;
	//directive el
	this.el = opts.el;
	//directive expression
	this.expression = opts.expression;

	//get the link fn and unlink fn
	var dir = directives[this.dirName];
	if(!dir) {
		console.warn('can not recognise ' + this.dirName + ' directive');
		this.bind = function(){};
		this.unbind = function(){};
	}
	else {
		assert(dir.bind !== null);
		assert(dir.unbind !== null);
		_.mixin(this, dir);
	}
}

Directive.prototype = _.extend(event, base);

module.exports = Directive;
},{"../core_mixins/event":9,"../directives/index":12,"../utils":18,"./base":5}],7:[function(require,module,exports){
var _ = require('../utils');
var base = require('./base');
var event = require('../core_mixins/event');
var lifecycle = require('../core_mixins/lifecycle');
var config = require('../config');
var compiler = require('../compiler');

var baseId = 0;
function generateSceneId() {
	return config.scenePrefix + baseId++;
}

function Scene(opts) {
	var self = this;
	//all the events
	self.events = {};
	//all the dirs
	self.childs = self.dirs = [];
	//sceneId
	self.id = opts.sceneId ? opts.sceneId : generateSceneId();
	//all the link and unlink fns
	self.fns = [];
	self.ufns = [];

	//template
	self.tpl = opts.tpl;

	self.$init();
}

//core life cycle
Scene.prototype = _.extend(event, lifecycle, base, {
	$init: function() {
		var self = this;

		self.$on('hook:prepare', function(next) {
			self.$insertEl();
			compiler.$compile(self);
			self.$link()
			next();
		});

		self.$on('hook:ready', function(next){
			self.$runAllFns('hook:readyForDirBehavior', next);
		});

		self.$on('hook:hold', function(next) {
			self.$runAllFns('hook:holdForDirBehavior', next);
		});

		self.$on('hook:left', function(next) {
			self.$unlink();
			self.$removeEl();
			next();
		});
	},
	$link: function() {
		for(var idx = 0; idx < this.fns.length; idx++) {
			this.fns[idx]();
		}
	},
	$unlink: function() {
		for(var idx = 0; idx < this.ufns.length; idx++) {
			this.ufns[idx]();
		}
	},
	$runAllFns: function(eventName, next) {
		var from = 0;
		if(this.events && this.events[eventName]) {
			var to = this.events[eventName].length;
			var cb = function() {
				from++;
				if(from === to) next();
			}
			this.$emit(eventName, cb);
		}
		else {
			next()
		}
	},
	$insertEl: function() {
		//get from template and insert
		var el = document.createElement('div');
		el.innerHTML = this.tpl.innerHTML;
		this.el = el;
		this.parent.el.appendChild(this.el);
	},
	$removeEl: function() {
		this.parent.el.removeChild(this.el);
	},
	$canUnmount: function() {
		return this._status === 3;
	},
	$isInit: function() {
		return this._status === 0;
	}
});

module.exports = Scene;
},{"../compiler":3,"../config":4,"../core_mixins/event":9,"../core_mixins/lifecycle":10,"../utils":18,"./base":5}],8:[function(require,module,exports){
var assert = require('../assert');
var _ = require('../utils');
var base = require('./base');
var event = require('../core_mixins/event');
var compiler = require('../compiler');
var mount = require('../mount');
var Scene = require('./scene');

var router = require('../router');

function generateScenes(root) {
	var tpls = document.querySelectorAll('script[scene]');

	for(var idx = 0; idx < tpls.length; idx++) {
		var tpl = tpls[idx];
		var sceneId = _.getAttrValByName(tpl, 'scene');
		if(root.$isSceneIdAlreadyExist(sceneId)) {
			//warning
			console.warn('can not set the same scene id: ' + sceneId);
			//then ignore this scene
			continue;
		}
		//set app data structure
		var scene = new Scene({tpl: tpl, root: root, sceneId: sceneId});
		scene.parent = root;
		root.childs.push(scene);
	}
}

function X(opts) {
	var self = this;
	//events
	self.events = {};
	//create app data structure
	self.childs = self.scenes = [];

	//set total el
	if(!opts || !opts.elId) {
		//error
		return console.error('please spec the elId for stage');
	}
	self.el = document.querySelector('#' + opts.elId);
	if(!self.el) {
		//error
		return console.error('the el did not exist, please check the elId that you given');
	}

	//generate all the scenes
	generateScenes(self);

	//set the main interface
	var attrs = self.el.attributes;
	for(var i = 0; i < attrs.length; i ++) {
		attr = attrs.item(i);
		if(attr.nodeName.match(/main/i)) {
			self.currentScene = self.$getSceneBySceneId(attr.value);
			break;
		}
	}
	if(!self.currentScene) {
		//error
		return console.error('have not set the main interface yet');
	}

	//config the router and mount the main scene
	router.$config(self);
	router.$route(self.currentScene.id);
}

X.prototype = _.extend(event, base, {
	$isSceneIdAlreadyExist: function(sceneId) {
		return !!this.childs.filter(function(child) {
			return child.id === sceneId;
		}).length;
	},
	$getSceneBySceneId: function(sceneId) {
		return this.childs.filter(function(child) {
			return child.id === sceneId;
		})[0];
	}
});

module.exports = X;
},{"../assert":1,"../compiler":3,"../core_mixins/event":9,"../mount":15,"../router":16,"../utils":18,"./base":5,"./scene":7}],9:[function(require,module,exports){
assert = require('../assert');

module.exports = {
	$on: function(eventName, fn) {
		assert(typeof eventName === 'string');
		assert(typeof fn === 'function');

		//make sure do have the events
		if(!this.events) {
			this.events = {};
		}
		//make sure do have the event queue
		if(!this.events[eventName]) {
			this.events[eventName] = [];
		}

		for(var idx = 0; idx < this.events[eventName].length; idx++) {
			if(fn === this.events[eventName][idx]) {
				//warn
				return console.warn('same fn should only bind once');
			}
		}
		this.events[eventName].push(fn);
	},
	$once: function(eventName, fn) {
		var self = this;
		
		self.$on(eventName, function() {
			fn();
			self.$off(eventName, arguments.callee);
		});
	},
	$off: function(eventName, fn) {
		assert(typeof eventName === 'string');

		if(!this.events) return;
		if(!!fn) {
			for(var idx = 0; idx < this.events[eventName].length; idx++) {
				if(fn === this.events[eventName][idx]) {
					//remove the bind fn
					this.events[eventName].splice(idx, idx + 1);
					break;
				}
			}
			if(!this.events[eventName].length) this.events[eventName] = null;
		} else {
			//remove all the fn
			this.events[eventName] = null;
		}
	},
	$emit: function(eventName, info) {
		var fns = this.events[eventName];
		if (fns && fns instanceof Array) {
			fns.forEach(function(fn, idx) {
				fn(info);
			});
		}
	}
}
},{"../assert":1}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
var router = require('../router');
var _ = require('../utils');

go = {
	handleClick: function() {
		router.$route(this.expression);
	},
	bind: function(expression) {
		this.handleClick = this.handleClick.bind(this);
		this.el.addEventListener('click', this.handleClick);
	},
	unbind: function() {
		this.el.removeEventListener('click', this.handleClick);
	}
}

module.exports = {
  go: go
}
},{"../router":16,"../utils":18}],12:[function(require,module,exports){
var transition = require('./transition');
var go = require('./goto');
var _ = require('../utils');
//directive will hook the scene's life cycle
//so when bind and unbind should be careful so that no need

module.exports = _.extend(transition, go);
},{"../utils":18,"./goto":11,"./transition":13}],13:[function(require,module,exports){
var config = require('../config');
var _ = require('../utils');

var EnterTransMap = {};
var LeftTransMap = {};

AnimationController = {
  handleReady: function(next) {
    var self = this;

    self.triggerTransition(EnterTransMap, next);
  },
  handleHold: function(next) {
    var self = this;

    self.triggerTransition(LeftTransMap, next);
  },
  triggerTransition: function(transitionMap, cb) {
    var self = this;

    var keys = Object.keys(transitionMap).sort();
    if (!keys.length) return cb();
    var idx = 0;
    function go(key) {
      if (idx > keys.length) {
        return cb();
      }
      var transitionendNums = 0;
      transitionMap[key].forEach(function(elem) {
        setTimeout(function() {
          return _.addClass(elem.el, elem.transEffect);
        }, 0);
        var handleEvent = function() {
          transitionendNums++;
          if (transitionendNums === transitionMap[key].length) {
            if (idx <= keys.length) go(keys[idx++]);
          }
        };

        var called = false;
        setTimeout(function() {
          if (called) {
            return;
          }
          called = true;
          handleEvent();
        }, 500);

        elem.el.addEventListener('transitionend', function(e) {
          //once
          elem.el.removeEventListener('transitionend', arguments.callee);

          if (called) {
            return;
          }
          called = true;
          e.stopPropagation();
          return handleEvent();
        });
      });
    };
    return go(keys[idx++]);
  },
  //inject the arguments
  bind: function(expression) {
    //when ready then trigger enter animation
    this.parent.$on('hook:readyForDirBehavior', this.handleReady.bind(this));
    //when hold then trigger left animation
    this.parent.$on('hook:holdForDirBehavior', this.handleHold.bind(this));
  },
  unbind: function() {
    this.parent.$off('hook:readyForDirBehavior');
    this.parent.$off('hook:holdForDirBehavior');
    //reset the map
    EnterTransMap = {};
    LeftTransMap = {};
  }
}

EnterAnimation = {
  //for test
  $detail: function() {
    return {
      enter: EnterTransMap
    }
  },
  bind: function() {
    var priority, transEffect;
    var expression = this.expression;

    priority = expression.split("/")[0];
    transEffect = expression.split("/")[1];
    if (!EnterTransMap[priority]) {
      EnterTransMap[priority] = [];
    }
    EnterTransMap[priority].push({
      el: this.el,
      transEffect: transEffect
    });
  },
  unbind: function() {
    //reset the map
    EnterTransMap = {};
  }
}

LeftAnimation = {
  //for test
  $detail: function() {
    return {
      left: LeftTransMap
    }
  },
  bind: function() {
    var priority, transEffect;
    var expression = this.expression;

    priority = expression.split("/")[0];
    transEffect = expression.split("/")[1];
    if (!LeftTransMap[priority]) {
      LeftTransMap[priority] = [];
    }
    LeftTransMap[priority].push({
      el: this.el,
      transEffect: transEffect
    });
  },
  unbind: function() {
    //reset the map
    LeftTransMap = {};
  }
}

module.exports = {
  //directives
  enteranimation: EnterAnimation,
  leftanimation: LeftAnimation,
  animationcontroller: AnimationController
}
},{"../config":4,"../utils":18}],14:[function(require,module,exports){
window.X = require('./core/x');
},{"./core/x":8}],15:[function(require,module,exports){
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
			return;
		};

		scene.$pushStatus();
	}
}
},{}],16:[function(require,module,exports){
var mount = require('./mount');

module.exports = {
	app: null,
	$config: function(app) {
		this.app = app;
	},
	$route: function(sceneId) {
		var self = this;
		var scene = self.app.$getSceneBySceneId(sceneId);
		if(!scene) {
			//error
			return console.log('the scene you want to redirect does not exist');
		}
		
		if(self.app.currentScene.$isInit()) {
			mount.$mount(self.app.currentScene);
		} else {
			//after old scene unmount finish
			self.app.currentScene.$once('hook:goto', function() {
				//reset the current scene
				self.app.currentScene = scene;
				//mount the new scene
				mount.$mount(self.app.currentScene);
			})
			//unmount the old scene
			mount.$unmount(self.app.currentScene);
		}
	}
}
},{"./mount":15}],17:[function(require,module,exports){
module.exports = {
	hasClass: function (el, className) {
  	return !!el.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'));
	},
	addClass: function (el, className) {
  	if (!this.hasClass(el,className)) el.className += " "+className;
	},
	removeClass: function (el, className) {
	  if (this.hasClass(el,className)) {
	    var reg = new RegExp('(\\s|^)'+className+'(\\s|$)');
	    el.className=el.className.replace(reg,' ');
	  }
	},
	getAttrValByName: function(el, attrName) {
		var attrs = el.attributes;
		for(var i = 0; i < attrs.length; i++) {
			var attr = attrs.item(i);
			if(attr.nodeName.match(attrName)) {
				return attr.value;
			}
		}
	}
}
},{}],18:[function(require,module,exports){
var dom = require('./dom');
var obj = require('./obj');

module.exports = obj.extend(dom, obj);
},{"./dom":17,"./obj":19}],19:[function(require,module,exports){
module.exports = {
	//no need to test
	extend: function() {
		var res = {};
		var args = Array.prototype.slice.call(arguments);
		args.forEach(function(arg) {
			Object.keys(arg).forEach(function(key) {
				res[key] = arg[key];
			});
		});
		return res;
	},
	mixin: function(target, source) {
		var keys = Object.keys(source);
		var key;
		for(var idx = 0; idx < keys.length; idx++) {
			key = keys[idx];
			if(target[key]) continue;
			target[key] = source[key];
		}
	}
}
},{}]},{},[14])