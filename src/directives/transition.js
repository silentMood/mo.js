var config = require('../config');
var _ = require('../utils');

EnterTransMap = {};

LeftTransMap = {};

AnimationController = function(expression) {
  var self = this;
  //trigger all the animation event
  var triggerTransition = function(transitionMap, cb) {
    var forced, go, idx, keys, timeout;
    keys = Object.keys(transitionMap).sort();
    if (!keys.length) {
      return cb();
    }
    forced = false;
    timeout = setTimeout(function() {
      forced = true;
      return cb();
    }, 500);
    idx = 0;
    go = function(key) {
      var transitionendNums;
      if (idx > keys.length) {
        if (forced) {
          return;
        }
        clearTimeout(timeout);
        return cb();
      }
      transitionendNums = 0;
      return transitionMap[key].forEach(function(elem) {
        var called, handleEvent;
        setTimeout(function() {
          return _.addClass(elem.el, elem.transEffect);
        }, 0);
        called = false;
        handleEvent = function() {
          transitionendNums++;
          if (transitionendNums === transitionMap[key].length) {
            if (idx <= keys.length) {
              return go(keys[idx++]);
            }
          }
        };
        setTimeout(function() {
          if (called) {
            return;
          }
          called = true;
          return handleEvent();
        }, 500);
        return elem.el.addEventListener("transitionend", function(e) {
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