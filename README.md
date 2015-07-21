# Glee for Hapi [![Build Status](https://travis-ci.org/nathanbuchar/glee.svg?branch=master)](https://travis-ci.org/nathanbuchar/glee)

Don't want `/docs` to show up on production? use **Glee**! **Glee** allows you to specify environment-specific scopes for your routes with ease.


### Install

```bash
$ npm install glee
```


### Usage

1. [Set up connection labels](#setting-up-connection-labels)
2. [Set up routes](#setting-up-the-routes)
3. [Register the plugin](#registering-the-plugin)



#### Setting up Connection labels

First, we need to set up the connection labels. **Glee** uses connection labels to determine if a route is within scope. We compare the scope we've set on our route to the labels defined on our connection(s). If one or all of these labels match then the route will be registered.

To set up the server labels, include the `labels` property when setting up a server connection.

```javascript
server.connection({
  port: 8080,
  labels: ['development']
});
```

A more dynamic approach might be:

```javascript
server.connection({
  port: 8080,
  labels: process.env.NODE_ENV
});
```

The `labels` property may either be a string or an array. By default, labels is set to `[]`.

More information about server connections can be found in the [Hapi docs](http://hapijs.com/api#serverconnections).



#### Setting up the Routes

Second, we'll need to format our routes so that **Glee** can filter them by scope. You'll likely want to save your routes in a separate file called `routes.js`.

Then, to add a scope to a route, simply enter the scope as the `config.plugins.glee.scope` property. `scope` may be either a string, or an array of strings. If any of these match any of the labels that was defined when setting up the connection, then the route will be registered with the server.

If a route does not explicitly define a scope, it is assumed to be always available, and will be registered.

```javascript
// routes.js

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler(request, reply) {
      reply('Home Page');
    }
  }, {
    method: 'GET',
    path: '/docs',
    handler(request, reply) {
      reply('Development-only docs');
    },
    config: {
      plugins: {
        glee: {
          scope: ['development']
        }
      }
    }
  }, {
    method: 'GET',
    path: '/{path*}',
    handler(request, reply) {
      reply('Page not found.').code(404);
    }
  }
];
```

**NOTE** Be sure to export your routes as an array.

#### Registering the Plugin

This plugin will handle route registration, so you need not call `server.route(require('./routes'))`. To register the plugin, simply follow the typical plugin registration pattern outlined in the Hapi docs [here](http://hapijs.com/tutorials/plugins#loading-a-plugin).

```javascript
var Glee = require('glee');

server.register([
  {
    register: Glee,
    options: {
      routes: require('./routes')
    }
  }
], function (err) {});
```

##### options

* `routes` - `array` - **Required** The routes that we defined in [step 2](#setting-up-the-routes).



## Authors
* [Nathan Buchar](mailto:hello@nathanbuchar.com)



## License
MIT
