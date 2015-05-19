EnterTransMap = {};

LeftTransMap = {};

Vue.directive('d-transition', {
  bind: function() {
    var called, dir, effect, el, handleEvents, resetT, vm;
    dir = 0;
    effect = this.expression;
    el = this.el;
    vm = this.vm;
    called = false;
    handleEvents = function() {
      return vm.$emit(dir ? "LeftEffectDone" : "EnterEffectDone");
    };
    resetT = function() {
      called = false;
      return setTimeout(function() {
        if (called) {
          return;
        }
        called = true;
        return handleEvents();
      }, 1000);
    };
    el.addEventListener("transitionend", (function(_this) {
      return function(e) {
        if (called) {
          return;
        }
        called = true;
        e.stopPropagation();
        return handleEvents();
      };
    })(this));
    vm.$on("ExecEnterEffect", function() {
      resetT();
      dir = 0;
      return setTimeout(function() {
        return $(el).addClass("" + effect + "-enter");
      }, 100);
    });
    return vm.$on("ExecLeftEffect", function() {
      resetT();
      dir = 1;
      return setTimeout(function() {
        return $(el).addClass("" + effect + "-left");
      }, 100);
    });
  }
});


Vue.directive('d-whole', {
  bind: function() {
    var triggerTransition, vm;
    vm = this.vm;
    triggerTransition = function(transitionMap, cb) {
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
            return $(elem.el).addClass(elem.transEffect);
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
    vm.$on("TriggerAllElementsEnterTransition", function() {
      return triggerTransition(EnterTransMap, function() {
        return vm.$emit("AllElementsEnterTransitionEnd");
      });
    });
    vm.$on("TriggerAllElementsLeftTransition", function() {
      return triggerTransition(LeftTransMap, function() {
        return vm.$emit("AllElementsLeftTransitionEnd");
      });
    });
    vm.$on("ClearAllElementsEnterTransition", function() {
      return EnterTransMap = {};
    });
    return vm.$on("ClearAllElementsLeftTransition", function() {
      return LeftTransMap = {};
    });
  }
});

Vue.directive('d-register-enter', {
  bind: function() {
    var priority, transEffect;
    priority = this.expression.split("/")[0];
    transEffect = this.expression.split("/")[1];
    if (!EnterTransMap[priority]) {
      EnterTransMap[priority] = [];
    }
    return EnterTransMap[priority].push({
      el: this.el,
      transEffect: transEffect
    });
  }
});

Vue.directive('d-register-left', {
  bind: function() {
    var priority, transEffect;
    priority = this.expression.split("/")[0];
    transEffect = this.expression.split("/")[1];
    if (!LeftTransMap[priority]) {
      LeftTransMap[priority] = [];
    }
    return LeftTransMap[priority].push({
      el: this.el,
      transEffect: transEffect
    });
  }
});