/**
 * @fileoverview This plugins validates the scope of a route so that it may only
 *   be accessible in specified node environments.
 * @author Nathan Buchar
 */

'use strict';

var helpers = require('./helpers');

/**
 * @function _scope
 * @description Validates the scope of a requested route at the `preAuth`
 *   Hapi lifecycle extension.
 * @param {Hapi.Server} server
 * @param {object} options
 */
var _scope = function (server, options) {
  server.ext('onPreAuth', helpers.validateScope.call(null, server, options));
};

module.exports = _scope;
