const expect = require('chai').expect;
const c3prRegistry = require('./c3prRegistry');

const initialRegistry = [
    {key: "registryUrl", value: "http://localhost:5000/api/v1/registry", timeout: -1},
    {key: "mongoLogsUriIsSet", value: true, timeout: -1},
    {key: "mongoLogsDatabase", value: "c3pr", timeout: -1},
    {key: "mongoLogsCollection", value: "logs", timeout: -1}
];

describe('c3prRegistry', function () {
    it('c3prRegistry debug', function () {
        expect(c3prRegistry.debug).to.deep.equal(initialRegistry);
    });

    it('c3prRegistry registry', function () {
        expect(c3prRegistry.registry).to.deep.equal({
            mongoLogsUriIsSet: true,
            mongoLogsDatabase: "c3pr",
            mongoLogsCollection: "logs",
            registryUrl: "http://localhost:5000/api/v1/registry"
        });
    });

    it('c3prRegistry addEntry', function () {
        c3prRegistry.addEntry({key: "aaa", value: "bbb", timeout: 9999});
        expect(c3prRegistry.debug).to.deep.equal([
            ...initialRegistry,
            {key: "aaa", value: "bbb", timeout: 9999}
        ]);
    });

    it('c3prRegistry interval should decrease timeout', function (done) {
        c3prRegistry.addEntry({key: "aaa", value: "bbb", timeout: 3000});
        expect(c3prRegistry.debug[c3prRegistry.debug.length-1]).to.deep.equal({key: "aaa", value: "bbb", timeout: 3000});
        setTimeout(() => {
            expect(c3prRegistry.debug[c3prRegistry.debug.length-1]).to.deep.equal({key: "aaa", value: "bbb", timeout: 500});
            done();
        }, c3prRegistry.cleanRegistryStepInMs + 200);
    }).timeout(6000);

    it('c3prRegistry interval should NOT decrease when timeout is -1', function (done) {
        c3prRegistry.addEntry({key: "aaa", value: "bbb", timeout: -1});
        expect(c3prRegistry.debug[c3prRegistry.debug.length-1]).to.deep.equal({key: "aaa", value: "bbb", timeout: -1});
        setTimeout(() => {
            expect(c3prRegistry.debug[c3prRegistry.debug.length-1]).to.deep.equal({key: "aaa", value: "bbb", timeout: -1});
            done();
        }, c3prRegistry.cleanRegistryStepInMs + 200);
    }).timeout(6000);

});