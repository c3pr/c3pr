declare function c3prLOG3(message: string, { ids, meta, error, level }: {
    ids?: (string | number)[];
    meta?: any;
    error?: Error;
    level?: number;
}): void;
export default c3prLOG3;
export declare function logMetasToIds(...logMetas: any[]): Promise<any[]>;
