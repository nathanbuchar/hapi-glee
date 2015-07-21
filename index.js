/**
 * @fileoverview Entry point into Glee.
 * @author Nathan Buchar
 */

'use strict';

var glee = require('./lib/glee');

exports.register = function (server, options, next) {
  glee(server, options);
  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};
