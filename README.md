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

```bash
npm i -g nexe
# Replace 1.0.0 with latest version
git tag 1.0.0
nexe --input ../index.js --output c3pr-agent-alpine-1.0.0 --target alpine-x64
git push tag 1.0.0
# Upload the c3pr-agent-alpine-1.0.0 to github releases page
```
