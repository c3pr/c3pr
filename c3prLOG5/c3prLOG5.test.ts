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

        c3prLOG5({lcid: '1'})({lcid: '2'})({sha: '3'})({euuid: '4'})('msg', {meta: 'meta-stuff'});

        expect(calls).to.deep.equal([['msg', {lcid: '2', sha: '3', euuid: '4', meta: 'meta-stuff'}]]);

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

        c3prLOG5({sha: '1', euuid: '2'})('msg');

        expect(calls).to.deep.equal([['msg', {lcid: 'generated-lcid', sha: '1', euuid: '2'}]]);

    });

    it('direct call without lcid also generates one', () => {

        let calls = [];
        const c3prLOG5 = __c3prLOG5(logFake(calls, () => 'generated-lcid'));

        c3prLOG5('msg', {sha: '1x', euuid: '2'});

        expect(calls).to.deep.equal([['msg', {lcid: 'generated-lcid', sha: '1x', euuid: '2'}]]);

    });

    it('lcid/sha/euuid should be available as props', () => {

        const c3prLOG5 = __c3prLOG5(logFake([]));

        const _c3prLOG5 = c3prLOG5({lcid: '1', sha: '2', euuid: '3'});
        expect(_c3prLOG5.lcid).to.deep.equal('1');
        expect(_c3prLOG5.sha).to.deep.equal('2');
        expect(_c3prLOG5.euuid).to.deep.equal('3');
        expect({..._c3prLOG5}).to.deep.equal({lcid: '1', sha: '2', euuid: '3'});

        const ___c3prLOG5 = _c3prLOG5()({lcid: '11'})({sha: '22'})({euuid: '33'})();
        expect(___c3prLOG5.lcid).to.deep.equal('11');
        expect(___c3prLOG5.sha).to.deep.equal('22');
        expect(___c3prLOG5.euuid).to.deep.equal('33');
        expect({...___c3prLOG5}).to.deep.equal({lcid: '11', sha: '22', euuid: '33'});

    });

    it('sha, when there\'s no euuid, assigns sha\'s value to euuid as well', () => {

        let calls = [];
        const c3prLOG5 = __c3prLOG5(logFake(calls));

        c3prLOG5('msg', {lcid: 'lc', sha: 'sh'});

        expect(calls).to.deep.equal([['msg', {lcid: 'lc', sha: 'sh', euuid: 'sh'}]]);

    });

    it('empty options', () => {

        let calls = [];
        const c3prLOG5 = __c3prLOG5(logFake(calls, () => 'generated-lcid'));

        c3prLOG5('msg');

        expect(calls).to.deep.equal([['msg', {lcid: 'generated-lcid'}]]);

    });

});

