# Voilà File System Dependency Graph
[![Build Status](https://travis-ci.org/Griffingj/voila-fs-di.svg?branch=master)](https://travis-ci.org/Griffingj/voila-fs-di)
[![Code Climate](https://codeclimate.com/github/Griffingj/voila-fs-di/badges/gpa.svg)](https://codeclimate.com/github/Griffingj/voila-fs-di)
[![Test Coverage](https://codeclimate.com/github/Griffingj/voila-fs-di/badges/coverage.svg)](https://codeclimate.com/github/Griffingj/voila-fs-di/coverage)

A library for creating a DI graph from modules on the file system

Common usage, with main.js as follows.  
If using a build step, the globs should be written to be correct in the transpiled code

```javascript
const promise = fsGraph({
  globs: [
    `src/controllers/**/*Controller.{js,ts}`,
    `src/daos/**/*Dao.{js,ts}`,
    `src/services/**/*Service.{js,ts}`
  ],
  deriveKey: func => func.name
});
```

And with the file system arranged as follows.

```
root
 └─┬src
   ├─┬controllers
   | └──resourceController.js
   ├─┬daos
   | └──resourceDao.js
   ├─┬services
   | └──resourceService.js
   └──main.js
```

And with the file contents as follows.

resourceController.js
```javascript
export default function resourceController(resourceService) {

  return {
    doControllerAction(request, reply) {
      // [... transport logic]
      return resourceService.doServiceAction(request.params).then(reply);
    }
  };
}
```

`fsGraph` expects that modules that match the glob patterns export a function as `module.exports` 
or `default`. Each function is passed to the `deriveKey` option to determine its di key. The 
function arguments are parsed and should coincide with the other keys in the graph--this does not 
work with transpiled destructuring.

resourceService.js
```javascript
modules.exports = function resourceService(resourceDao) {

  return {
    doServiceAction(params) {
      // [... business logic]
      return resourceDao.doDaoAction(params);
    }
  };
}
```

resourceDao.js
```javascript
export default function resourceDao(/* someClient */) {

  return {
    doDaoAction(params) {
      // [... dao logic]
      // someClient.send(params);
    }
  };
}
```

This setup will produce a dependency graph, for use with voila-di, as follows.

```javascript
import fsGraph from 'voila-fs-di';

const promise = fsGraph({
  globs: [
    `src/controllers/**/*Controller.{js,ts}`,
    `src/daos/**/*Dao.{js,ts}`,
    `src/services/**/*Service.{js,ts}`
  ],
  deriveKey: func => func.name
});

promise.then(console.log);

// { resourceController:
//     { dependencies: [ 'resourceService' ],
//       provider: [Function: resourceController] },
//   resourceDao:
//     { dependencies: [],
//       provider: [Function: resourceDao] },
//   resourceService:
//     { dependencies: [ 'resourceDao' ],
//       provider: [Function: resourceService] } }
```

And this is what the integration looks like.

```javascript
import fsGraph from 'voila-fs-di';
import di      from 'voila-di';

const promise = fsGraph({
  globs: [
    `src/controllers/**/*Controller.{js,ts}`,
    `src/daos/**/*Dao.{js,ts}`,
    `src/services/**/*Service.{js,ts}`
  ],
  deriveKey: func => func.name
});

promise
  // Validate here if you'd like
  .then(graph => di(graph).get('resourceController'))
  .then(console.log);

// => { doControllerAction: [Function: doControllerAction] }
```