import { expect } from 'chai';
require("node-c3pr-logger").testMode();

import createForkIfNotExists = require('./createForkIfNotExists');

/**
 * NOTE: this requires the source project exists. And this CREATES a fork permanently.
 */
describe('createForkIfNotExists', () => {

    it('createForkIfNotExists', async () => {

        let r = await createForkIfNotExists('sample_user/sample-project-java-maven');

        expect(r).to.deep.equal({
            "organization":"c3pr-bot",
            "forkName":"sample_user__sample-project-java-maven",
            "cloneUrl":"http://d52b4bc956cd/c3pr-bot/sample_user__sample-project-java-maven.git"
        });

    }).timeout(10 * 1000);

});