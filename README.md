[![Build Status](https://travis-ci.org/c3pr/node-c3pr-logger.svg?branch=master)](https://travis-ci.org/c3pr/node-c3pr-logger)

# node-c3pr-logger

Node.js C3PR client for remote logging.

Have a look at [`src`](src) folder to understand what functions are available.

### Usage:

```bash
# Change 1.2.3 below with the desired version tag
npm i -S c3pr/node-c3pr-logger#1.2.3
```

The `C3PR_MONGO_URL` must be defined to something like: `mongodb://user:pass@host:port`.

Example at a JavaScript file:

```javascript
const c3prLOG4 = require("node-c3pr-logger/c3prLOG4").default;

let lcid = c3prLOG4.lcid(); // log correlation id
c3prLOG4(`message.`, {lcid, euuid: '123-123-evt-uuid', ids, logMetas});
```

See [test file](src/c3prLOG.test.js) for usages.

# Tests

Note: this repo requires the env var `C3PR_MONGO_URL` set to run the tests.