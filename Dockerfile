FROM nginx:1.15-alpine
EXPOSE 80
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/ /usr/share/nginx/html