"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require('util');
const c3prLOG_original = require('../src/c3prLOG');
function getStackLines() {
    const stack = new Error().stack;
    let lines = stack.split('\n');
    lines.shift(); // 'Error'
    lines.shift(); // '    at getStackLines (G:\\MSc-Tools\\c3pr\\node-c3pr-logger\\c3prLOG3\\index.ts:12:19)',
    lines.shift(); // '    at c3prLOG3 (G:\\MSc-Tools\\c3pr\\node-c3pr-logger\\c3prLOG3\\index.ts:24:17)',
    lines = lines.filter(line => !line.match(/\(module\.js:\d+:\d+\)$/)); // last, node internal, lines
    lines = lines.filter(line => !line.match(/ts-node.src.index\.ts:\d+:\d+\)$/)); // if using ts-node
    return lines;
}
function uniq(arr = []) {
    const sarr = arr.map(i => "" + i);
    return [...new Set(sarr)];
}
function fileAndModule(lines, level) {
    const fileNameAtLine = lines[level].match(/\\([^\\]+)\.\w+:\d+:\d+\)$/); // '    at awaw (G:\\MSc-Tools\\c3pr\\node-c3pr-logger\\src\\c3prLOG3-demo.js:4:5)' --> 'c3prLOG3-demo.js:4:5'
    let file;
    if (fileNameAtLine) {
        file = fileNameAtLine[1];
    }
    else {
        file = lines[level].split(/\(/)[0].replace(/^\s*at\s+/, '').trim(); // at fileAndModule (evalmachine.<anonymous>:71721:66)
    }
    let module = file;
    lines.forEach(line => {
        // '    at Object.<anonymous> (G:\\MSc-Tools\\c3pr\\node-c3pr-logger\\src\\c3prLOG3-demo2.ts:7:1)'  --> 'node-c3pr-logger'
        const c3prModuleMatch = line.match(/\\([^\\]+)\\src/);
        if (c3prModuleMatch && c3prModuleMatch[1]) {
            module = c3prModuleMatch[1];
        }
    });
    return { file, module };
}
function c3prLOG3(message, { ids, meta = {}, error, level = 0 }) {
    if (arguments.length !== 1 && arguments.length !== 2) {
        throw new Error(`c3prLOG3() called with different number or arguments. Wanted: 1 or 2. Passed: ${arguments.length} - ${JSON.stringify(arguments)}`);
    }
    const extraKeys = Object.keys(arguments[1] || {}).filter(key => !["level", "ids", "meta", "error"].includes(key));
    if (extraKeys.length) {
        throw new Error(`c3prLOG3() second argument must be of format {level: number, ids?: string[]; meta?: any; error?: Error;}. Additional keys passed: ${JSON.stringify(extraKeys)}. Full args: ${JSON.stringify(arguments)}`);
    }
    const lines = getStackLines();
    const { file, module } = fileAndModule(lines, level);
    let msgMsg = message || '';
    let metaMeta = Object.assign({ stack: lines }, meta);
    let logMetas = [{ nodeName: module, correlationIds: uniq(ids), moduleName: file }];
    if (error) {
        msgMsg = msgMsg.trim() + ` - Error reason: '${error}'. Data: ${error.response && JSON.stringify(error.response.data) || '<no data>'}.`;
        metaMeta.error = util.inspect(error);
    }
    c3prLOG_original(msgMsg, metaMeta, ...(logMetas || []));
}
exports.default = c3prLOG3;
function flatten(arrayOfArrays) {
    return arrayOfArrays.reduce((resultArray, array) => [...resultArray, ...array], []);
}
function logMetasToIds(...arrayOfLogMetasOrOfArrayOfLogMetas) {
    let arrayOfArrayOfLogMetas = arrayOfLogMetasOrOfArrayOfLogMetas.map(i => Array.isArray(i) ? i : [i]);
    let arrayOfLogMetas = flatten(arrayOfArrayOfLogMetas);
    let arrayOfArrayOfIds = arrayOfLogMetas.map(logMeta => {
        const correlationIds = logMeta.correlationIds || [];
        return logMeta.correlationId ? [...correlationIds, logMeta.correlationId] : correlationIds;
    });
    return flatten(arrayOfArrayOfIds);
}
exports.logMetasToIds = logMetasToIds;
//# sourceMappingURL=index.js.map