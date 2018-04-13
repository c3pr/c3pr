FROM node:8-alpine

# pkg's version is 4.3.1 for no reason. Can be updated freely. We just fixed so it is reproducible.
RUN npm i -g pkg@4.3.1 replace-in-file

VOLUME /c3pr
WORKDIR /c3pr

ARG AGENT_VERSION
ENV AGENT_VERSION ${AGENT_VERSION}

CMD replace-in-file /__C3PR_AGENT_EXECUTABLE_VERSION__/g ${AGENT_VERSION} c3pr-agent.js --isRegex && \
    pkg --debug --targets node8-linux-x64 --output c3pr-agent-alpine-${AGENT_VERSION} c3pr-agent.js

