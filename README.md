[![Build Status](https://travis-ci.org/c3pr/c3pr-brain.svg?branch=master)](https://travis-ci.org/c3pr/c3pr-brain)

[![Build Status](https://travis-ci.org/c3pr/c3pr.svg?branch=master)](https://travis-ci.org/c3pr/c3pr)
[![Build Status](https://travis-ci.org/c3pr/c3pr-repo-github.svg?branch=master)](https://travis-ci.org/c3pr/c3pr-repo-github)
[![Build Status](https://travis-ci.org/c3pr/c3pr-agent.svg?branch=master)](https://travis-ci.org/c3pr/c3pr-agent)
[![Build Status](https://travis-ci.org/c3pr/node-git-client.svg?branch=master)](https://travis-ci.org/c3pr/node-git-client)

# c3pr

Core service for C3PR.

# Endpoints

    /changes
    
A repo adapter should POST to this URL when notifying from changes.

# Notes

The deployment environment must have the environment variable `C3PR_BRAIN_URL` set.
E.g. `export C3PR_BRAIN_URL=http://localhost:5001`
