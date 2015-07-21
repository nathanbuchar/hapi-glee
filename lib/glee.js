/**
 * @fileoverview This plugin validates the scope of a route so that it may only
 *   be accessible in specified node environments.
 * @author Nathan Buchar
 */

'use strict';

var _ = require('lodash');

/**
 * @function _validateScope
 * @description Checks that the specified scope is valid.
 * @param {Hapi.Server} server
 * @param {object} scope
 * @return {bool}
 */
var _validateScope = function (server, scope) {
  return ! scope || server.select(scope).connections.length > 0;
};

/**
 * @function _routeIsWithinScope
 * @description Checks that the route is within the scope of the server.
 * @param {Hapi.Server} server
 * @param {object} route
 * @return {bool}
 */
var _routeIsWithinScope = function (server, route) {
  try {
    return _validateScope(server, route.config.app.scope);
  } catch (err) {
    return true;
  }
};

/**
 * @function _filterRoutes
 * @description Filters out any routes that are out of scope.
 * @param {Hapi.Server}
 * @param {object} routes
 * @return {object}
 */
var _filterRoutes = function (server, routes) {
  return _.filter(routes, function (route) {
    return _routeIsWithinScope(server, route);
  });
};

/**
 * @function _glee
 * @description Validates the scope of a requested route at the `preAuth`
 *   Hapi lifecycle extension.
 * @param {Hapi.Server} server
 * @param {object} options
 */
var _glee = function (server, options) {
  server.route(_filterRoutes(server, options.routes));
};

module.exports = _glee;
