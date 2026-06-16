FROM alpine:3.22
RUN apk add --no-cache nodejs npm curl
RUN mkdir -p /srv/game_server

COPY . /srv/game_server/

WORKDIR /srv/game_server/

EXPOSE 3000
RUN npm install
CMD [ "npm", "run", "dev" ]
