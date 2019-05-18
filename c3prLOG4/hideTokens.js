"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DEFAULT_REPLACEMENT_CHAR = '*';
function normalize(arr) {
    return (arr || []).reduce(function (acc, x) {
        if (typeof x === 'string') {
            return acc.concat([[x, DEFAULT_REPLACEMENT_CHAR.repeat(x.length)]]);
        }
        else {
            return acc.concat(Object.entries(x));
        }
    }, []);
}
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
}
function hideTokens(message, hide) {
    var newMessage = message;
    normalize(hide).forEach(function (_a) {
        var wordToHide = _a[0], replacementValue = _a[1];
        newMessage = replaceAll(newMessage, wordToHide, replacementValue);
    });
    return newMessage;
}
exports.default = hideTokens;
