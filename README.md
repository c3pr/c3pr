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

Steps:

- release.bat
- test.bat
- commit and push
- upload binary to github

First edit `release/version.bat` to update the `VERSION` number. Then:

```bash
cd release
release.bat
```

That will generate an executable on `release/c3pr-agent-alpine-X.0.0`.
When OK, you should  **upload** it to the [github releases page](https://github.com/c3pr/c3pr-agent/releases).

You can test it via:

```bash
# inside release folder
test.bat
```

You can also automatically commit and tag via:

```bash
# inside release folder
commit.bat
```