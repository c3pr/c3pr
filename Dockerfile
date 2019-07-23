FROM node:12-alpine

MAINTAINER acdcjunior

RUN apk add -U --no-cache git

RUN mkdir -p /opt/c3pr-dashboard
WORKDIR /opt/c3pr-dashboard

COPY package.json /opt/c3pr-dashboard
COPY package-lock.json /opt/c3pr-dashboard
RUN npm install

COPY src /opt/c3pr-dashboard/src

EXPOSE 5005

CMD npm start