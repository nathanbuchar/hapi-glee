/**
 * This plugin validates the scope of a route so that it may only be accessible
 * within specific node environments.
 *
 * @module lib/glee
 * @author Nathan Buchar
 */

'use strict';

var _ = require('lodash');
var minimatch = require('minimatch');

/**
 * Default plugin registry.
 *
 * @param {Hapi.Server} server
 * @param {Object} options
 * @returns {Object}
 */
module.exports = function (server, options) {
  return server.route(_.filter(options.routes, function (route) {
    var env = options.environment || process.env.NODE_ENV;

    try {
      return minimatch(env, route.config.plugins.glee.scope);
    } catch (err) {
      return true;
    }
  }));
};
