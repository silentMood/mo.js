//test module
var _ = require('../../../src/utils');

describe('obj utils', function(){

  it('test extend', function(){
  	var m = {a: 1};
    var n = {b: 1};
    var z = _.extend(m, n);
    expect(m['b'] === undefined).toBe(true);
    expect(n['a'] === undefined).toBe(true);
    expect(z['a'] === z['b'] == 1).toBe(true);
    expect(Object.keys(m).length).toBe(1);
    expect(Object.keys(n).length).toBe(1);
    expect(Object.keys(z).length).toBe(2);
  });

  it('test mixin', function() {
  	var m = {a: 1};
    var n = {b: 1};
    var z = _.mixin(m, n);
    expect(m['b'] === 1).toBe(true);
    expect(n['a'] === undefined).toBe(true);
    expect(z === undefined).toBe(true);
    expect(Object.keys(m).length).toBe(2);
    expect(Object.keys(n).length).toBe(1);
  });
});