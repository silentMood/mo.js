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