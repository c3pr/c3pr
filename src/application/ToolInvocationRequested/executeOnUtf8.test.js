require("node-c3pr-logger").testMode();
const executeOnUtf8 = require('./executeOnUtf8');

const path = require('path');
const chardet = require('chardet');
const expect = require('chai').expect;

const config = require('../../config');

config.c3pr.agent.cloneDir = '/tmp/c3pr/test';
config.c3pr.agent.cloneDepth = 5;

const ISO_8859_1 = 'ISO-8859-1';
const UTF_8 = 'UTF-8';

describe('executeOnUtf8', () => {

    it('executeOnUtf8', async () => {

        const testFileName = 'executeOnUtf8.testfile.txt';

        const fillTestFileName = path.resolve(__dirname, testFileName);

        const before = chardet.detectFileSync(fillTestFileName);
        let during;
        await executeOnUtf8(__dirname, testFileName, () => {
            during = chardet.detectFileSync(fillTestFileName);
        });
        const after = chardet.detectFileSync(fillTestFileName);

        // noinspection JSUnusedAssignment
        expect({before, during, after}).to.deep.equal(
            {
                before: ISO_8859_1,
                during: UTF_8,
                after: ISO_8859_1
            }
        );

    }).timeout(10 * 1000);

});