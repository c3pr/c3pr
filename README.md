[![Build Status](https://travis-ci.org/c3pr/c3pr-repo-github.svg?branch=master)](https://travis-ci.org/c3pr/c3pr-repo-github)

[![Build Status](https://travis-ci.org/c3pr/c3pr.svg?branch=master)](https://travis-ci.org/c3pr/c3pr)
[![Build Status](https://travis-ci.org/c3pr/c3pr-brain.svg?branch=master)](https://travis-ci.org/c3pr/c3pr-brain)
[![Build Status](https://travis-ci.org/c3pr/c3pr-agent.svg?branch=master)](https://travis-ci.org/c3pr/c3pr-agent)
[![Build Status](https://travis-ci.org/c3pr/node-git-client.svg?branch=master)](https://travis-ci.org/c3pr/node-git-client)


# c3pr-repo-github

C3PR Repository Adapter for GitHub

# GitHub app

The GitHub app is created at https://github.com/apps/c3pr

# Deployment

Currently deployed at https://c3pr-github.herokuapp.com/webhook

Logs available at (requires login) https://dashboard.heroku.com/apps/c3pr-github/logs

# Required env vars

See [`src/config.js`](src/config.js).

- `GITHUB_API_TOKEN`
- `PORT`
    - Defaults to `5002`
- `C3PR_BRAIN_URL`
    - Brain node URL.
    - Defaults to `http://${os.hostname()}:5001`
- `C3PR_REPO_GITHUB_URL`
    - This node's URL.
    - Defaults to `http://${os.hostname()}:${PORT}`
