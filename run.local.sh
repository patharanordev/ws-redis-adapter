#!/bin/sh

docker-compose -f docker-compose.local.yml down -v

if [ -z $1 ] ; then
    echo "No arguments supplied"
else
    mkdir -p redis && \
    export SSH_PRV_KEY=$(cat ~/.ssh/$1) && \
    docker-compose -f docker-compose.local.yml up --build
fi