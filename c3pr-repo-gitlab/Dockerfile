FROM node:12-alpine

MAINTAINER acdcjunior

RUN apk add -U --no-cache git

RUN mkdir -p /opt/c3pr-repo-gitlab
WORKDIR /opt/c3pr-repo-gitlab

COPY package.json /opt/c3pr-repo-gitlab
COPY package-lock.json /opt/c3pr-repo-gitlab
RUN npm install

COPY src /opt/c3pr-repo-gitlab/src
COPY resources /opt/c3pr-repo-gitlab/resources
COPY tsconfig.json /opt/c3pr-repo-gitlab/

EXPOSE 5004

CMD npm start