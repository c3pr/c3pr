FROM node:8-alpine

MAINTAINER acdcjunior

RUN apk add -U --no-cache git

RUN mkdir -p /opt/c3pr-repo-github
WORKDIR /opt/c3pr-repo-github

COPY package.json /opt/c3pr-repo-github
COPY package-lock.json /opt/c3pr-repo-github
RUN npm install

COPY src /opt/c3pr-repo-github/src
COPY resources /opt/c3pr-repo-github/resources

EXPOSE 5002

CMD npm start