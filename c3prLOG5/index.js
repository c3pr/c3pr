Object.defineProperty(exports, "__esModule", { value: true });
// automatically generate lcid if none was provided
function generateLcidIfNoneWasProvided(logOptions, c3prLOG4) {
    if (!logOptions.lcid) {
        return Object.assign({}, logOptions, { lcid: c3prLOG4.lcid() });
    }
    return logOptions;
}
function copyFromShaIntoEuuidIfEmpty(logOptions) {
    return Object.assign({}, (logOptions.sha && { euuid: logOptions.sha }), logOptions);
}
exports.__c3prLOG5 = (c3prLOG4) => (messageOrLogOptionsToPartiallyApply, logOptions) => {
    if (typeof messageOrLogOptionsToPartiallyApply === "string") {
        // first arg is a message, proceed to actual call
        return c3prLOG4(messageOrLogOptionsToPartiallyApply, copyFromShaIntoEuuidIfEmpty(generateLcidIfNoneWasProvided(logOptions || {}, c3prLOG4)));
    }
    else {
        // first arg is a logOptions object to be "partially applied"
        let partiallyAppliedLogOptions = Object.assign({}, logOptions, messageOrLogOptionsToPartiallyApply);
        partiallyAppliedLogOptions = copyFromShaIntoEuuidIfEmpty(generateLcidIfNoneWasProvided(partiallyAppliedLogOptions, c3prLOG4));
        const nextCall = (nextMessageOrLogOptionsToStack, nextLogOptions) => {
            return exports.__c3prLOG5(c3prLOG4)(nextMessageOrLogOptionsToStack, Object.assign({}, partiallyAppliedLogOptions, nextLogOptions));
        };
        nextCall.lcid = partiallyAppliedLogOptions.lcid;
        nextCall.sha = partiallyAppliedLogOptions.sha;
        nextCall.euuid = partiallyAppliedLogOptions.euuid;
        return nextCall;
    }
};
const c3prLOG4_1 = require("../c3prLOG4");
exports.default = exports.__c3prLOG5(c3prLOG4_1.default);
//# sourceMappingURL=index.js.map