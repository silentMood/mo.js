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
			//compile directive
			Directive.$register(attr.nodeName.replace(config.prefix, ''), attr.value, scene, el);
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

function compileScenes(el) {
	assert(el !== null);

	attrs = el.attributes;
	for(var i = 0; i < attrs.length; i++) {
		attr = attrs.item(i);
		scene = new Scene({sid: attr.value});
		compileDirectives(el, scene);
	}
}

function compile(el) {
	assert(el !== null);
	//first
	$scenes = document.querySelectorAll('.scene');
	for(var i = 0; i < $scenes.length; i++) {
		compileScenes($scenes[i]);
	}
}

module.exports = {
	$compile: compile
};
},{"./assert":1,"./config":3,"./directive":4,"./scene":9}],3:[function(require,module,exports){
module.exports = {
	prefix: 'd-',
	forceEndTime: 500
};
},{}],4:[function(require,module,exports){
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
},{"./config":3,"./directives/index":5}],5:[function(require,module,exports){
var transition = require('./transition');

module.exports = transition;
},{"./transition":6}],6:[function(require,module,exports){
var config = require('../config');
var _ = require('../utils');

EnterTransMap = {};

LeftTransMap = {};

AnimationController = function(expression, scene, el) {
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

  scene.$on("TriggerAllElementsEnterTransition", function() {
    triggerTransition(EnterTransMap, function() {
      return scene.$emit("AllElementsEnterTransitionEnd");
    });
  });
  scene.$on("TriggerAllElementsLeftTransition", function() {
    triggerTransition(LeftTransMap, function() {
      return vm.$emit("AllElementsLeftTransitionEnd");
    });
  });
  scene.$on("ClearAllElementsEnterTransition", function() {
    return EnterTransMap = {};
  });
  scene.$on("ClearAllElementsLeftTransition", function() {
    return LeftTransMap = {};
  });
}

EnterAnimation = function(expression, scene, el) {
  var priority, transEffect;
  priority = expression.split("/")[0];
  transEffect = expression.split("/")[1];
  if (!EnterTransMap[priority]) {
    EnterTransMap[priority] = [];
  }
  return EnterTransMap[priority].push({
    el: el,
    transEffect: transEffect
  });
}

LeftAnimation = function(expression, scene, el) {
  var priority, transEffect;
  priority = expression.split("/")[0];
  transEffect = expression.split("/")[1];
  if (!LeftTransMap[priority]) {
    LeftTransMap[priority] = [];
  }
  return LeftTransMap[priority].push({
    el: el,
    transEffect: transEffect
  });
}

module.exports = {
  enteranimation: EnterAnimation,
  leftanimation: LeftAnimation,
  animationcontroller: AnimationController
}
},{"../config":3,"../utils":10}],7:[function(require,module,exports){
assert = require('./assert');

module.exports = {
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
	$emit: function(event) {
		fns = this.events[event];
		if (fns && fns instanceof Array) {
			fns.forEach(function(fn, idx) {
				fn();
			});
		}
	}
}
},{"./assert":1}],8:[function(require,module,exports){
var compiler = require('./compile');

window.X = {
	bootstrap: function() {
		compiler.$compile();
	}
}
},{"./compile":2}],9:[function(require,module,exports){
_ = require('./utils');
event = require('./event');

function Scene() {
	self = this;

	self.dirs = [];
	self.events = {};

	self.$on('EndRegisterDirectives', function() {
		self.$emit('TriggerAllElementsEnterTransition');
	});
}

Scene.prototype = _.extend(event, {});

module.exports = Scene;
},{"./event":7,"./utils":10}],10:[function(require,module,exports){
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
},{}]},{},[8])