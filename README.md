# Glee for Hapi [![Build Status](https://travis-ci.org/nathanbuchar/glee.svg?branch=master)](https://travis-ci.org/nathanbuchar/glee)

Don't want to show certain test routes on production? use **Glee**! **Glee** allows you to specify environment-specific scopes for your routes with ease. It utilizes [minimatch](https://www.npmjs.com/package/minimatch) to compare a route's optional scope to the current node environment, and will filter out any routes from the array that don't match the criteria before registering them.


### Install

```bash
npm install glee
```


### Example

If a route's scope is set to

    !production

The route will be registered when the environment is not "production". Conversely, if the route's scope is set to

    development

The route will only be registered if the environment is "development".

#### Advanced

Given the following scope:

    +(development|staging)

The route will be registered if the environment is either "development", or "staging". You can read more about using minimatch [here](https://github.com/isaacs/minimatch).


### Usage

```javascript
/**
 * Step 1. Define the routes.
 */
var routes = [
  {
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      return reply('Hello, World.\n');
    }
  }, {
    method: 'GET',
    path: '/ping',
    handler: function (request, reply) {
      return reply('Pong!\n');
    },
    config: {
      plugins: {
        glee: {
          // Register this route only if the environment
          // is not "production".
          scope: '!production'
        }
      }
    }
  }
];

/**
 * Step 2. Register the plugin.
 */
server.register([
  {
    register: require('glee'),
    options: {
      routes: routes,
      environment: 'development'
    }
  }
], function (err) {});
```

##### options

|Name|Type|Description|Required|
|----|----|:----------|:------:|
|`routes`|`array`|Our Hapi routes.|Yes|
|`environment`|`string`|The server environment. This is what we will compare a route's scope to. Defaults to `process.env.NODE_ENV`|No|



## Authors
* [Nathan Buchar](mailto:hello@nathanbuchar.com)



## License
MIT
