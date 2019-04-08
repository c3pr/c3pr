import {emitChangesCommitted} from "./emitChangesCommitted";

require("node-c3pr-logger").testMode();
process.env.NODE_ENV = 'test';

import { expect } from 'chai';
require('chai').should();


import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
const axiosMock = new MockAdapter(axios);

import config from '../../config';


describe('emitChangesCommitted', () => {

    xit('emitChangesCommitted', async () => {

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
        await emitChangesCommitted(changesCommitted, {lcid: 'lcid', sha: 'sha', euuid: 'euuid'});

        // verify
        expect(changesCommittedEmitted).to.equal(true);
    });

});

