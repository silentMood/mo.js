var _ = require('../../../src/utils');

describe('dom utils', function(){
  var container;
  var dir;
  var mixin;

  beforeAll(function(){
    container = document.createElement('div');
    container.innerHTML = "<div class='test xxx' dk='hi'></div>";
    document.body.appendChild(container);
  });

  afterAll(function() {
    container.remove();
  });

  it('test hasClass', function() {    
    expect(_.hasClass(container.childNodes[0], 'x')).toBe(false);
    expect(_.hasClass(container.childNodes[0], 'xxx')).toBe(true);
    expect(_.hasClass(container.childNodes[0], 'test')).toBe(true);
  });

  it('test addClass', function() {
    expect(_.hasClass(container.childNodes[0], 'test2')).toBe(false);
    _.addClass(container.childNodes[0], 'test2');
    expect(_.hasClass(container.childNodes[0], 'test2')).toBe(true);
  });

  it('test removeClass', function() {
    expect(_.hasClass(container.childNodes[0], 'test2')).toBe(true);
    _.removeClass(container.childNodes[0], 'test2');
    expect(_.hasClass(container.childNodes[0], 'test2')).toBe(false);
  });

  it('test getAttrValByName', function() {
    expect(_.getAttrValByName(container.childNodes[0], 'dk')).toEqual('hi');
  });
});