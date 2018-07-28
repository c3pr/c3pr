interface IC3prLOG4 {
    (message: string, { lcid, euuid, logMetas, ids, meta, error, level }: {
        lcid: string;
        euuid: string;
        logMetas?: any;
        ids?: (string | number)[];
        meta?: any;
        error?: Error;
        level?: number;
    }): void;
    logMetasToIds(lms: any[]): (string | number)[];
    lcid(): string;
    testMode(): void;
    isEnvVarSet(): boolean;
}
declare const _default: IC3prLOG4;
export default _default;
