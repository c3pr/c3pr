declare function c3prLOG3({ msg, level, ids, meta, error }: {
    msg: string;
    level?: number;
    ids?: (string | number)[];
    meta?: any;
    error?: Error;
}): void;
export default c3prLOG3;
