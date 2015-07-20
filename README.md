# Glee for Hapi [![Build Status](https://travis-ci.org/nathanbuchar/hapi-glee.svg?branch=master)](https://travis-ci.org/nathanbuchar/hapi-glee)

Don't want `/docs` to show up on production? use **Glee**! **Glee** allows you to specify environment-specific scopes for your routes with ease.


### Install

```bash
$ npm install hapi-glee
```


### Usage

#### Connection Labeling

First, we need to set up the connection labels. **Glee** uses connection labels to determine if a route is within scope. We compare the scope we've set on our route to the labels defined on our connection(s). If one or all of these labels match then the route is allowed, and if not we use the error route.

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

The `labels` property may either be a string or an array. By default, labels is set to `[]`



#### Setting up The Error Route

This will be the route that will be used if the requested route is out of scope. If you don't already have a 404 route set up, simply register the following route after the rest of your routes:

```javascript
server.route([
  ...
  {
    method: 'GET',
    path: '/{path*}',
    handler: function (request, reply) {
      return reply('Error 404').code(404);
    },
    config: {
      id: 'error'
    }
  }
]);
```

You'll notice the `config.id` property. This is what we use to help **Glee** identify the correct route to redirect to if the requested route is out of scope. This `id` must be the same as string that is used to look up the route in the `errorRoute` property when registering the **Glee** plugin below.



#### Register the Plugin

To register the plugin, simply follow the typical plugin registration pattern outlined in the Hapi docs [here](http://hapijs.com/tutorials/plugins#loading-a-plugin).

```javascript
server.register([
  {
    register: require('Glee'),
    options: {
      errorRoute: server.lookup('error')
    }
  }
], function (err) {});
```

##### options

* `errorRoute` - `object|string` - **Required** This may be either a direct reference to the error route itself, or the `id` of the error route which you would like to handle requested routes that are "out of scope". Follow the instructions below to set up your error route.




#### Route Scoping

To scope a route to a specific label, simply add it to the route config. If no scope is specified, then the route will always be available.

```javascript
server.route([
  {
    method: 'GET',
    path: '/docs'
    handler: function (request, reply) {
      // Route handler.
    },
    config: {
      app: {
        scope: ['development', 'staging']
      }
    }
  }
])
```

`scope` may be either a string, or an array of strings. If any of these match any of the labels that was defined when setting up the connection, then the route will be available. If not, **Glee** will instead route to the aforementioned error page.



## Authors
* [Nathan Buchar](mailto:hello@nathanbuchar.com)



## License
MIT
