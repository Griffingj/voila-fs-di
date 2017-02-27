// import fsGraph from './index';

// const promise = fsGraph({
//   globs: [
//     `src/controllers/**/*Controller.{js,ts}`,
//     `src/daos/**/*Dao.{js,ts}`,
//     `src/services/**/*Service.{js,ts}`
//   ],
//   deriveKey: func => func.name
// });

// promise.then(console.log);

// { resourceController:
//     { dependencies: [ 'resourceService' ],
//       provider: [Function: resourceController] },
//   resourceDao:
//     { dependencies: [],
//       provider: [Function: resourceDao] },
//   resourceService:
//     { dependencies: [ 'resourceDao' ],
//       provider: [Function: resourceService] } }

import fsGraph from './index';
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
