// automatically generate lcid if none was provided
function generateLcidIfNoneWasProvided(logOptions, c3prLOG4) {
    if (!logOptions.lcid) {
        return {...logOptions, lcid: c3prLOG4.lcid()};
    }
    return logOptions;
}

function addExclamationToInvalidSha(logOptions) {
    return {...logOptions, ...(logOptions.sha && {sha: /^[0-9a-z]{40}$|^!/.test(logOptions.sha) ? logOptions.sha : '!'+logOptions.sha}),};
}

function copyShaIntoEuuidIfEmpty(logOptions) {
    return {...(logOptions.sha && {euuid: logOptions.sha}), ...logOptions};
}

export const __c3prLOG5 = (c3prLOG4) => (messageOrLogOptionsToPartiallyApply?: string | Partial<Log4Options>, logOptions?: Partial<Log4Options>) => {
    if (typeof messageOrLogOptionsToPartiallyApply === "string") {
        // first arg is a message, proceed to actual call
        return c3prLOG4(messageOrLogOptionsToPartiallyApply, copyShaIntoEuuidIfEmpty(addExclamationToInvalidSha(generateLcidIfNoneWasProvided(logOptions || {}, c3prLOG4))));
    } else {
        // first arg is a logOptions object to be "partially applied"
        let partiallyAppliedLogOptions = {...logOptions, ...messageOrLogOptionsToPartiallyApply};

        partiallyAppliedLogOptions = copyShaIntoEuuidIfEmpty(addExclamationToInvalidSha(generateLcidIfNoneWasProvided(partiallyAppliedLogOptions, c3prLOG4)));

        const nextCall = (nextMessageOrLogOptionsToStack?: string | Partial<Log4Options>, nextLogOptions?: Partial<Log4Options>) => {
            return __c3prLOG5(c3prLOG4)(nextMessageOrLogOptionsToStack, {...partiallyAppliedLogOptions, ...nextLogOptions});
        };
        (nextCall as any).lcid = partiallyAppliedLogOptions.lcid;
        (nextCall as any).sha = partiallyAppliedLogOptions.sha;
        (nextCall as any).euuid = partiallyAppliedLogOptions.euuid;
        return nextCall;
    }
};

import c3prLOG4, {Log4Options} from "../c3prLOG4";
export default __c3prLOG5(c3prLOG4);