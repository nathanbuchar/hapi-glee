/**
 * @fileoverview file_description
 * @author Nathan Buchar
 */

'use strict';

var scope = require('./src/scope');

exports.register = function (server, options, next) {
  scope(server, options);
  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};
