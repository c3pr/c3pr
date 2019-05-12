const c3prLOG5 = require("node-c3pr-logger/c3prLOG5").default;

const _c3prLOG5 = c3prLOG5({sha: '!agent-init'});

require("./application/login/login")(_c3prLOG5);
require("./web/express")(_c3prLOG5);