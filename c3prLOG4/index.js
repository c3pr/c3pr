"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var config = require("../src/config");
var mongodb = require("mongodb");
var util = require("util");
var functionScriptFileDetector_1 = require("./functionScriptFileDetector");
var hideTokens_1 = require("./hideTokens");
function c3prLOG4(message, options) {
    if (typeof message !== 'string') {
        throw new Error("c3prLOG4()'s first argument should be a string! Received(" + arguments.length + "): " + JSON.stringify(arguments));
    }
    if (arguments.length !== 2) {
        throw new Error("c3prLOG4() called with different number or arguments. Needed: 2. Received(" + arguments.length + "): " + JSON.stringify(arguments));
    }
    if (!options.lcid || !options.sha || !options.euuid) {
        throw new Error("c3prLOG4(): lcid, sha and euuid are mandatory. Full args: " + JSON.stringify(arguments));
    }
    var extraKeys = Object.keys(arguments[1] || {}).filter(function (key) { return !["lcid", "sha", "euuid", "level", "meta", "error"].includes(key); });
    if (extraKeys.length) {
        throw new Error("c3prLOG4() has too many keys. Additional keys passed: " + JSON.stringify(extraKeys) + ". Full args: " + JSON.stringify(arguments));
    }
    var _a = functionScriptFileDetector_1.default((options.level || 0) + 1), stack = _a.stack, service_name = _a.service_name, caller_name = _a.caller_name;
    return printAndInsertIntoDatabase({
        message: hideTokens_1.default(augmentWithError(message, options), options.hide),
        lcid: options.lcid,
        sha: options.sha,
        euuid: options.euuid,
        service_name: service_name,
        caller_name: caller_name,
        meta: __assign({ stack: stack }, options.meta),
        error: options.error
    });
}
// noinspection JSUnusedGlobalSymbols
exports.default = c3prLOG4;
function augmentWithError(message, options) {
    if (options.error) {
        var e = options.error;
        return (message || '').trim() + (" - Error reason: '" + e + "'. Data: " + (e.response && JSON.stringify(e.response.data) || '<no data>') + ".");
    }
    return message || '';
}
c3prLOG4.lcid = function () {
    // noinspection TypeScriptValidateJSTypes
    return uuid_1.v4().split("-")[4];
};
var testModeActivated = false;
c3prLOG4.testMode = function () { return testModeActivated = true; };
c3prLOG4.isEnvVarSet = function () { return !!config && !!config.c3pr && !!config.c3pr.logger.mongoUrl; };
function printShort(euuid) {
    var split = euuid.split('-');
    if (split.length === 5) {
        return split[0];
    }
    return euuid;
}
function printAndInsertIntoDatabase(options) {
    return __awaiter(this, void 0, void 0, function () {
        var client, logs, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    showWarningIfDatabaseNotDefined();
                    console.log("[" + options.lcid + "][" + options.sha.substring(0, 7) + "][" + printShort(options.euuid) + "] <" + options.caller_name + ">", options.message);
                    if (!config.c3pr.logger.mongoUrl) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, mongodb.MongoClient.connect(config.c3pr.logger.mongoUrl, {
                        // option below is commented because we downgraded mongodb, as the 3.1.* didn't work well with rollup (of c3pr-agent)
                        //useNewUrlParser: true
                        })];
                case 2:
                    client = _a.sent();
                    logs = client.db(config.c3pr.logger.database).collection(config.c3pr.logger.collection + '4' + (testModeActivated ? "-test" : ""));
                    return [4 /*yield*/, logs.insertOne({
                            date_time: new Date().toISOString(),
                            service_name: options.service_name,
                            caller_name: options.caller_name,
                            lcid: options.lcid,
                            sha: options.sha,
                            euuid: options.euuid,
                            metadata: options.meta,
                            message: options.message,
                            error: options.error && util.inspect(options.error)
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, client.close()];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    e_1 = _a.sent();
                    showWarning("Error while attempting to connect/save log message: " + e_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
var _warningShown = {};
function showWarning(warningMsg) {
    if (!_warningShown[warningMsg]) {
        console.log("*** [note-c3pr-logger] " + warningMsg + " (This message will be printed only once every 5 minutes.)");
        _warningShown[warningMsg] = true;
        setTimeout(function () {
            _warningShown[warningMsg] = false;
        }, 5 * 60 * 1000).unref();
    }
}
function showWarningIfDatabaseNotDefined() {
    if (!config.c3pr.logger.mongoUrl) {
        showWarning('Logs: C3PR_MONGO_URL env var is not defined. Printing to STDOUT only.');
    }
}
