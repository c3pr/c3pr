const c3prSH4 = require('./c3prSH4').default;
const expect = require('chai').expect;

describe('c3prSH4', () => {

    it('success', async () => {
        let result = await c3prSH4('echo ok', {}, () => console.log);
        expect(result).to.deep.equal('ok');
    }).timeout(10 * 1000);

    it('error', async () => {
        try {
            await c3prSH4('ecxho ok', {}, () => console.log);
        } catch (e) {
            expect(e.toString()).to.contain('Error: Command failed: ecxho ok');
        }
    }).timeout(10 * 1000);

});