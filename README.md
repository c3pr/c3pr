# c3pr

C-3PR is a static analysis bot. It is part of a Software Engineering research project on [UnB](http://ppca.unb.br/).
You can install the bot in your repo as a GitHub at https://github.com/apps/c3pr101

# About this repo

This repo contains docs about the platform and some scripts
 to help setting up the environment (both for development or production purposes).

# Nodes

C-3PR is a distributed system. Many microservices nodes communicate via an event-driven interface.

Current nodes:


| Repo Name                      | Type                     | Port | Travis Build          | Docker Hub
| ------------------------------ | ------------------------ | ---  | --------------------- | ---
| [c3pr-hub               ][111] | Central Events/Auth registry | 5000 | [![Travis][113]][114] | [![Docker][115]][112]
| [c3pr-brain             ][121] | PR/Projects Intelligence     | 5001 | [![Travis][123]][124] | [![Docker][115]][122]
| [c3pr-dashboard         ][131] | Centralized UI               | 5005 | [![Travis][133]][134] | [![Docker][115]][132]
|                                |                              |      |                       | 
| [node-c3pr-hub-client   ][141] | Reusable lib                 | -    | [![Travis][143]][144] | 
| [node-c3pr-logger       ][151] | Reusable lib                 | -    | [![Travis][153]][154] | 
| [node-git-client        ][161] | Reusable lib                 | -    | [![Travis][163]][164] | 
|                                |                              |      |                       | 
| [node-c3pr-repo         ][171] | Reusable lib for repos       | -    | [![Travis][173]][174] | 
| [c3pr-repo-github       ][181] | Repo implementation          | 5002 | [![Travis][183]][184] | [![Docker][115]][182]
| [c3pr-repo-gitlab       ][191] | Repo implementation          | 5004 | [![Travis][193]][194] | [![Docker][115]][192]
|                                |                              |      |                       | 
| [c3pr-agent             ][201] | Agent for tools              | 5003 | [![Travis][203]][204] | 
| [c3pr-tool-walkmod-sonar][211] | Tool implementation          | 5003 | -                     | [![Docker][115]][212]





[111]: https://github.com/c3pr/c3pr-hub
[112]: https://hub.docker.com/r/c3pr/c3pr-hub/builds/
[113]: https://travis-ci.org/c3pr/c3pr-hub.svg?branch=master
[114]: https://travis-ci.org/c3pr/c3pr-hub
[115]: https://img.shields.io/docker/build/c3pr/c3pr-hub.svg

[121]: https://github.com/c3pr/c3pr-brain
[122]: https://hub.docker.com/r/c3pr/c3pr-brain/builds/
[123]: https://travis-ci.org/c3pr/c3pr-brain.svg?branch=master
[124]: https://travis-ci.org/c3pr/c3pr-brain
[125]: https://img.shields.io/docker/build/c3pr/c3pr-brain.svg

[131]: https://github.com/c3pr/c3pr-dashboard
[132]: https://hub.docker.com/r/c3pr/c3pr-dashboard/builds/
[133]: https://travis-ci.org/c3pr/c3pr-dashboard.svg?branch=master
[134]: https://travis-ci.org/c3pr/c3pr-dashboard
[135]: https://img.shields.io/docker/build/c3pr/c3pr-dashboard.svg

[141]: https://github.com/c3pr/node-c3pr-hub-client
[142]: N.A.
[143]: https://travis-ci.org/c3pr/node-c3pr-hub-client.svg?branch=master
[144]: https://travis-ci.org/c3pr/node-c3pr-hub-client
[145]: N.A.

[151]: https://github.com/c3pr/node-c3pr-logger
[152]: N.A.
[153]: https://travis-ci.org/c3pr/node-c3pr-logger.svg?branch=master
[154]: https://travis-ci.org/c3pr/node-c3pr-logger
[155]: N.A.

[161]: https://github.com/c3pr/node-git-client
[162]: N.A.
[163]: https://travis-ci.org/c3pr/node-git-client.svg?branch=master
[164]: https://travis-ci.org/c3pr/node-git-client
[165]: N.A.

[171]: https://github.com/c3pr/node-c3pr-repo
[172]: N.A.
[173]: https://travis-ci.org/c3pr/node-c3pr-repo.svg?branch=master
[174]: https://travis-ci.org/c3pr/node-c3pr-repo
[175]: N.A.

[181]: https://github.com/c3pr/c3pr-repo-github
[182]: https://hub.docker.com/r/c3pr/c3pr-repo-github/builds/
[183]: https://travis-ci.org/c3pr/c3pr-repo-github.svg?branch=master
[184]: https://travis-ci.org/c3pr/c3pr-repo-github
[185]: https://img.shields.io/docker/build/c3pr/c3pr-repo-github.svg

[191]: https://github.com/c3pr/c3pr-repo-gitlab
[192]: https://hub.docker.com/r/c3pr/c3pr-repo-gitlab/builds/
[193]: https://travis-ci.org/c3pr/c3pr-repo-gitlab.svg?branch=master
[194]: https://travis-ci.org/c3pr/c3pr-repo-gitlab
[195]: https://img.shields.io/docker/build/c3pr/c3pr-repo-gitlab.svg

[201]: https://github.com/c3pr/c3pr-agent
[202]: N.A.
[203]: https://travis-ci.org/c3pr/c3pr-agent.svg?branch=master
[204]: https://travis-ci.org/c3pr/c3pr-agent
[205]: N.A.

[211]: https://github.com/c3pr/c3pr-tool-walkmod-sonar
[212]: https://hub.docker.com/r/c3pr/c3pr-tool-walkmod-sonar/builds/
[213]: N.A.
[214]: N.A.
[215]: https://img.shields.io/docker/build/c3pr/c3pr-tool-walkmod-sonar.svg


# Notes

At the moment, the assignee (field of the PRR event) is the push user. We may change that in the future.