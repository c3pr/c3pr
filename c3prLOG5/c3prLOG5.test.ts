import {expect} from 'chai';
import {__c3prLOG5} from "./index";

function logFake(callsRecord, lcidGenerator?) {
    const logFunction = function (...a) {
        callsRecord.push(a);
    };
    logFunction.lcid = lcidGenerator;
    return logFunction;
}

describe('c3prLOG5', () => {

    it('c3prLOG5 basic', () => {

        let calls = [];
        const c3prLOG5 = __c3prLOG5(logFake(calls));

        c3prLOG5({lcid: '1'})({lcid: '2'})({sha: '3'})('msg', {meta: 'meta-stuff'});

        expect(calls).to.deep.equal([['msg', {lcid: '2', sha: '3', meta: 'meta-stuff'}]]);

    });

    it('c3prLOG5 empty calls', () => {

        let calls = [];
        const c3prLOG5 = __c3prLOG5(logFake(calls, () => 'should-be-overriden'));

        c3prLOG5()({lcid: '1'})({lcid: '2'})()()()()({sha: '3'})({lcid: '4', euuid: '5'})('msg');

        expect(calls).to.deep.equal([['msg', {lcid: '4', sha: '3', euuid: '5'}]]);

    });

    it('c3prLOG5 override at last', () => {

        let calls = [];
        const c3prLOG5 = __c3prLOG5(logFake(calls));

        c3prLOG5({lcid: '1'})({lcid: '2'})()()()()({sha: '3'})({lcid: '4', euuid: '5'})('msg', {meta: 'meta-stuff', lcid: '6', sha: '7', euuid: '9'});

        expect(calls).to.deep.equal([['msg', {lcid: '6', sha: '7', euuid: '9', meta: 'meta-stuff'}]]);

    });

    it('lcid should be generated if none was provided', () => {

        let calls = [];
        const c3prLOG5 = __c3prLOG5(logFake(calls, () => 'generated-lcid'));

        c3prLOG5({sha: '1'})('msg');

        expect(calls).to.deep.equal([['msg', {lcid: 'generated-lcid', sha: '1'}]]);

    });

});

