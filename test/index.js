/**
 * @fileoverview Test specs.
 * @author Nathan Buchar
 * @ignore
 */

 /* global it, describe, before, after, beforeEach, afterEach */

'use strict';

var Plugin = require('..');

var Code = require('code');
var Hapi = require('hapi');
var Lab = require('lab');
var request = require('superagent');

var lab = exports.lab = Lab.script();
var env = 'test';
var scope = 'test';
var server;

var errorRoute = {
  method: 'GET',
  path: '/{path*}',
  handler: function (requst, reply) {
    return reply().code(404);
  },
  config: {
    id: 'error'
  }
};

process.env.NODE_ENV = 'test';

lab.experiment('Plugin', function () {

  lab.before(function (done) {
    server = new Hapi.Server();

    server.connection({
      port: process.env.PORT || 3000
    });

    done();
  });

  lab.after(function (done) {
    server.stop(function () {
      done();
    });
  });

  lab.test('should register without errors', function (done) {
    server.register({
      register: Plugin,
      options: {
        routes: []
      }
    }, function (err) {
      Code.expect(err).to.not.exist();
      done();
    });
  });
});

lab.experiment('Requests', function () {

  lab.beforeEach(function (done) {
    server = new Hapi.Server();

    server.connection({
      port: process.env.PORT || 3000,
      labels: ['test']
    });

    done();
  });

  lab.afterEach(function (done) {
    server.stop(function () {
      done();
    });
  });

  lab.test('should return 200 OK when no config is set', function (done) {
    server.register({
      register: Plugin,
      options: {
        routes: [
          {
            method: 'GET',
            path: '/test',
            handler: function (requst, reply) {
              return reply();
            }
          }, errorRoute
        ]
      }
    }, function (err) {
      server.start(function () {
        request.get('localhost:3000/test').end(function (err, res) {
          Code.expect(res).to.exist();
          Code.expect(res.status).to.equal(200);
          done();
        });
      });
    });
  });

  lab.test('should return 200 OK when no scope is set', function (done) {
    server.register({
      register: Plugin,
      options: {
        routes: [
          {
            method: 'GET',
            path: '/test',
            handler: function (requst, reply) {
              return reply();
            },
            config: {
              app: {}
            }
          }, errorRoute
        ]
      }
    }, function (err) {
      server.start(function () {
        request.get('localhost:3000/test').end(function (err, res) {
          Code.expect(res).to.exist();
          Code.expect(res.status).to.equal(200);
          done();
        });
      });
    });
  });

  lab.test('should return 200 OK when in scope and scope is a string', function (done) {
    server.register({
      register: Plugin,
      options: {
        routes: [
          {
            method: 'GET',
            path: '/test',
            handler: function (requst, reply) {
              return reply();
            },
            config: {
              app: {
                scope: 'test'
              }
            }
          }, errorRoute
        ]
      }
    }, function (err) {
      server.start(function () {
        request.get('localhost:3000/test').end(function (err, res) {
          Code.expect(res).to.exist();
          Code.expect(res.status).to.equal(200);
          done();
        });
      });
    });
  });

  lab.test('should return 200 OK when in scope and scope is an array', function (done) {
    server.register({
      register: Plugin,
      options: {
        routes: [
          {
            method: 'GET',
            path: '/test',
            handler: function (requst, reply) {
              return reply();
            },
            config: {
              app: {
                scope: ['test']
              }
            }
          }, errorRoute
        ]
      }
    }, function (err) {
      server.start(function () {
        request.get('localhost:3000/test').end(function (err, res) {
          Code.expect(res).to.exist();
          Code.expect(res.status).to.equal(200);
          done();
        });
      });
    });
  });

  lab.test('should return 404 NOT FOUND when not in scope', function (done) {
    server.register({
      register: Plugin,
      options: {
        routes: [
          {
            method: 'GET',
            path: '/test',
            handler: function (requst, reply) {
              return reply();
            },
            config: {
              app: {
                scope: 'outofscope'
              }
            }
          }, errorRoute
        ]
      }
    }, function (err) {
      server.start(function () {
        request.get('localhost:3000/test').end(function (err, res) {
          Code.expect(res).to.exist();
          Code.expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  lab.test('should handle the error route as an id string', function (done) {
    server.register({
      register: Plugin,
      options: {
        routes: [
          {
            method: 'GET',
            path: '/test',
            handler: function (requst, reply) {
              return reply();
            },
            config: {
              app: {
                scope: 'outofscope'
              }
            }
          }, errorRoute
        ]
      }
    }, function (err) {
      server.start(function () {
        request.get('localhost:3000/test').end(function (err, res) {
          Code.expect(res).to.exist();
          Code.expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
});
