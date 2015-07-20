# hapi-route-scope [![Build Status](https://travis-ci.org/nathanbuchar/hapi-route-scope.svg?branch=master)](https://travis-ci.org/nathanbuchar/hapi-route-scope)

Don't want `/docs` to show up on production? use `hapi-route-scope`! `hapi-route-scope` allows you to specify environment scopes for your routes with ease.


### Install

```bash
$ npm install hapi-route-scope
```


### Usage

#### Register the Plugin

To register the plugin, simply follow the typical plugin registration pattern outlined in the Hapi docs [here](http://hapijs.com/tutorials/plugins#loading-a-plugin).

```javascript
server.register([
  {
    register: require('hapi-route-scope'),
    options: {
      errorRouteId: 'error',
      environment: 'development'
    }
  }
], function (err) {});
```

##### options

* `errorRoutId` - `string` - **Required** The `id` of the route which you would like to handle requested routes that are "out of scope". Follow the instructions below to set up your error route.

* `environment` - `string` - **Optional** The environment with which to test our route scopes against. Default: `process.env.NODE_ENV`.


#### Setting up Your Error Route

If you don't already have a 404 route set up, simply register the following route after the rest of your routes:

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

You'll notice the `config.id` property. This is what we use to help `hapi-route-scope` identify the correct route to redirect to if the requested route is out of scope. This `id` must be the same as the `errorRouteId` property when registering `hapi-route-scope`.


#### Setting up Route Scopes

To scope a route to a specific environment, simply add it to the route config. If no scope is specified, then the route will always be available.

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

`scope` may be either a environment string, or an array of environments. If any of these match the environment that you defined when setting up the plugin, then the route will be available. If not, `hapi-route-scope` will instead route to the 404 page.



## Authors
* [Nathan Buchar](mailto:hello@nathanbuchar.com)



## License
MIT
