FROM maven:3-jdk-8-alpine

RUN apk add --update wget nano unzip git

# While we are developing, one RUN per line is better. When done, use "&& \" to merge them all

RUN mkdir -p /c3pr/project /c3pr/temp /c3pr/agent

ADD c3pr-agent-alpine-4.0.0 /c3pr/agent/c3pr-agent
RUN chmod +x /c3pr/agent/c3pr-agent

WORKDIR /c3pr

EXPOSE 5003

ENTRYPOINT /c3pr/agent/c3pr-agent

