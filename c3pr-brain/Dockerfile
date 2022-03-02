FROM node:12-alpine

MAINTAINER acdcjunior

RUN apk add -U --no-cache git

RUN mkdir -p /opt/c3pr-brain
WORKDIR /opt/c3pr-brain

COPY package.json /opt/c3pr-brain
COPY package-lock.json /opt/c3pr-brain
RUN npm install

COPY src /opt/c3pr-brain/src

EXPOSE 5001

CMD npm start