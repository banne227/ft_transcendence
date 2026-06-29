FROM oven/bun

RUN mkdir -p /srv/user
WORKDIR /srv/user

COPY . /srv/user

RUN bun i
CMD [ "bun", "run", "index.js"]
