"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
// automatically generate lcid if none was provided
function generateLcidIfNoneWasProvided(logOptions, c3prLOG4) {
    if (!logOptions.lcid) {
        return __assign({}, logOptions, { lcid: c3prLOG4.lcid() });
    }
    return logOptions;
}
exports.__c3prLOG5 = function (c3prLOG4) { return function (messageOrLogOptionsToPartiallyApply, logOptions) {
    if (typeof messageOrLogOptionsToPartiallyApply === "string") {
        // first arg is a message, proceed to actual call
        return c3prLOG4(messageOrLogOptionsToPartiallyApply, generateLcidIfNoneWasProvided(logOptions, c3prLOG4));
    }
    else {
        // first arg is a logOptions object to be "partially applied"
        var partiallyAppliedLogOptions_1 = __assign({}, logOptions, messageOrLogOptionsToPartiallyApply);
        partiallyAppliedLogOptions_1 = generateLcidIfNoneWasProvided(partiallyAppliedLogOptions_1, c3prLOG4);
        var nextCall = function (nextMessageOrLogOptionsToStack, nextLogOptions) {
            return exports.__c3prLOG5(c3prLOG4)(nextMessageOrLogOptionsToStack, __assign({}, partiallyAppliedLogOptions_1, nextLogOptions));
        };
        nextCall.lcid = partiallyAppliedLogOptions_1.lcid;
        nextCall.sha = partiallyAppliedLogOptions_1.sha;
        nextCall.euuid = partiallyAppliedLogOptions_1.euuid;
        return nextCall;
    }
}; };
var c3prLOG4_1 = require("../c3prLOG4");
exports.default = exports.__c3prLOG5(c3prLOG4_1.default);
