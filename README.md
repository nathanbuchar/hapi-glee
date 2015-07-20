# hapi-route-scope

Scope routes to specific node environments.


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

* `environment` - `string` - Optional: The environment with which to test our route scopes against. Default: `process.env.NODE_ENV`.

* `errorRoutId` - `string` - Required: The `id` of the route which you would like to handle requested routes that are "out of scope". Follow the instructions below to set up your error route.


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



## Authors
* [Nathan Buchar](mailto:hello@nathanbuchar.com)



## License
MIT
