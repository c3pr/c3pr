require("node-c3pr-logger").testMode();
process.env.NODE_ENV = 'test';

import { expect } from 'chai';
require('chai').should();

// noinspection JSUnusedLocalSymbols
const config = require('../../config');

const createPullRequestRequested = require('./createPullRequestRequested').c3pr.createPullRequestRequested;

// noinspection JSUnusedLocalSymbols
const axios = require('axios');
// noinspection JSUnusedLocalSymbols
const MockAdapter = require('axios-mock-adapter');

const toolInvocationCompleted = {
    event_type: "ToolInvocationCompleted",
    uuid: "tic-uuid-123",
    payload: {
        parent: {event_type: "ToolInvocationRequested", uuid: "tir-uuid-111"},
        "repository": {
            "full_path": "c3pr/sample-project-java-maven",
            "push_user": {"id": 395, "username": "someusername"},
            "clone_url_http": "https://github.com/c3pr/sample-project-java-maven.git",
            "branch": "branch-for-clone-tests",
            "revision": "13b7eedacc076e8a16ae565b535fd48edb9a044a"
        },
        "changed_files": ["src/main/this-array-can-be-empty"],
        "unmodified_files": ["src/main/this-array-can-be-empty-as-well"],

        "pr_title": "PR Title!!!",
        "pr_body": "This is the `markdown` body.",
        "diff_base64": "ZGlmZiAtLWdpdCBhL1JFQURNRS5tZCBiL1JFQURNRS5tZAppbmRleCA0MzU3NTc0Li4xZTogCiB9Cg=="
    }
};

// noinspection JSUnusedLocalSymbols
const pullRequestRequested = {
    "parent": {
        "event_type": "ToolInvocationCompleted",
        "uuid": "tic-uuid-123"
    },

    "repository": {
        "full_path": "c3pr/sample-project-java-maven",
        "push_user": {"id": 395, "username": "someusername"},
        "clone_url_http": "https://github.com/c3pr/sample-project-java-maven.git",
        "branch": "branch-for-clone-tests",
        "revision": "13b7eedacc076e8a16ae565b535fd48edb9a044a"
    },

    "assignee": "someusername",
    "pr_title": "PR Title!!!",
    "pr_body": "This is the `markdown` body.",
    "diff_base64": "ZGlmZiAtLWdpdCBhL1JFQURNRS5tZCBiL1JFQURNRS5tZAppbmRleCA0MzU3NTc0Li4xZTogCiB9Cg=="
};

describe('createPullRequestRequested', () => {

    it('createPullRequestRequested', () => {

        const pullRequestRequested = createPullRequestRequested(toolInvocationCompleted);

        expect(pullRequestRequested).to.deep.equal(pullRequestRequested);

    });

});

