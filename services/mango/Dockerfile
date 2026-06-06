FROM mongo
COPY ./mangod.conf /etc/mongod.conf
COPY ./init.sh /docker-entrypoint-initdb.d/
RUN chown mongodb:mongodb /docker-entrypoint-initdb.d/init.sh
