FROM node:18-alpine AS runner
RUN npm i -g pnpm

# -------------------------------------------

FROM runner AS dependencies

ARG SSH_PRV_KEY
WORKDIR /var/www/nest/redis-adapter

RUN apk add -qU openssh git && \
    mkdir /root/.ssh && \
    chmod 0700 /root/.ssh && \
    ssh-keyscan -t rsa bitbucket.org >> /root/.ssh/known_hosts && \
    echo "$SSH_PRV_KEY" > /root/.ssh/id_rsa && \
    chmod 600 /root/.ssh/id_rsa

COPY package*.json .
RUN pnpm i

# -------------------------------------------

FROM runner AS builder

WORKDIR /var/www/nest/redis-adapter

COPY --from=dependencies /var/www/nest/redis-adapter/node_modules ./node_modules
COPY . .

RUN chmod +x /var/www/nest/redis-adapter/entrypoint.sh
    
CMD ["sh", "entrypoint.sh"]
