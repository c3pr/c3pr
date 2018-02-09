# node-git-client

Node.js layer on top of shell git command line.

Have a look at [`src`](src) folder to understand what functions are available.

### Usage:

```bash
# Change 0.1.0 below with the desired version tag
npm i -S c3pr/node-git-client#0.1.0
```

Example at a JavaScript file:

```javascript
const cloneRepositoryLocally = require("node-git-client").cloneRepositoryLocally;

(async () => {

    const cloneFolder = await cloneRepositoryLocally({
        ... 
    });

    ...

})();
```
