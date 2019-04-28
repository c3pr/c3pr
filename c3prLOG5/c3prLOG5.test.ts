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

    it('basic', () => {

        let calls = [];
        const c3prLOG5 = __c3prLOG5(logFake(calls));

        c3prLOG5({lcid: '1'})({lcid: '2'})({sha: '3'})('msg', {meta: 'meta-stuff'});

        expect(calls).to.deep.equal([['msg', {lcid: '2', sha: '3', meta: 'meta-stuff'}]]);

    });

    it('no-arg calls', () => {

        let calls = [];
        const c3prLOG5 = __c3prLOG5(logFake(calls, () => 'should-be-overriden'));

        c3prLOG5()({lcid: '1'})({lcid: '2'})()()()()({sha: '3'})({lcid: '4', euuid: '5'})('msg');

        expect(calls).to.deep.equal([['msg', {lcid: '4', sha: '3', euuid: '5'}]]);

    });

    it('override at last call', () => {

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

    it('lcid/sha/euuid should be available as props', () => {

        const c3prLOG5 = __c3prLOG5(logFake([]));

        const _c3prLOG5 = c3prLOG5({lcid: '1', sha: '2', euuid: '3'});
        expect(_c3prLOG5.lcid).to.deep.equal('1');
        expect(_c3prLOG5.sha).to.deep.equal('2');
        expect(_c3prLOG5.euuid).to.deep.equal('3');

        const ___c3prLOG5 = _c3prLOG5()()();
        expect(___c3prLOG5.lcid).to.deep.equal('1');
        expect(___c3prLOG5.sha).to.deep.equal('2');
        expect(___c3prLOG5.euuid).to.deep.equal('3');

    });

});

