FROM nginx:stable-alpine3.23-perl
RUN apk add npm nodejs

COPY ./frontend /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html

RUN npm install socket.io
