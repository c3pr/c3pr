[![Build Status](https://travis-ci.org/c3pr/c3pr-hub.svg?branch=master)](https://travis-ci.org/c3pr/c3pr-hub)
[![Build Status](https://travis-ci.org/c3pr/c3pr-brain.svg?branch=master)](https://travis-ci.org/c3pr/c3pr-brain)
[![Build Status](https://travis-ci.org/c3pr/c3pr-repo-github.svg?branch=master)](https://travis-ci.org/c3pr/c3pr-repo-github)
[![Build Status](https://travis-ci.org/c3pr/c3pr-repo-gitlab.svg?branch=master)](https://travis-ci.org/c3pr/c3pr-repo-gitlab)
[![Build Status](https://travis-ci.org/c3pr/c3pr-agent.svg?branch=master)](https://travis-ci.org/c3pr/c3pr-agent)
[![Build Status](https://travis-ci.org/c3pr/c3pr-dashboard.svg?branch=master)](https://travis-ci.org/c3pr/c3pr-dashboard)
[![Build Status](https://travis-ci.org/c3pr/node-c3pr-hub-client.svg?branch=master)](https://travis-ci.org/c3pr/node-c3pr-hub-client)
[![Build Status](https://travis-ci.org/c3pr/node-c3pr-logger.svg?branch=master)](https://travis-ci.org/c3pr/node-c3pr-logger)
[![Build Status](https://travis-ci.org/c3pr/node-c3pr-repo.svg?branch=master)](https://travis-ci.org/c3pr/node-c3pr-repo)
[![Build Status](https://travis-ci.org/c3pr/node-git-client.svg?branch=master)](https://travis-ci.org/c3pr/node-git-client)

# c3pr

C-3PR is a static analysis bot. It is part of a Software Engineering research project on [UnB](http://ppca.unb.br/).

You can install the bot in your repo as a GitHub at https://github.com/apps/c3pr.

# About this repo

This repo contains docs about the platform and some scripts
 to help setting up the environment (both for development or production purposes).

# Nodes

C-3PR is a distributed system. Many microservices nodes communicate via an event-driven interface.

Current nodes:
- c3pr-hub
- c3pr-brain
- c3pr-repo-github
- c3pr-repo-gitlab
- c3pr-agent
- c3pr-dashboard
- c3pr-tool-walkmod-sonar

Reusable libs:
- node-c3pr-hub-client
- node-c3pr-logger
- node-c3pr-repo
- node-git-client
