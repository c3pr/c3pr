import { v4 as uuidv4 } from 'uuid';
import * as config from '../src/config';

const mongodb = require('mongodb');
const util = require('util');

import fileAndModule from "../c3prLOG4/fileAndModule";



interface IC3prLOG4 {
    (message: string, options: Log4Options): void;
    lcid(): string;
    testMode(): void;
    isEnvVarSet(): boolean;
}

interface Log4Options {
    lcid: string;
    euuid: string;
    meta?: any;
    error?: Error;
}

function c3prLOG4(message: string, options: Log4Options) {
    if (typeof message !== 'string') {
        throw new Error(`c3prLOG4()'s first argument should be a string! Received(${arguments.length}): ${JSON.stringify(arguments)}`);
    }
    if (arguments.length !== 2) {
        throw new Error(`c3prLOG4() called with different number or arguments. Needed: 2. Received(${arguments.length}): ${JSON.stringify(arguments)}`);
    }
    if (!options.lcid || !options.euuid) {
        throw new Error(`c3prLOG4(): lcid and euuid are mandatory. Full args: ${JSON.stringify(arguments)}`);
    }
    const extraKeys = Object.keys(arguments[1] || {}).filter(key => !["lcid", "euuid", "level", "meta", "error"].includes(key));
    if (extraKeys.length) {
        throw new Error(`c3prLOG4() has too many keys. Additional keys passed: ${JSON.stringify(extraKeys)}. Full args: ${JSON.stringify(arguments)}`);
    }


    const script_name = c3prLOG4.caller.name === "" ? "(anonymous)" : c3prLOG4.caller.name;

    const {stack, service_name} = fileAndModule();

    let {augmentedMsg, augmentedMeta} = augmentWithError(message, stack, options);

    // noinspection JSIgnoredPromiseFromCall
    printAndInsertIntoDatabase({
        message: augmentedMsg,
        lcid: options.lcid,
        euuid: options.euuid,
        service_name,
        script_name,
        meta: augmentedMeta,
        error: options.error
    });
}
// noinspection JSUnusedGlobalSymbols
export default c3prLOG4 as IC3prLOG4;



function augmentWithError(message: string, stack: string[], options: Log4Options) {
    let augmentedMsg = message || '';
    let augmentedMeta = {stack, ...(options.meta || {})};
    if (options.error) {
        const error = options.error;
        augmentedMsg = augmentedMsg.trim() + ` - Error reason: '${error}'. Data: ${(error as any).response && JSON.stringify((error as any).response.data) || '<no data>'}.`;
        augmentedMeta.error = util.inspect(error);
    }
    return {augmentedMsg, augmentedMeta};
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
    euuid: string;
    service_name?: string;
    script_name?: string;
    meta?: any;
    error?: Error;
}

async function printAndInsertIntoDatabase(options: LogData) {
    showWarningIfDatabaseNotDefined();

    console.log(`[${options.lcid}] [${options.euuid}] <${options.script_name}>`, options.message);

    if (!config.c3pr.logger.mongoUrl) {
        return;
    }
    try {
        const client = await mongodb.MongoClient.connect(config.c3pr.logger.mongoUrl, { useNewUrlParser: true });

        let logs = client.db(config.c3pr.logger.database).collection(config.c3pr.logger.collection + '4' + (testModeActivated ? "-test" : ""));

        await logs.insertOne({
            dateTime: new Date().toISOString(),
            node: options.service_name,
            service_name: options.service_name,
            moduleName: options.script_name,
            script_name: options.script_name,
            lcid: options.lcid,
            euuid: options.euuid,
            metadata: options.meta,
            message: options.message
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