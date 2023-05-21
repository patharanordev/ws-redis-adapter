#!/bin/sh

export RELEASE=0.1.0-e2e
export NODE_ENV=Test
export HTTP_PORT=3200
export GLOBAL_ENDPOINT=redis-adapter
export REDIS_HOST=localhost
export REDIS_PORT=6379
export REDIS_PSUBSCRIBE_PREFIX="redis-adapter"
export REDIS_EVENT_ADAPTER="adapter"

docker-compose -f docker-compose.e2e.yml up --build -d
sleep 20
pnpm run test:cov && \
docker-compose -f docker-compose.e2e.yml down -v