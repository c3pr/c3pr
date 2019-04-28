
export const __c3prLOG5 = (c3prLOG4) => (messageOrLogOptionsToPartiallyApply?: string | Partial<Log4Options>, logOptions?: Partial<Log4Options>) => {
    if (typeof messageOrLogOptionsToPartiallyApply === "string") {
        // first arg is a message, proceed to actual call
        return c3prLOG4(messageOrLogOptionsToPartiallyApply, logOptions);
    } else {
        // first arg is a logOptions object to be "partially applied"
        let partiallyAppliedLogOptions = {...logOptions, ...messageOrLogOptionsToPartiallyApply};
        // automatically generate lcid if none was provided
        if (!partiallyAppliedLogOptions.lcid) {
            partiallyAppliedLogOptions.lcid = c3prLOG4.lcid();
        }
        return (nextMessageOrLogOptionsToStack?: string | Partial<Log4Options>, nextLogOptions?: Partial<Log4Options>) => {
            return __c3prLOG5(c3prLOG4)(nextMessageOrLogOptionsToStack, {...partiallyAppliedLogOptions, ...nextLogOptions});
        };
    }
};

import c3prLOG4, {Log4Options} from "../c3prLOG4";
export default __c3prLOG5(c3prLOG4);