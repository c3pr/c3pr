[![Build Status](https://travis-ci.org/c3pr/node-c3pr-logger.svg?branch=master)](https://travis-ci.org/c3pr/node-c3pr-logger)

# node-c3pr-logger

Node.js C3PR client for remote logging.

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
let sha = `some git sha, if present`;
c3prLOG4(`message.`, {lcid, sha, euuid: '123-123-evt-uuid'});
```

```typescript
import c3prLOG5 from "node-c3pr-logger/c3prLOG5";

// lcid automatically provided if none is given
let c3prLOG5ToPassDownToNextFunction = c3prLOG5({sha: `some git sha, if present`})
// no need to pass sha again
c3prLOG5ToPassDownToNextFunction(`message.`, {euuid: '123-123-evt-uuid'});
```

# Tests

Note: this repo requires the env var `C3PR_MONGO_URL` set to run some tests.