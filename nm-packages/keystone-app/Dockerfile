FROM node:24-slim

USER root:root
RUN apt-get update -y && apt-get install -y openssl
RUN mkdir /keystone-app && chown -R node:node /keystone-app

USER node:node
WORKDIR /keystone-app

COPY --chown=node:node ./ ./
ENV DATABASE_PROVIDER=postgresql
RUN yarn install
VOLUME ["/keystone-app/.yarn"]
# VOLUME ["/keystone-app/node_modules"]

RUN npx prisma generate
RUN yarn build
VOLUME "/keystone-app/.keystone"
ENTRYPOINT ["/keystone-app/docker-entrypoint.sh"]
CMD ["yarn", "start"]
