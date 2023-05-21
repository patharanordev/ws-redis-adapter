#!/bin/sh

# Ref. https://redis.io/docs/manual/keyspace-notifications/
redis-cli \
    -h $REDIS_HOST \
    -p $REDIS_PORT \
    config set notify-keyspace-events AKE && \

pnpm run start:local