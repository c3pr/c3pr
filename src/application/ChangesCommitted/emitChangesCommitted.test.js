require("node-c3pr-logger").testMode();
process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
require('chai').should();

const emitChangesCommitted = require('./emitChangesCommitted');

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const axiosMock = new MockAdapter(axios);

const config = require('../../config');
config.c3pr.patchesUrl = 'http://changes-server/patches';


describe('emitChangesCommitted', () => {

    it('emitChangesCommitted', async () => {

        const changesCommitted = {
            repository: {
                clone_url_http: "https://github.com/c3pr/sample-project-java-maven.git",
                revision: "13b7eedacc076e8a16ae565b535fd48edb9a044a"
            }
        };

        let changesCommittedEmitted = false;
        axiosMock
            .onPost(
                `${config.c3pr.hub.c3prHubUrl}/api/v1/events/ChangesCommitted`,
                changesCommitted
            ).reply(() => { changesCommittedEmitted = true; return [200]; });

        // execute
        await emitChangesCommitted(changesCommitted);

        // verify
        expect(changesCommittedEmitted).to.equal(true);
    });

});

