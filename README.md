# c3pr

C-3PR is a static analysis bot. It is part of a Software Engineering research project on [UnB](http://ppca.unb.br/)1
Y10ou can install the bot in your repo as a GitHub at https://github.com/apps/c3pr101
# About this repo

This repo contains docs about the platform and some scripts
 to help setting up the environment (both for development or production purposes).

# Nodes

C-3PR is a distributed system. Many microservices nodes communicate via an event-driven interface.

Current nodes:


| Repo Name               | Type                     | Port | Links                       | Build
| ----------------------- | ------------------------ | ---  | --------------------------- | ---
| c3pr-hub                | Central registry         | 5000 | [GitHub][111] [Docker][112] | [![Build Status][113]][114]
| c3pr-brain              | PR/Projects Intelligence | 5001 | [GitHub][121] [Docker][122] | [![Build Status](https://travis-ci.org/c3pr/c3pr-brain.svg?branch=master)](https://travis-ci.org/c3pr/c3pr-brain)
| c3pr-dashboard          | Centralized UI           | 5005 | [GitHub][131] [Docker][132] | [![Build Status](https://travis-ci.org/c3pr/c3pr-dashboard.svg?branch=master)](https://travis-ci.org/c3pr/c3pr-dashboard)
|                         |                          |      |                             |
| node-c3pr-hub-client    | Reusable lib             | -    | [GitHub][141] [Docker][142] | [![Build Status](https://travis-ci.org/c3pr/node-c3pr-hub-client.svg?branch=master)](https://travis-ci.org/c3pr/node-c3pr-hub-client)
| node-c3pr-logger        | Reusable lib             | -    | [GitHub][151] [Docker][152] | [![Build Status](https://travis-ci.org/c3pr/node-c3pr-logger.svg?branch=master)](https://travis-ci.org/c3pr/node-c3pr-logger)
| node-git-client         | Reusable lib             | -    | [GitHub][161] [Docker][162] | [![Build Status](https://travis-ci.org/c3pr/node-git-client.svg?branch=master)](https://travis-ci.org/c3pr/node-git-client)
|                         |                          |      |                             |
| node-c3pr-repo          | Reusable lib for repos   | -    | [GitHub][171] [Docker][172] | [![Build Status](https://travis-ci.org/c3pr/node-c3pr-repo.svg?branch=master)](https://travis-ci.org/c3pr/node-c3pr-repo)
| c3pr-repo-github        | Repo implementation      | 5002 | [GitHub][181] [Docker][182] | [![Build Status](https://travis-ci.org/c3pr/c3pr-repo-github.svg?branch=master)](https://travis-ci.org/c3pr/c3pr-repo-github)
| c3pr-repo-gitlab        | Repo implementation      | 5004 | [GitHub][191] [Docker][192] | [![Build Status](https://travis-ci.org/c3pr/c3pr-repo-gitlab.svg?branch=master)](https://travis-ci.org/c3pr/c3pr-repo-gitlab)
|                         |                          |      |                             |
| c3pr-agent              | Agent for tools          | 5003 | [GitHub][201] [Docker][202] | [![Build Status](https://travis-ci.org/c3pr/c3pr-agent.svg?branch=master)](https://travis-ci.org/c3pr/c3pr-agent)
| c3pr-tool-walkmod-sonar | Tool implementation      | 5003 | [GitHub][211] [Docker][212] | -

[111]: https://github.com/c3pr/c3pr-hub
[112]: https://hub.docker.com/r/c3pr/c3pr-hub
[113]: https://travis-ci.org/c3pr/c3pr-hub.svg?branch=master
[114]: https://travis-ci.org/c3pr/c3pr-hub
[121]: https://github.com/c3pr/c3pr-brain
[122]: https://hub.docker.com/r/c3pr/c3pr-brain
[131]: https://github.com/c3pr/c3pr-dashboard
[132]: https://hub.docker.com/r/c3pr/c3pr-dashboard
[141]: https://github.com/c3pr/node-c3pr-hub-client
[142]: https://hub.docker.com/r/c3pr/node-c3pr-hub-client
[151]: https://github.com/c3pr/node-c3pr-logger
[152]: https://hub.docker.com/r/c3pr/node-c3pr-logger
[161]: https://github.com/c3pr/node-git-client
[162]: https://hub.docker.com/r/c3pr/node-git-client
[171]: https://github.com/c3pr/node-c3pr-repo
[172]: https://hub.docker.com/r/c3pr/node-c3pr-repo
[181]: https://github.com/c3pr/c3pr-repo-github
[182]: https://hub.docker.com/r/c3pr/c3pr-repo-github
[191]: https://github.com/c3pr/c3pr-repo-gitlab
[192]: https://hub.docker.com/r/c3pr/c3pr-repo-gitlab
[201]: https://github.com/c3pr/c3pr-agent
[202]: https://hub.docker.com/r/c3pr/c3pr-agent
[211]: https://github.com/c3pr/c3pr-tool-walkmod-sonar
[212]: https://hub.docker.com/r/c3pr/c3pr-tool-walkmod-sonar