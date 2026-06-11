FROM oven/bun:alpine

RUN mkdir -p /srv/website
WORKDIR /srv/website

COPY ./bun.lock .
COPY ./package.json .
RUN bun install

EXPOSE 8080
CMD [ "node", "./src/script.js" ]
