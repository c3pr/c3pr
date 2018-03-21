[![Build Status](https://travis-ci.org/c3pr/node-c3pr-logger.svg?branch=master)](https://travis-ci.org/c3pr/node-c3pr-logger)

# node-c3pr-logger

Node.js C3PR client for remote logging.

Have a look at [`src`](src) folder to understand what functions are available.

### Usage:

```bash
# Change 1.0.0 below with the desired version tag
npm i -S c3pr/node-c3pr-logger#1.0.0
```

Example at a JavaScript file:

```javascript
const log = require("node-c3pr-logger").log;
log.info(...);
log.debug(...);
```

See [test file](src/log.test.js) for usages.