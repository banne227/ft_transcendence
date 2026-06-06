#!/bin/bash
# /docker-entrypoint-initdb.d/01-init.sh

mongosh << EOF
db.createUser({
  user: "${MONGO_ADMIN_USER}",
  pwd: "${MONGO_ADMIN_PASS}",
  roles: [{ role: "userAdminAnyDatabase", db: "admin" }]
});

db = db.getSiblingDB("databases");
db.createUser({
  user: "${MONGO_USER}",
  pwd: "${MONGO_PASS}",
  roles: [{ role: "readWrite", db: "databases" }]
});

db.createCollection("users");
db.createCollection("leaderboard");
EOF
