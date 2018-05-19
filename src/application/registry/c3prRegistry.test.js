const expect = require('chai').expect;
const c3prRegistry = require('./c3prRegistry');

const initialRegistry = [];

describe('c3prRegistry', function () {
    it('c3prRegistry debug', function () {
        expect(c3prRegistry.debug).to.deep.equal(initialRegistry);
    });

    it('c3prRegistry registry', function () {
        expect(c3prRegistry.registry).to.deep.equal({});
    });

    it('c3prRegistry put single entry', function () {
        c3prRegistry.put({key: "aaa", value: "bbb", timeout: 9999});
        expect(c3prRegistry.debug).to.deep.equal([
            ...initialRegistry,
            {key: "aaa", value: "bbb", timeout: 9999}
        ]);
        expect(c3prRegistry.registry).to.deep.equal({
            aaa: "bbb"
        });
    });

    it('c3prRegistry put array of entries', function () {
        c3prRegistry.put([{key: "aa", value: "bb", timeout: 9999}, {key: "cc", value: "dd", timeout: 8888}]);

        expect(c3prRegistry.debug[c3prRegistry.debug.length-2]).to.deep.equal({key: "aa", value: "bb", timeout: 9999});
        expect(c3prRegistry.debug[c3prRegistry.debug.length-1]).to.deep.equal({key: "cc", value: "dd", timeout: 8888});
    });

    it('c3prRegistry interval should decrease timeout', function (done) {
        c3prRegistry.put({key: "aaa", value: "bbb", timeout: 3000});
        expect(c3prRegistry.debug[c3prRegistry.debug.length-1]).to.deep.equal({key: "aaa", value: "bbb", timeout: 3000});
        setTimeout(() => {
            expect(c3prRegistry.debug[c3prRegistry.debug.length-1]).to.deep.equal({key: "aaa", value: "bbb", timeout: 500});
            done();
        }, c3prRegistry.cleanRegistryStepInMs + 200);
    }).timeout(6000);

    it('c3prRegistry interval should NOT decrease when timeout is -1', function (done) {
        c3prRegistry.put({key: "aaa", value: "bbb", timeout: -1});
        expect(c3prRegistry.debug[c3prRegistry.debug.length-1]).to.deep.equal({key: "aaa", value: "bbb", timeout: -1});
        setTimeout(() => {
            expect(c3prRegistry.debug[c3prRegistry.debug.length-1]).to.deep.equal({key: "aaa", value: "bbb", timeout: -1});
            done();
        }, c3prRegistry.cleanRegistryStepInMs + 200);
    }).timeout(6000);

});