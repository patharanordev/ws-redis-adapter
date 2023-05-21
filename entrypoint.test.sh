#!/bin/sh

# Ref. https://redis.io/docs/manual/keyspace-notifications/
redis-cli \
    -h test_redis \
    -p 6379 \
    config set notify-keyspace-events AKE && \

pnpm run test:cov && \
exit 0