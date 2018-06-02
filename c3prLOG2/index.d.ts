export interface Log {
    msg: string;
    logMetas?: any[];
    meta?: any;
    error?: any;
}
export declare const c3pr: {
    c3prLOG2({ msg, logMetas, meta, error: e }: Log): void;
};
export declare const c3prLOG2: ({ msg, logMetas, meta, error: e }: Log) => void;
