require("node-c3pr-logger/c3prLOG4").default.testMode();
process.env.NODE_ENV = 'test';

import { expect } from 'chai';
require('chai').should();

const emitPullRequestRequested = require('./emitPullRequestRequested');

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const axiosMock = new MockAdapter(axios);

import config from '../../config';


describe('emitPullRequestRequested', () => {

    it('emitPullRequestRequested', async () => {

        const pullRequestRequested = {
            repository: {
                clone_url_http: "https://github.com/c3pr/sample-project-java-maven.git",
                revision: "13b7eedacc076e8a16ae565b535fd48edb9a044a"
            }
        };

        let pullRequestRequestedEmitted = false;
        axiosMock
            .onPost(
                `${config.c3pr.hub.c3prHubUrl}/api/v1/events/PullRequestRequested`,
                pullRequestRequested
            ).reply(() => { pullRequestRequestedEmitted = true; return [200]; });

        // execute
        await emitPullRequestRequested(pullRequestRequested, {lcid: 'lcid', sha: 'sha', euuid: 'euuid'});

        // verify
        expect(pullRequestRequestedEmitted).to.equal(true);
    });

});

