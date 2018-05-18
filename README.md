[![Build Status](https://travis-ci.org/c3pr/node-c3pr-logger.svg?branch=master)](https://travis-ci.org/c3pr/node-c3pr-logger)

# node-c3pr-logger

Node.js C3PR client for remote logging.

Have a look at [`src`](src) folder to understand what functions are available.

### Usage:

```bash
# Change 7.0.2 below with the desired version tag
npm i -S c3pr/node-c3pr-logger#8.0.1
```

The `MONGO_LOGS_URI` must be defined to something like 

Example at a JavaScript file:

```javascript
const c3prLOG = require("node-c3pr-logger");

let logMeta = {nodeName: 'my-node', correlationId: 'SHA121313', moduleName: 'my-script'};
c3prLOG('message', logMeta);
// or
c3prLOG('message', {meta: 'some specific data'}, logMeta);
// or
let logMeta2 = {correlationId: 'some subID', moduleName: 'my-reusable-script'};
c3prLOG('message', logMeta, logMeta2);
```

See [test file](src/log.test.js) for usages.