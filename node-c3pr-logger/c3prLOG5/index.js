Object.defineProperty(exports, "__esModule", { value: true });
// automatically generate lcid if none was provided
function generateLcidIfNoneWasProvided(logOptions, c3prLOG4) {
    if (!logOptions.lcid) {
        return Object.assign({}, logOptions, { lcid: c3prLOG4.lcid() });
    }
    return logOptions;
}
function addExclamationToInvalidSha(logOptions) {
    return Object.assign({}, logOptions, (logOptions.sha && { sha: /^[0-9a-z]{40}$|^!/.test(logOptions.sha) ? logOptions.sha : '!' + logOptions.sha }));
}
function copyShaIntoEuuidIfEmpty(logOptions) {
    return Object.assign({}, (logOptions.sha && { euuid: logOptions.sha }), logOptions);
}
function normalizeHide(logOptions) {
    if (logOptions.hide && !Array.isArray(logOptions.hide)) {
        return Object.assign({}, logOptions, { hide: [logOptions.hide] });
    }
    return logOptions;
}
const arrayFy = x => !x ? [] : (Array.isArray(x) ? x : [x]);
function accumulateHideProperty(logOptions, messageOrLogOptionsToPartiallyApply) {
    if (!Object.assign({}, logOptions, messageOrLogOptionsToPartiallyApply).hide)
        return undefined;
    return { hide: arrayFy(logOptions && logOptions.hide).concat(arrayFy(messageOrLogOptionsToPartiallyApply && messageOrLogOptionsToPartiallyApply.hide)) };
}
exports.__c3prLOG5 = (c3prLOG4) => (messageOrLogOptionsToPartiallyApply, logOptions) => {
    if (typeof messageOrLogOptionsToPartiallyApply === "string") {
        // first arg is a message, proceed to actual call
        const message = messageOrLogOptionsToPartiallyApply;
        const enrichedOptions = normalizeHide(copyShaIntoEuuidIfEmpty(addExclamationToInvalidSha(generateLcidIfNoneWasProvided(logOptions || {}, c3prLOG4))));
        return c3prLOG4(message, enrichedOptions);
    }
    else {
        // first arg is a logOptions object to be "partially applied"
        let partiallyAppliedLogOptions = Object.assign({}, logOptions, messageOrLogOptionsToPartiallyApply, accumulateHideProperty(logOptions, messageOrLogOptionsToPartiallyApply));
        partiallyAppliedLogOptions = copyShaIntoEuuidIfEmpty(addExclamationToInvalidSha(generateLcidIfNoneWasProvided(partiallyAppliedLogOptions, c3prLOG4)));
        const nextCall = (nextMessageOrLogOptionsToStack, nextLogOptions) => {
            return exports.__c3prLOG5(c3prLOG4)(nextMessageOrLogOptionsToStack, Object.assign({}, partiallyAppliedLogOptions, nextLogOptions));
        };
        nextCall.lcid = partiallyAppliedLogOptions.lcid;
        nextCall.sha = partiallyAppliedLogOptions.sha;
        nextCall.euuid = partiallyAppliedLogOptions.euuid;
        if (partiallyAppliedLogOptions.level)
            nextCall.level = partiallyAppliedLogOptions.level;
        return nextCall;
    }
};
const c3prLOG4_1 = require("../c3prLOG4");
exports.default = exports.__c3prLOG5(c3prLOG4_1.default);
//# sourceMappingURL=index.js.map