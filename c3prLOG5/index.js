Object.defineProperty(exports, "__esModule", { value: true });
exports.__c3prLOG5 = (c3prLOG4) => (messageOrLogOptionsToPartiallyApply, logOptions) => {
    if (typeof messageOrLogOptionsToPartiallyApply === "string") {
        // first arg is a message, proceed to actual call
        return c3prLOG4(messageOrLogOptionsToPartiallyApply, logOptions);
    }
    else {
        // first arg is a logOptions object to be "partially applied"
        let partiallyAppliedLogOptions = Object.assign({}, logOptions, messageOrLogOptionsToPartiallyApply);
        // automatically generate lcid if none was provided
        if (!partiallyAppliedLogOptions.lcid) {
            partiallyAppliedLogOptions.lcid = c3prLOG4.lcid();
        }
        return (nextMessageOrLogOptionsToStack, nextLogOptions) => {
            return exports.__c3prLOG5(c3prLOG4)(nextMessageOrLogOptionsToStack, Object.assign({}, partiallyAppliedLogOptions, nextLogOptions));
        };
    }
};
const c3prLOG4_1 = require("../c3prLOG4");
exports.default = exports.__c3prLOG5(c3prLOG4_1.default);
//# sourceMappingURL=index.js.map