const c3prSH3 = require('./c3prSH3').default;
const expect = require('chai').expect;
require("node-c3pr-logger/c3prLOG4").default.testMode();

describe('c3prSH3', () => {

    it('success', async () => {
        let result = await c3prSH3('echo ok', {}, {ids: [1,2,3]});
        expect(result).to.deep.equal('ok');
    }).timeout(10 * 1000);

    it('error', async () => {
        try {
            await c3prSH3('ecxho ok');
        } catch (e) {
            expect(e.toString()).to.contain('Error: Command failed: ecxho ok');
        }
    }).timeout(10 * 1000);

});