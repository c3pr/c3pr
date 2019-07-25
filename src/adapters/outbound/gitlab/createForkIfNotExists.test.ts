import { expect } from 'chai';
import {createForkIfNotExists} from "./createForkIfNotExists";
require("node-c3pr-logger/c3prLOG4").default.testMode();

const fakeLog = (...a) => { console.log(...a); return fakeLog; };

/**
 * NOTE: this requires the source project exists. And this CREATES a fork permanently.
 */
describe('createForkIfNotExists', () => {

    it('createForkIfNotExists', async () => {

        let r = await createForkIfNotExists('sample_user/sample-project-java-maven', fakeLog);

        expect(r).to.deep.equal({
            "organization":"c3pr-bot",
            "forkName":"sample_user__sample-project-java-maven",
            "cloneUrl":"http://d52b4bc956cd/c3pr-bot/sample_user__sample-project-java-maven.git"
        });

    }).timeout(10 * 1000);

});