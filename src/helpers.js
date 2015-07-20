/**
 * @fileoverview Glee plugin helpers.
 * @author Nathan Buchar
 */

'use strict';

/**
 * @function _isValidScope
 * @description Validates that the connection label(s) exist within the given
 *   scope. If the scope not defined, return true.
 * @param {array} scope
 * @param {Hapi.Server} server
 * @return {bool}
 */
var _isValidScope = exports.isValidScope = function (scope, server) {
  return ! scope || server.select(scope).connections.length > 0;
};

/**
 * @function _getErrorRoute
 * @description Fetches the error route.
 * @param {string|object} errorRoute
 * @param {Hapi.Server} server
 * @return {object}
 */
var _getErrorRoute = exports.getErrorRoute = function (errorRoute, server) {
  if (typeof errorRoute === 'string') {
    return server.lookup(errorRoute);
  } else {
    return errorRoute;
  }
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

    // If this route is not within the correct scope, alter the requested route
    // to the error route whose `id` is defined by `options.errorRoute`.
    if (! _isValidScope(scope, server)) {
      request.route = _getErrorRoute(options.errorRoute, server);
    }

    return reply.continue();
  };
};
