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
    this.parent.$on('hook:readyForDirBehaviour', this.handleReady.bind(this));
    //when hold then trigger left animation
    this.parent.$on('hook:holdForDirBehaviour', this.handleHold.bind(this));
  },
  unbind: function() {
    self.$off('hook:readyForDirBehaviour', this.handleReady);
    self.$off('hook:holdForDirBehaviour', this.handleHold);
    //reset the map
    EnterTransMap = {};
    LeftTransMap = {};
  }
}

EnterAnimation = {
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
  enteranimation: EnterAnimation,
  leftanimation: LeftAnimation,
  animationcontroller: AnimationController
}