FROM alpine:3.22
RUN apk add --no-cache npm nodejs

RUN mkdir -p /srv/webapp
COPY . /srv/webapp/
WORKDIR /srv/webapp

EXPOSE 444
RUN npm install
CMD [ "node", "." ]
