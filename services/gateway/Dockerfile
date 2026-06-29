# Import bun image base model
FROM oven/bun
# Create the working directory
RUN mkdir -p /srv/gateway

# Goes into the directory
WORKDIR /srv/gateway/
# Copy every file into the working directory
COPY . /srv/gateway/

# Install dependency
RUN bun install
# Launch the gateway
CMD [ "bun", "run", "./sources/index.js" ]
