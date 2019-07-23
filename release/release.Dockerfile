FROM node:12-alpine

# pkg's version is 4.3.1 for no reason. Can be updated freely. We just fixed so it is reproducible.
RUN npm i -g pkg@4.3.1 replace-in-file

# VOLUME /release
VOLUME /c3pr
WORKDIR /c3pr

ARG AGENT_VERSION
ENV AGENT_VERSION ${AGENT_VERSION}

#CMD replace-in-file /__C3PR_AGENT_BUNDLE_VERSION__/g ${AGENT_VERSION} c3pr-agent.js --isRegex && \
#    pkg --debug --targets node8-alpine-x64 --output /release/c3pr-agent-alpine-${AGENT_VERSION} c3pr-agent.js
CMD replace-in-file /__C3PR_AGENT_BUNDLE_VERSION__/g ${AGENT_VERSION} c3pr-agent-executable.js --isRegex && \
    pkg --debug --targets node8-alpine-x64 --output /c3pr/c3pr-agent-alpine-${AGENT_VERSION} c3pr-agent-executable.js

