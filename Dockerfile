FROM node:8-alpine

MAINTAINER acdcjunior

RUN mkdir -p /opt/c3pr-hub
WORKDIR /opt/c3pr-hub

COPY package.json /opt/c3pr-hub
COPY package-lock.json /opt/c3pr-hub
RUN npm install

COPY src /opt/c3pr-hub/src

EXPOSE 5004

CMD npm start