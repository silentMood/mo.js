var Directive = require('../../../src/core/directive');
var config = require('../../../src/config');
var _ = require('../../../src/utils');

describe('directive', function(){
  var container;
  var dir;
  var mixin;

  beforeAll(function(){
    container = document.createElement('div');
    container.innerHTML = "<div d-go='scene2'></div>";
    document.body.appendChild(container);

    //do some mock
    mixin = _.mixin;
    _.mixin = jasmine.createSpy('mixin');
  });

  afterAll(function() {
    container.remove();
    _.mixin = mixin;
  });

  it('when new a directive, with a not exist dirName, the _.mixin should not be called', function() {    
    dir = new Directive({
      dirName: 'test',
      expression: 'test',
      scene: {},
      el: container
    });
    expect(_.mixin.calls.count()).toEqual(0);
  });

  it('when new a directive, with a exist dirName, the _.mixin should be called', function() {
    dir = new Directive({
      dirName: 'go',
      expression: 'test',
      scene: {},
      el: container
    });
    expect(_.mixin.calls.count()).toEqual(1);
  });
});