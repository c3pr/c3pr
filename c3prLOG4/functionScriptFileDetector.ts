const path = require('path');

export const functionScriptFileDetectorConfig = {
    path_separator: '\\' + path.sep
};

function getFullStack() {
    const stack = new Error().stack;
    return stack.split('\n');
}

const SKIPPED_LINES = 3; // notice the first lines bellow are 'Error' and the calls relative to functionScriptFileDetector itself, which is why we always skip them
/*
[ 'Error',
  '    at getFullStack (G:\\MSc-Tools\\c3pr\\node-c3pr-logger\\c3prLOG4\\functionScriptFileDetector.js:7:19)',
  '    at functionScriptFileDetector (G:\\MSc-Tools\\c3pr\\node-c3pr-logger\\c3prLOG4\\functionScriptFileDetector.js:37:23)',
  '    at directCall (G:\\MSc-Tools\\c3pr\\node-c3pr-logger\\c3prLOG4\\functionScriptFileDetector.test.js:39:20)',
  '    at Context.it (G:\\MSc-Tools\\c3pr\\node-c3pr-logger\\c3prLOG4\\functionScriptFileDetector.test.js:41:21)',
  '    at callFn (G:\\MSc-Tools\\c3pr\\node-c3pr-logger\\node_modules\\mocha\\lib\\runnable.js:354:21)',
  '    at Test.Runnable.run (G:\\MSc-Tools\\c3pr\\node-c3pr-logger\\node_modules\\mocha\\lib\\runnable.js:346:7)',
  '    at Runner.runTest (G:\\MSc-Tools\\c3pr\\node-c3pr-logger\\node_modules\\mocha\\lib\\runner.js:442:10)',
  '    at G:\\MSc-Tools\\c3pr\\node-c3pr-logger\\node_modules\\mocha\\lib\\runner.js:560:12',
  '    at next (G:\\MSc-Tools\\c3pr\\node-c3pr-logger\\node_modules\\mocha\\lib\\runner.js:356:14)',
  '    at G:\\MSc-Tools\\c3pr\\node-c3pr-logger\\node_modules\\mocha\\lib\\runner.js:366:7',
  '    at next (G:\\MSc-Tools\\c3pr\\node-c3pr-logger\\node_modules\\mocha\\lib\\runner.js:290:14)',
  '    at Immediate.<anonymous> (G:\\MSc-Tools\\c3pr\\node-c3pr-logger\\node_modules\\mocha\\lib\\runner.js:334:5)',
  '    at runCallback (timers.js:789:20)',
  '    at tryOnImmediate (timers.js:751:5)',
  '    at processImmediate [as _immediateCallback] (timers.js:722:5)' ]
 */

const INVALID_NAMES = [
    'Object.t.default', 't.default'
];
export function getCallerName(fullStack: string[], level = 0) {
    for (let i = SKIPPED_LINES + level; i < fullStack.length; i++) {
        let line = fullStack[i];
        const match = line.match(/at (.*?) \(/);
        if (match && match[1] && !INVALID_NAMES.includes(match[1])) {
            return match[1];
        }
    }
    return '(unknown caller)';
}

export function getServiceName(stack, s = functionScriptFileDetectorConfig.path_separator) {
    const regExp = new RegExp(`${s}([^${s}]+)${s}node_modules${s}`);

    let service_name;
    for(let line of stack) {
        if (!service_name && line.includes("(evalmachine")) {
            service_name = "evalmachine";
        }
        let matches = line.match(regExp);
        if (matches && matches[1]) {
            return matches[1];
        }
    }
    return service_name || 'unknown';
}

export default function functionScriptFileDetector(level = 0) {
    const fullStack = getFullStack();
    return {stack: fullStack, service_name: getServiceName(fullStack), caller_name: getCallerName(fullStack, level)};
}
