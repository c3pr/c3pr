[![Build Status](https://travis-ci.org/c3pr/c3pr-hub.svg?branch=master)](https://travis-ci.org/c3pr/c3pr-hub)

[![Build Status](https://travis-ci.org/c3pr/c3pr-brain.svg?branch=master)](https://travis-ci.org/c3pr/c3pr-brain)
[![Build Status](https://travis-ci.org/c3pr/c3pr-repo-github.svg?branch=master)](https://travis-ci.org/c3pr/c3pr-repo-github)
[![Build Status](https://travis-ci.org/c3pr/c3pr-agent.svg?branch=master)](https://travis-ci.org/c3pr/c3pr-agent)
[![Build Status](https://travis-ci.org/c3pr/node-git-client.svg?branch=master)](https://travis-ci.org/c3pr/node-git-client)

# c3pr-hub

C-3PR is a static analysis bot. For general info, check https://github.com/c3pr/c3pr.


# About this repo

C3PR is a distributed system. The module in this repo handles centralized:

- events (saving, subscribing, emitting)
- login
- registry (of available tools)


### TODO

- upon boot, load up the events that are processed or not
- broadcast events that are unprocessed from time to time (not only when they are registered)