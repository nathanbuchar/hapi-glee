/**
 * @fileoverview Scope plugin helpers.
 * @author Nathan Buchar
 */

'use strict';

/**
 * @function _parseScope
 * @description Parses the scope so that we always return an array.
 * @param {string|array} scope
 * @return {array}
 */
var _parseScope = exports.parseScope = function (scope) {
  return typeof scope === 'string' ? [scope] : scope;
};

/**
 * @function _isValidScope
 * @description Validates that the environment exists within the given scope. If
 *   the scope is undefined, return true.
 * @param {array} scope
 * @param {bool} [invert]
 * @param {string} [env]
 * @return {bool}
 */
var _isValidScope = exports.isValidScope = function (scope, env) {
  return ! scope || _parseScope(scope).indexOf(env) >= 0;
};

/**
 * @function _validateScope
 * @description Validates the scope of the requested route.
 * @param {Hapi.Server} server
 * @param {object} options
 * @return {object} - Interfaces with the `onPreAuth` lifecycle extension.
 */
var _validateScope = exports.validateScope = function (server, options) {
  return function (request, reply) {
    var route = request.route;
    var scope = route.settings.app.scope;
    var env = options.environment || process.env.NODE_ENV;

    // If this route is not within the correct scope, alter the requested route
    // to the error route whose `id` is defined by `options.errorRoute`.
    if (! _isValidScope(scope, env)) {
      if (typeof options.errorRoute === 'string') {
        request.route = server.lookup(options.errorRoute);
      } else {
        request.route = options.errorRoute;
      }
    }

    return reply.continue();
  };
};
