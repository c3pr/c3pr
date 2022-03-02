# c3pr

C-3PR is a static analysis bot. It is part of a Software Engineering research project on [UnB](http://ppca.unb.br/).

The work developed here has been published as an article in the [2020 IEEE 27th International Conference on
Software Analysis, Evolution and Reengineering (SANER)](https://scholar.google.com/citations?view_op=view_citation&hl=pt-BR&user=7_nYmrEAAAAJ&citation_for_view=7_nYmrEAAAAJ:0EnyYjriUFMC).

# About this repo

This repo contains docs about the platform and some scripts
 to help setting up the environment (both for development or production purposes).

# Nodes

C-3PR is a distributed system. Many microservices nodes communicate via an event-driven interface.

Current nodes:


| Repo Name                      | Type                         | Port | Travis Build          |
|--------------------------------|------------------------------|------|-----------------------|
| [c3pr-hub               ][111] | Central Events/Auth registry | 7300 | [![Travis][153]][154] |
| [c3pr-brain             ][121] | PR/Projects Intelligence     | 7301 | [![Travis][153]][154] |
| [c3pr-dashboard         ][131] | Centralized UI               | 7305 | [![Travis][153]][154] |
|                                |                              |      |                       | 
| [node-c3pr-hub-client   ][141] | Reusable lib                 | -    | [![Travis][153]][154] | 
| [node-c3pr-logger       ][151] | Reusable lib                 | -    | [![Travis][153]][154] | 
| [node-git-client        ][161] | Reusable lib                 | -    | [![Travis][153]][154] | 
|                                |                              |      |                       | 
| [node-c3pr-repo         ][171] | Reusable lib for repos       | -    | [![Travis][153]][154] | 
| [c3pr-repo-github       ][181] | Repo implementation          | 7302 | [![Travis][153]][154] |
| [c3pr-repo-gitlab       ][191] | Repo implementation          | 7304 | [![Travis][153]][154] |
|                                |                              |      |                       | 
| [c3pr-agent             ][201] | Agent for tools              | 7303 | [![Travis][153]][154] | 
| [c3pr-tool-walkmod-sonar][211] | Tool implementation          | 7303 | -                     |





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
[145]: N.A.

[151]: https://github.com/c3pr/node-c3pr-logger
[152]: N.A.
[153]: https://travis-ci.org/c3pr/node-c3pr-logger.svg?branch=master
[154]: https://travis-ci.org/c3pr/node-c3pr-logger
[155]: N.A.

[161]: https://github.com/c3pr/node-c3pr-git-client
[162]: N.A.
[163]: https://travis-ci.org/c3pr/node-c3pr-git-client.svg?branch=master
[164]: https://travis-ci.org/c3pr/node-c3pr-git-client
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

[191]: https://github.com/c3pr/c3pr-repo-gitlab
[192]: https://hub.docker.com/r/c3pr/c3pr-repo-gitlab/builds/
[193]: https://travis-ci.org/c3pr/c3pr-repo-gitlab.svg?branch=master
[194]: https://travis-ci.org/c3pr/c3pr-repo-gitlab

[201]: https://github.com/c3pr/c3pr-agent
[202]: N.A.
[203]: https://travis-ci.org/c3pr/c3pr-agent.svg?branch=master
[204]: https://travis-ci.org/c3pr/c3pr-agent
[205]: N.A.

[211]: https://github.com/c3pr/c3pr-tool-walkmod-sonar
[212]: https://hub.docker.com/r/c3pr/c3pr-tool-walkmod-sonar/builds/
[213]: N.A.
[214]: N.A.
