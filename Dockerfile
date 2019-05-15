#FROM nginx:1.15-alpine
#EXPOSE 80
#COPY nginx.conf /etc/nginx/conf.d/default.conf
#COPY dist/ /usr/share/nginx/html

# build stage
FROM node:8-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:1.15-alpine as production-stage
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
