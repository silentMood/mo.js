var config = require('../config');
var _ = require('../utils');

EnterTransMap = {};

LeftTransMap = {};

AnimationController = function(expression) {
  var self = this;
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