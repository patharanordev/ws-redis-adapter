FROM node:18-alpine

# # Use the node user from the image (instead of the root user)
# USER node

# Create app directory
WORKDIR /var/www/nest/emitter

RUN apk add -qU redis
RUN npm i -g pnpm

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
# COPY --chown=node:node package*.json ./
COPY package*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN pnpm i

# Bundle app source
# COPY --chown=node:node . .
COPY . .
