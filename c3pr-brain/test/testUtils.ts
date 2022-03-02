
export function simpleAxiosMock(returns: Array<any> | any) {
    return {
        _calledArguments: [],
        get calledArguments() {
            return this._calledArguments.length === 1 ? this._calledArguments[0] : this._calledArguments;
        },
        returns: Array.isArray(returns) ? returns : [returns],
        get(...args) {
            this._calledArguments.push(args);
            return returns[this._calledArguments.length - 1];
        }
    };
}

export function createDeepObject(propsNamesValues) {
    const deepObject = {};
    Object.entries(propsNamesValues).forEach(([name, value]) => deepSet(deepObject, name, value));
    return deepObject;
}

export function deepSet(obj, prop, value) {
    if (typeof prop === "string")
        prop = prop.split(".");

    if (prop.length > 1) {
        const e = prop.shift();
        deepSet(obj[e] = Object.prototype.toString.call(obj[e]) === "[object Object]" ? obj[e] : {}, prop, value);
    } else {
        obj[prop[0]] = value;
    }
}