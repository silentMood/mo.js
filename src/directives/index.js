var transition = require('./transition');
var go = require('./goto');
var _ = require('../utils');

module.exports = _.extend(transition, go);