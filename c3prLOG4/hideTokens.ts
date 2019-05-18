const DEFAULT_REPLACEMENT_CHAR = '*';

function normalize(arr) {
    return (arr || []).reduce((acc, x) => {
        if (typeof x === 'string') {
            return acc.concat([[x, DEFAULT_REPLACEMENT_CHAR.repeat(x.length)]]);
        } else {
            return acc.concat(Object.entries(x));
        }
    }, []);
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
}

function hideTokens(message: string, hide: (string | {[key: string]: string})[]) {
    let newMessage = message;
    normalize(hide).forEach(([wordToHide, replacementValue]) => {
        newMessage = replaceAll(newMessage, wordToHide, replacementValue);
    });
    return newMessage;
}

export default hideTokens;