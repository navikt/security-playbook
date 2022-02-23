FROM nginxinc/nginx-unprivileged:1.20-alpine

USER nginx
WORKDIR /app

COPY build/ ./
COPY nginx/default.conf /etc/nginx/conf.d

EXPOSE 8080
