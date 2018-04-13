[![Build Status](https://img.shields.io/travis/c3pr/c3pr-agent/master.svg?label=c3pr/c3pr-agent&style=for-the-badge)](https://travis-ci.org/c3pr/c3pr-agent)

[![Build Status](https://travis-ci.org/c3pr/c3pr.svg?branch=master)](https://travis-ci.org/c3pr/c3pr)
[![Build Status](https://travis-ci.org/c3pr/c3pr-repo-github.svg?branch=master)](https://travis-ci.org/c3pr/c3pr-repo-github)
[![Build Status](https://travis-ci.org/c3pr/node-git-client.svg?branch=master)](https://travis-ci.org/c3pr/node-git-client)

# c3pr-agent

C3PR agent for tool containers.

# Running

```bash
npm install
npm test
npm start
```

# Releases

First edit `release/generate-release.bat` to update the `VERSION` number. Then:

```bash
cd release
generate-release.bat
```

That will generate an executable on `dist/c3pr-agent-alpine-X.0.0`.
**Push** the branch/tag and **upload** the `c3pr-agent-alpine-X.0.0` to [github releases page](https://github.com/c3pr/c3pr-agent/releases).
