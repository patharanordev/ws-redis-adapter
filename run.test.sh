#!/bin/sh

docker-compose -f docker-compose.test.yml down -v && \
npm i -g pnpm && \
mkdir -p redis

if [ -z $1 ] ; then
    echo "No arguments supplied"
else
    export SSH_PRV_KEY=$(cat ~/.ssh/$1)
fi

docker-compose -f docker-compose.test.yml up --build \
    --abort-on-container-exit \
    --exit-code-from test && \
docker-compose -f docker-compose.test.yml down -v