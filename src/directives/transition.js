var config = require('../config');
var _ = require('../utils');

EnterTransMap = {};

LeftTransMap = {};

AnimationController = function(expression) {
  var self = this;
  //trigger all the animation event
  var triggerTransition = function(transitionMap, cb) {
    var keys = Object.keys(transitionMap).sort();
    if (!keys.length) return cb();
    var idx = 0;
    function go(key) {
      if (idx > keys.length) return cb();
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

        elem.el.addEventListener("transitionend", function(e) {
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