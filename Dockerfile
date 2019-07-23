FROM node:12-alpine

MAINTAINER acdcjunior

RUN apk add -U --no-cache git

RUN mkdir -p /opt/c3pr-hub
WORKDIR /opt/c3pr-hub

COPY package.json /opt/c3pr-hub
COPY package-lock.json /opt/c3pr-hub
RUN npm install

COPY src /opt/c3pr-hub/src

EXPOSE 5000

CMD npm start