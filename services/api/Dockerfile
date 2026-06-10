# Import th image base model
FROM alpine:3.22
# Download every dependancy
RUN apk add --no-cache npm nodejs curl bash
# Download Bun for package manager
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="$PATH:~/.bun/bin"

# Creating a directory on /srv/webapp and copying every content
# of the api folder into it
RUN mkdir -p /srv/webapp
COPY . /srv/webapp/
WORKDIR /srv/webapp

# API listen on port 4444
EXPOSE 4444
# Install every JS dependancy with bun
RUN /root/.bun/bin/bun install
# Launch the API
CMD [ "/root/.bun/bin/bun", "run", "./sources/api.js" ]
