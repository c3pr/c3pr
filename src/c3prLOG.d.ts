declare const mongodb: any;
declare const config: any;
declare function wrap(arr: any, prefix?: string, suffix?: string): any;
declare let warningShown: {};
declare function showWarning(warningMsg: string): void;
declare function showWarningIfDatabaseNotDefined(): void;
declare const emptyLogMeta: {
    nodeName: string;
    correlationIds: string[];
    moduleNames: string[];
}[];
declare const emptyNodeName: {
    nodeName: string;
};
declare function logWithMeta(message: string, metadata: any, logMetasArg: LogMeta[]): Promise<void>;
declare function log(nodeName: string, correlationIds: string[], moduleNames: string[], message: string, metadata: any): Promise<void>;
interface C3prLOG {
    (): Promise<any>;
    testMode(): void;
    isEnvVarSet(): boolean;
}
interface LogMeta {
    nodeName: string;
    correlationId?: string;
    moduleName?: string;
    correlationIds?: string | string[];
    moduleNames?: string | string[];
}
declare function isLogMeta(o: any): boolean;
declare const c3prLOG: C3prLOG;
