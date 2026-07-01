# Import th image base model
FROM oven/bun

RUN mkdir -p /srv/webapp
WORKDIR /srv/webapp
COPY . /srv/webapp
EXPOSE 3000

RUN bun i
CMD [ "bun", "run", "./src/server.ts" ]
