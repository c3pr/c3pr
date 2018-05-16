[![Build Status](https://travis-ci.org/c3pr/c3pr.svg?branch=master)](https://travis-ci.org/c3pr/c3pr)

[![Build Status](https://travis-ci.org/c3pr/c3pr-brain.svg?branch=master)](https://travis-ci.org/c3pr/c3pr-brain)
[![Build Status](https://travis-ci.org/c3pr/c3pr-repo-github.svg?branch=master)](https://travis-ci.org/c3pr/c3pr-repo-github)
[![Build Status](https://travis-ci.org/c3pr/c3pr-agent.svg?branch=master)](https://travis-ci.org/c3pr/c3pr-agent)
[![Build Status](https://travis-ci.org/c3pr/node-git-client.svg?branch=master)](https://travis-ci.org/c3pr/node-git-client)

# c3pr

C-3PR is a static analysis bot.

Check the app at https://github.com/apps/c3pr.

Check the dashboard at https://c3pr.herokuapp.com/


# About this repo

C3PR is a distributed system. The module in this repo handles the main dashboard and centralized logging/tracing as well as centralized configuration management.

In other words, it will know what nodes are online and will make all other nodes aware of it.

### Registry

This microservice keeps an `api/v1/registry` enpoint to be used as centralized registry for all other c3pr nodes.
Such registry is volatile by design, meaning if the current instance of c3pr goes down, nothing is saved.


# TODO

- upon boot, load up the events that are processed or not
- broadcast events that are unprocessed from time to time (not only when they are registered)