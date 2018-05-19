# c3pr

C-3PR is a static analysis bot. It is part of a Software Engineering research project on [UnB](http://ppca.unb.br/).
You can install the bot in your repo as a GitHub at https://github.com/apps/c3pr101

# About this repo

This repo contains docs about the platform and some scripts
 to help setting up the environment (both for development or production purposes).

# Nodes

C-3PR is a distributed system. Many microservices nodes communicate via an event-driven interface.

Current nodes:


| Repo Name               | Type                     | Port | Links                       | Build
| ----------------------- | ------------------------ | ---  | --------------------------- | ---
| c3pr-hub                | Central registry         | 5000 | [GitHub][111] [Docker][112] | [![Travis][113]][114]
| c3pr-brain              | PR/Projects Intelligence | 5001 | [GitHub][121] [Docker][122] | [![Travis][123]][124]
| c3pr-dashboard          | Centralized UI           | 5005 | [GitHub][131] [Docker][132] | [![Travis][133]][134]
|                         |                          |      |                             |
| node-c3pr-hub-client    | Reusable lib             | -    | [GitHub][141]               | [![Travis][143]][144]
| node-c3pr-logger        | Reusable lib             | -    | [GitHub][151]               | [![Travis][153]][154]
| node-git-client         | Reusable lib             | -    | [GitHub][161]               | [![Travis][163]][164]
|                         |                          |      |                             |
| node-c3pr-repo          | Reusable lib for repos   | -    | [GitHub][171]               | [![Travis][173]][174]
| c3pr-repo-github        | Repo implementation      | 5002 | [GitHub][181] [Docker][182] | [![Travis][183]][184]
| c3pr-repo-gitlab        | Repo implementation      | 5004 | [GitHub][191] [Docker][192] | [![Travis][193]][194]
|                         |                          |      |                             |
| c3pr-agent              | Agent for tools          | 5003 | [GitHub][201]               | [![Travis][203]][204]
| c3pr-tool-walkmod-sonar | Tool implementation      | 5003 | [GitHub][211] [Docker][212] | -

[111]: https://github.com/c3pr/c3pr-hub
[112]: https://hub.docker.com/r/c3pr/c3pr-hub/builds/
[113]: https://travis-ci.org/c3pr/c3pr-hub.svg?branch=master
[114]: https://travis-ci.org/c3pr/c3pr-hub
[121]: https://github.com/c3pr/c3pr-brain
[122]: https://hub.docker.com/r/c3pr/c3pr-brain/builds/
[123]: https://travis-ci.org/c3pr/c3pr-brain.svg?branch=master
[124]: https://travis-ci.org/c3pr/c3pr-brain
[131]: https://github.com/c3pr/c3pr-dashboard
[132]: https://hub.docker.com/r/c3pr/c3pr-dashboard/builds/
[133]: https://travis-ci.org/c3pr/c3pr-dashboard.svg?branch=master
[134]: https://travis-ci.org/c3pr/c3pr-dashboard
[141]: https://github.com/c3pr/node-c3pr-hub-client
[142]: N.A.
[143]: https://travis-ci.org/c3pr/node-c3pr-hub-client.svg?branch=master
[144]: https://travis-ci.org/c3pr/node-c3pr-hub-client
[151]: https://github.com/c3pr/node-c3pr-logger
[152]: N.A.
[153]: https://travis-ci.org/c3pr/node-c3pr-logger.svg?branch=master
[154]: https://travis-ci.org/c3pr/node-c3pr-logger
[161]: https://github.com/c3pr/node-git-client
[162]: N.A.
[163]: https://travis-ci.org/c3pr/node-git-client.svg?branch=master
[164]: https://travis-ci.org/c3pr/node-git-client
[171]: https://github.com/c3pr/node-c3pr-repo
[172]: N.A.
[173]: https://travis-ci.org/c3pr/node-c3pr-repo.svg?branch=master
[174]: https://travis-ci.org/c3pr/node-c3pr-repo
[181]: https://github.com/c3pr/c3pr-repo-github
[182]: https://hub.docker.com/r/c3pr/c3pr-repo-github/builds/
[183]: https://travis-ci.org/c3pr/c3pr-repo-github.svg?branch=master
[184]: https://travis-ci.org/c3pr/c3pr-repo-github
[191]: https://github.com/c3pr/c3pr-repo-gitlab
[192]: https://hub.docker.com/r/c3pr/c3pr-repo-gitlab/builds/
[193]: https://travis-ci.org/c3pr/c3pr-repo-gitlab.svg?branch=master
[194]: https://travis-ci.org/c3pr/c3pr-repo-gitlab
[201]: https://github.com/c3pr/c3pr-agent
[202]: N.A.
[203]: https://travis-ci.org/c3pr/c3pr-agent.svg?branch=master
[204]: https://travis-ci.org/c3pr/c3pr-agent
[211]: https://github.com/c3pr/c3pr-tool-walkmod-sonar
[212]: https://hub.docker.com/r/c3pr/c3pr-tool-walkmod-sonar/builds/
[213]: N.A.
[214]: N.A.
