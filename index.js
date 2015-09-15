/**
 * Entry point into the Glee Hapi plugin.
 *
 * @author Nathan Buchar
 * @copyright 2015 Nathan Buchar <hello@nathanbuchar.com>
 * @license MIT
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
