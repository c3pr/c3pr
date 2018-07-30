import { expect } from 'chai';
import {createForkIfNotExists} from "./createForkIfNotExists";
require("node-c3pr-logger").testMode();


/**
 * NOTE: this requires the source project exists. And this CREATES a fork permanently.
 */
describe('createForkIfNotExists', () => {

    it('createForkIfNotExists', async () => {

        let r = await createForkIfNotExists('sample_user/sample-project-java-maven', {lcid: 'test', euuid: 'test'});

        expect(r).to.deep.equal({
            "organization":"c3pr-bot",
            "forkName":"sample_user__sample-project-java-maven",
            "cloneUrl":"http://d52b4bc956cd/c3pr-bot/sample_user__sample-project-java-maven.git"
        });

    }).timeout(10 * 1000);

});