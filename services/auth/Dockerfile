# Import bun image base model
FROM oven/bun
# Create the working directory
RUN mkdir -p /srv/auth

# Goes into the directory
WORKDIR /srv/auth/
# Copy every file into the working directory
COPY ./bun.lock /srv/auth/
COPY ./package.json /srv/auth/
COPY ./index.js /srv/auth/
COPY ./models /srv/auth/
COPY ./utils.js /srv/auth/

# Install dependency
RUN bun install
# Launch the gateway
CMD [ "bun", "run", "./index.js" ]
