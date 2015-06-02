var transition = require('./transition');
var go = require('./goto');
var _ = require('../utils');
//directive will hook the scene's life cycle
//so when bind and unbind should be careful so that no need

module.exports = _.extend(transition, go);