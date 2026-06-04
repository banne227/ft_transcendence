FROM alpine:3.22
RUN apk add --no-cache nodejs npm curl
RUN mkdir -p /srv/game_server

COPY . /srv/game_server/

EXPOSE 3000

COPY ./entrypoint.sh /tmp/
ENTRYPOINT [ "sh",  "/tmp/entrypoint.sh" ]
