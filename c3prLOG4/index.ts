import {v4 as uuidv4} from 'uuid';
import * as config from '../src/config';

import * as mongodb from 'mongodb';
import * as util from 'util';

import functionScriptFileDetector from './functionScriptFileDetector';
import hideTokens from "./hideTokens";


export interface IC3prLOG4 {
    (message: string, options: Log4Options): any;
    lcid(): string;
    testMode(): void;
    isEnvVarSet(): boolean;
}

export interface Log4Options {
    lcid: string;
    sha: string;
    euuid: string;
    hide?: (string | {[key: string]: string})[]
    meta?: any;
    error?: Error;
    level?: number;
    service_name?: string;
    caller_name?: string;
}

function c3prLOG4(message: string, options: Log4Options) {
    if (typeof message !== 'string') {
        throw new Error(`c3prLOG4()'s first argument should be a string! Received(${arguments.length}): ${JSON.stringify(arguments)}`);
    }
    if (arguments.length !== 2) {
        throw new Error(`c3prLOG4() called with different number or arguments. Needed: 2. Received(${arguments.length}): ${JSON.stringify(arguments)}`);
    }
    if (!options.lcid || !options.sha || !options.euuid) {
        throw new Error(`c3prLOG4(): lcid, sha and euuid are mandatory. Full args: ${JSON.stringify(arguments)}`);
    }
    const unknownKeys = Object.keys(options).filter(key => !["lcid", "sha", "euuid", "level", "meta", "error", "hide", "service_name", "caller_name"].includes(key));
    if (unknownKeys.length) {
        throw new Error(`c3prLOG4() has unknown keys.\nAdditional keys passed: ${JSON.stringify(unknownKeys)}.\nFull args: ${JSON.stringify(arguments)}`);
    }

    const {stack, service_name, caller_name} = functionScriptFileDetector((options.level || 0) + 1);

    return printAndInsertIntoDatabase({
        message: hideTokens(augmentWithError(message, options), options.hide),
        lcid: options.lcid,
        sha: options.sha,
        euuid: options.euuid,
        service_name: options.service_name || service_name,
        caller_name: options.caller_name || caller_name,
        meta: {stack, ...options.meta},
        error: options.error
    });
}
// noinspection JSUnusedGlobalSymbols
export default c3prLOG4 as IC3prLOG4;



function augmentWithError(message: string, options: Log4Options) {
    if (options.error) {
        const e = options.error as any;
        return (message || '').trim() + ` - Error reason: '${e}'. Data: ${e.response && JSON.stringify(e.response.data) || '<no data>'}.`;
    }
    return message || '';
}



(c3prLOG4 as IC3prLOG4).lcid = function () {
    // noinspection TypeScriptValidateJSTypes
    return uuidv4().split("-")[4];
};



let testModeActivated = false;
(c3prLOG4 as IC3prLOG4).testMode = () => testModeActivated = true;



(c3prLOG4 as IC3prLOG4).isEnvVarSet = () => !!config && !!config.c3pr && !!config.c3pr.logger.mongoUrl;



interface LogData {
    message: string;
    lcid: string;
    sha: string;
    euuid: string;
    service_name?: string;
    caller_name?: string;
    meta?: any;
    error?: Error;
}

function printShort(euuid: string) {
    const split = euuid.split('-');
    if (split.length === 5) {
        return split[0];
    }
    return euuid;
}

async function printAndInsertIntoDatabase(options: LogData) {
    showWarningIfDatabaseNotDefined();

    console.log(`[${options.lcid}][${options.sha.substring(0, 7)}][${printShort(options.euuid)}] <${options.caller_name}>`, options.message);

    if (!config.c3pr.logger.mongoUrl) {
        return;
    }
    try {
        // @ts-ignore
        const client = await mongodb.MongoClient.connect(config.c3pr.logger.mongoUrl, {
            // option below is commented because we downgraded mongodb, as the 3.1.* didn't work well with rollup (of c3pr-agent)
            //useNewUrlParser: true
        });

        let logs = client.db(config.c3pr.logger.database).collection(config.c3pr.logger.collection + '4' + (testModeActivated ? "-test" : ""));

        await logs.insertOne({
            date_time: new Date().toISOString(),
            service_name: options.service_name,
            caller_name: options.caller_name,
            lcid: options.lcid,
            sha: options.sha,
            euuid: options.euuid,
            metadata: options.meta,
            message: options.message,
            error: options.error && util.inspect(options.error)
        });
        await client.close();
    } catch (e) {
        showWarning(`Error while attempting to connect/save log message: ${e}`);
    }
}

let _warningShown = {};
function showWarning (warningMsg: string) {
    if (!_warningShown[warningMsg]) {
        console.log(`*** [note-c3pr-logger] ${warningMsg} (This message will be printed only once every 5 minutes.)`);
        _warningShown[warningMsg] = true;
        setTimeout(() => {
            _warningShown[warningMsg] = false;
        }, 5 * 60 * 1000).unref();
    }
}
function showWarningIfDatabaseNotDefined() {
    if (!config.c3pr.logger.mongoUrl) {
        showWarning('Logs: C3PR_MONGO_URL env var is not defined. Printing to STDOUT only.');
    }
}