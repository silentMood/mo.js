(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(expression) {
	if(!expression) {
		error = new Error("assert failed");
		throw error;
	}
};
},{}],2:[function(require,module,exports){
var config = require('./config');
var assert = require('./assert');
var Scene = require('./scene');
var Directive = require('./directive');

var sceneIdentifier = 'scene';

function linkDirectives(el, scene) {
	assert(el !== null);
	assert(scene !== null);

	attrs = el.attributes;
	for(var i = 0; i < attrs.length; i++) {
		attr = attrs.item(i);
		if(attr.nodeName.match(config.prefix)) {
			dir = new Directive({
				dirName: attr.nodeName.replace(config.prefix, ''),
				expression: attr.value,
				el: el
			});
			//confirm the relationship
			scene.childs.push(dir);
			dir.parent = scene;
		}
	}
}

function compileDirectives(el, scene) {
	assert(el !== null);
	assert(scene !== null);

	scene.$emit('BeginRegisterDirectives');
	$nodes = [el];
	while($nodes.length) {
		$el = $nodes[0];
		linkDirectives($el, scene);
		
		$childNodes = $el.childNodes;
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
	scene.$emit('EndRegisterDirectives');
}

function compileScenes(el, root) {
	assert(el !== null);

	attrs = el.attributes;
	for(var i = 0; i < attrs.length; i++) {
		attr = attrs.item(i);
		scene = new Scene({sceneId: attr.value, el: el});
		//confirm the relationship
		root.childs.push(scene);
		scene.parent = root;

		compileDirectives(el, scene);
	}
}

function compile(el, root) {
	assert(el !== null);
	//first need to be refactored
	$scenes = el.querySelectorAll('.scene');
	for(var i = 0; i < $scenes.length; i++) {
		compileScenes($scenes[i], root);
	}
}

module.exports = {
	$compile: compile
};
},{"./assert":1,"./config":3,"./directive":4,"./scene":10}],3:[function(require,module,exports){
module.exports = {
	prefix: 'd-',
	forceEndTime: 500
};
},{}],4:[function(require,module,exports){
var _ = require('./utils');
var config = require('./config');
var event = require('./event');
var directives = require('./directives/index');

function linkDirective(expression) {
	Dir = directives[this.dirName];
	if(Dir) {
		Dir.bind(this)(expression);
	}
	else {
		var err = new Error('can not recognise' + this.dirName + 'directive');
		throw err;
	}
}

function Directive(opts) {
	assert(opts.expression !== null);
	assert(opts.scene !== null);
	assert(opts.el !== null);

	self = this;

	self.dirName = opts.dirName;
	self.el = opts.el;
	self.parent = opts.scene;
	self.expression = opts.expression;

	linkDirective.bind(this)(self.expression);
}

Directive.prototype = _.extend(event, {});

module.exports = Directive;
},{"./config":3,"./directives/index":5,"./event":8,"./utils":11}],5:[function(require,module,exports){
var transition = require('./transition');
var stage = require('./stage');

module.exports = _.extend(transition, stage);
},{"./stage":6,"./transition":7}],6:[function(require,module,exports){
var assert = require('../assert');
var config = require('../config');

function stage(expression) {
	self = this;

	self.$on('SceneSwitch', function(opts) {
		//todo insertNewScene	

	});
}

module.exports = {
	stage: stage
};
},{"../assert":1,"../config":3}],7:[function(require,module,exports){
var config = require('../config');
var _ = require('../utils');

EnterTransMap = {};

LeftTransMap = {};

AnimationController = function(expression) {
  self = this;
  //trigger all the animation event
  function triggerTransition(transitionMap, cb) {
    var keys = Object.keys(transitionMap).sort();
    if (!keys.length) return cb();

    var forced = false;
    var timeout = setTimeout(function() {
      forced = true && cb();
    }, config.forceEndTime);

    var idx = 0;
    function go(key) {
      //end design
      if (idx > keys.length) {
        if (forced) return;
        clearTimeout(timeout);
        return cb();
      }

      var transitionendNums = 0;
      transitionMap[key].forEach(function(elem) {
        var called, handleEvent;
        setTimeout(function() {
          _.addClass(elem.el, elem.transEffect);
        }, 0);
        
        cb = function() {
          if (called) return;
          called = true;

          transitionendNums++;
          if (transitionendNums === transitionMap[key].length) {
            if (idx <= keys.length) {
              return go(keys[idx++]);
            }
          }
        };

        var called = false;
        setTimeout(cb, config.forceEndTime);

        elem.el.addEventListener("transitionend", function(e) {
          e.stopPropagation();
          cb();
        });
      });
    };
    go(keys[idx++]);
  };

  self.$on("TriggerAllElementsEnterTransition", function() {
    triggerTransition(EnterTransMap, function() {
      return self.$dispatch("AllElementsEnterTransitionEnd");
    });
  });
  self.$on("TriggerAllElementsLeftTransition", function() {
    triggerTransition(LeftTransMap, function() {
      return self.$dispatch("AllElementsLeftTransitionEnd");
    });
  });
  self.$on("ClearAllElementsEnterTransition", function() {
    return EnterTransMap = {};
  });
  self.$on("ClearAllElementsLeftTransition", function() {
    return LeftTransMap = {};
  });
}

EnterAnimation = function(expression) {
  var priority, transEffect;
  priority = expression.split("/")[0];
  transEffect = expression.split("/")[1];
  if (!EnterTransMap[priority]) {
    EnterTransMap[priority] = [];
  }
  EnterTransMap[priority].push({
    el: this.el,
    transEffect: transEffect
  });
}

LeftAnimation = function(expression) {
  var priority, transEffect;
  priority = expression.split("/")[0];
  transEffect = expression.split("/")[1];
  if (!LeftTransMap[priority]) {
    LeftTransMap[priority] = [];
  }
  LeftTransMap[priority].push({
    el: this.el,
    transEffect: transEffect
  });
}

module.exports = {
  enteranimation: EnterAnimation,
  leftanimation: LeftAnimation,
  animationcontroller: AnimationController
}
},{"../config":3,"../utils":11}],8:[function(require,module,exports){
assert = require('./assert');

module.exports = {
	events: {},
	$on: function(event, fn, context) {
		assert(typeof event === 'string');
		assert(typeof fn === 'function');

		if(!this.events) {
			this.events = {};
		}
		if(!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(fn.bind(context));
	},
	$emit: function(event, info) {
		fns = this.events[event];
		if (fns && fns instanceof Array) {
			fns.forEach(function(fn, idx) {
				fn(info);
			});
		}
	},
	$dispatch: function(event, info) {
		var parent = null;
		var scope = this;
		while(parent = scope.parent) {
			parent.$emit(event, info);
		}
	},
	$broadcast: function(event, info) {
		var childs = null;
		var scope = this;
		while(childs = scope.childs) {
			for(var i = 0; i < childs.length; i++) {
				childs[i].$emit(event, info);
			}
		}
	}
}
},{"./assert":1}],9:[function(require,module,exports){
var X = require('./x');

window.X = X;
},{"./x":12}],10:[function(require,module,exports){
_ = require('./utils');
event = require('./event');

baseId = 0;
function generateSceneId() {
	return baseId++;
}

function Scene(opts) {
	self = this;
	self.id = opts.sceneId ? opts.sceneId : generateSceneId();
	self.el = opts.el;

	self.childs = [];
	self.next = null;

	self.states = {
		canLeft: false
	};

	self.$on('EndRegisterDirectives', function() {
		self.$emit('TriggerAllElementsEnterTransition');
	});

	self.$on('AllElementsEnterTransitionEnd', function() {
		self.states.canLeft = true;
	});

	self.$on('AllElementsLeftTransitionEnd', function() {
		router.navigate(self.next);
	});
}

Scene.prototype = _.extend(event, {
	$goto: function(sceneId) {
		this.next = sceneId;
		this.$emit("TriggerAllElementsLeftTransition");
	},
});

module.exports = Scene;
},{"./event":8,"./utils":11}],11:[function(require,module,exports){
module.exports = {
	extend: function(s, ss) {
		var res = {};
		var args = Array.prototype.slice.call(arguments);
		args.forEach(function(arg) {
			Object.keys(arg).forEach(function(key) {
				res[key] = arg[key];
			});
		});
		return res;
	},
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
	}
}
},{}],12:[function(require,module,exports){
var assert = require('./assert');
var _ = require('./utils');
var event = require('./event');
var compiler = require('./compile');

function X(opts) {
	var el = null;
	if(opts && opts.elId) {
		el = document.querySelector('#' + opts.elId);
	}
	else {
		el = document.body;
	}
	console.log(el);

	this.el = el;
	this.childs = [];
	compiler.$compile(this.el, this);
}

X.prototype = _.extend(event, {
	$redirect: function(sceneId) {
		this.$emit("TriggerAllElementsLeftTransition");
	},
});

module.exports = X;
},{"./assert":1,"./compile":2,"./event":8,"./utils":11}]},{},[9])