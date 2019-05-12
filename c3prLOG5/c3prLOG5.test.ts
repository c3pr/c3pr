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

        c3prLOG5({lcid: '1'})({lcid: '2'})({sha: 'mn65vbn4m65vb4nmvb654nm64bn6654fed639dc7'})({euuid: '4'})('msg', {meta: 'meta-stuff'});

        expect(calls).to.deep.equal([['msg', {lcid: '2', sha: 'mn65vbn4m65vb4nmvb654nm64bn6654fed639dc7', euuid: '4', meta: 'meta-stuff'}]]);

    });

    it('no-arg calls', () => {

        let calls = [];
        const c3prLOG5 = __c3prLOG5(logFake(calls, () => 'should-be-overriden'));

        c3prLOG5()({lcid: '1'})({lcid: '2'})()()()()({sha: 'fgfb645xcvb4c6vb45xcv465b645vcx454539dc7'})({lcid: '4', euuid: '5'})('msg');

        expect(calls).to.deep.equal([['msg', {lcid: '4', sha: 'fgfb645xcvb4c6vb45xcv465b645vcx454539dc7', euuid: '5'}]]);

    });

    it('override at last call', () => {

        let calls = [];
        const c3prLOG5 = __c3prLOG5(logFake(calls));

        c3prLOG5({lcid: '1'})({lcid: '2'})()()()()({sha: '3'})({lcid: '4', euuid: '5'})('msg', {meta: 'meta-stuff', lcid: '6', sha: '564fdgs654fg56sdf4f66s45df456e1fed639dc7', euuid: '9'});

        expect(calls).to.deep.equal([['msg', {lcid: '6', sha: '564fdgs654fg56sdf4f66s45df456e1fed639dc7', euuid: '9', meta: 'meta-stuff'}]]);

    });

    it('lcid should be generated if none was provided', () => {

        let calls = [];
        const c3prLOG5 = __c3prLOG5(logFake(calls, () => 'generated-lcid'));

        c3prLOG5({sha: 'popoghdfg8h7gfh7hgfd9fgh7h8df7gfed639dc7', euuid: '2'})('msg');

        expect(calls).to.deep.equal([['msg', {lcid: 'generated-lcid', sha: 'popoghdfg8h7gfh7hgfd9fgh7h8df7gfed639dc7', euuid: '2'}]]);

    });

    it('direct call without lcid also generates one', () => {

        let calls = [];
        const c3prLOG5 = __c3prLOG5(logFake(calls, () => 'generated-lcid'));

        c3prLOG5('msg', {sha: 'da9fas78df6asd7d6f9d69d6fs76as1fed639dc7', euuid: '2'});

        expect(calls).to.deep.equal([['msg', {lcid: 'generated-lcid', sha: 'da9fas78df6asd7d6f9d69d6fs76as1fed639dc7', euuid: '2'}]]);

    });

    it('lcid/sha/euuid should be available as props', () => {

        const c3prLOG5 = __c3prLOG5(logFake([]));

        const _c3prLOG5 = c3prLOG5({lcid: '1', sha: '37359045435234562435234534345e1fed639dc7', euuid: '3'});
        expect(_c3prLOG5.lcid).to.deep.equal('1');
        expect(_c3prLOG5.sha).to.deep.equal('37359045435234562435234534345e1fed639dc7');
        expect(_c3prLOG5.euuid).to.deep.equal('3');
        expect({..._c3prLOG5}).to.deep.equal({lcid: '1', sha: '37359045435234562435234534345e1fed639dc7', euuid: '3'});

        const ___c3prLOG5 = _c3prLOG5()({lcid: '11'})({sha: 'dsfadf342352335454323fhggfhdfghdfghgfdc7'})({euuid: '33'})();
        expect(___c3prLOG5.lcid).to.deep.equal('11');
        expect(___c3prLOG5.sha).to.deep.equal('dsfadf342352335454323fhggfhdfghdfghgfdc7');
        expect(___c3prLOG5.euuid).to.deep.equal('33');
        expect({...___c3prLOG5}).to.deep.equal({lcid: '11', sha: 'dsfadf342352335454323fhggfhdfghdfghgfdc7', euuid: '33'});

    });

    it('sha, when there\'s no euuid, assigns sha\'s value to euuid as well', () => {

        let calls = [];
        const c3prLOG5 = __c3prLOG5(logFake(calls));

        c3prLOG5('msg', {lcid: 'lc', sha: '37359043bb3a17114b6c3652bed25e1fed639dc7'});

        expect(calls).to.deep.equal([['msg', {lcid: 'lc', sha: '37359043bb3a17114b6c3652bed25e1fed639dc7', euuid: '37359043bb3a17114b6c3652bed25e1fed639dc7'}]]);

    });

    it('empty options', () => {

        let calls = [];
        const c3prLOG5 = __c3prLOG5(logFake(calls, () => 'generated-lcid'));

        c3prLOG5('msg');

        expect(calls).to.deep.equal([['msg', {lcid: 'generated-lcid'}]]);

    });

    describe('non-sha shas', () => {

        it('dont add ! to valid sha - direct call', () => {
            let calls = [];
            const c3prLOG5 = __c3prLOG5(logFake(calls, () => 'generated-lcid'));

            c3prLOG5('msg', {sha: '37359043bb3a17114b6c3652bed25e1fed639dc7'});

            expect(calls).to.deep.equal([['msg', {lcid: 'generated-lcid', sha: '37359043bb3a17114b6c3652bed25e1fed639dc7', euuid: '37359043bb3a17114b6c3652bed25e1fed639dc7'}]]);
        });

        it('dont add ! to valid sha - previously partially applied call', () => {
            let calls = [];
            const c3prLOG5 = __c3prLOG5(logFake(calls, () => 'generated-lcid'));

            c3prLOG5()({sha: '37359043bb3a17114b6c3652bed25e1fed639dc7'})('msg');

            expect(calls).to.deep.equal([['msg', {lcid: 'generated-lcid', sha: '37359043bb3a17114b6c3652bed25e1fed639dc7', euuid: '37359043bb3a17114b6c3652bed25e1fed639dc7'}]]);
        });

        it('add ! to invalid sha - direct call', () => {
            let calls = [];
            const c3prLOG5 = __c3prLOG5(logFake(calls, () => 'generated-lcid'));

            c3prLOG5('msg', {sha: 'my-express-something'});

            expect(calls).to.deep.equal([['msg', {lcid: 'generated-lcid', sha: '!my-express-something', euuid: '!my-express-something'}]]);
        });

        it('add ! to invalid sha - previously partially applied call', () => {
            let calls = [];
            const c3prLOG5 = __c3prLOG5(logFake(calls, () => 'generated-lcid'));

            c3prLOG5()({sha: 'my-express-something'})('msg');

            expect(calls).to.deep.equal([['msg', {lcid: 'generated-lcid', sha: '!my-express-something', euuid: '!my-express-something'}]]);
        });

        it('dont add duplicated ! to invalid sha - direct call', () => {
            let calls = [];
            const c3prLOG5 = __c3prLOG5(logFake(calls, () => 'generated-lcid'));

            c3prLOG5('msg', {sha: '!my-express-something'});

            expect(calls).to.deep.equal([['msg', {lcid: 'generated-lcid', sha: '!my-express-something', euuid: '!my-express-something'}]]);
        });

        it('dont add duplicated ! to invalid sha - previously partially applied call', () => {
            let calls = [];
            const c3prLOG5 = __c3prLOG5(logFake(calls, () => 'generated-lcid'));

            c3prLOG5()({sha: '!my-express-something'})('msg');

            expect(calls).to.deep.equal([['msg', {lcid: 'generated-lcid', sha: '!my-express-something', euuid: '!my-express-something'}]]);
        });

    });

});

