const path = require('path');
const DEFAULT_PATH_SEPARATOR = '\\' + path.sep;

export function getServiceName(stack, s = DEFAULT_PATH_SEPARATOR) {
    if (stack[0].includes("evalmachine")) {
        return "evalmachine";
    }
    for(let line of stack) {
        let matches = line.match(new RegExp(`${s}([^${s}]+)${s}node_modules${s}`));
        if (matches && matches[1]) {
            return matches[1];
        }
    }
    return 'unknown';
}

function getFullStack() {
    const stack = new Error().stack;
    return stack.split('\n');
}

export default function fileAndModule() {
    const stack = getFullStack();
    const service_name = getServiceName(stack);

    return {stack, service_name};
}