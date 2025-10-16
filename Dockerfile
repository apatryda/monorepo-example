FROM node:24-slim

USER root:root

RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*
RUN npm uninstall -g yarn pnpm && npm install -g corepack
RUN mkdir /monorepo && chown -R node:node /monorepo

USER node:node
WORKDIR /monorepo
RUN corepack enable

COPY --chown=node:node docker-entrypoint.sh docker-entrypoint.sh
COPY --chown=node:node lerna.json lerna.json
COPY --chown=node:node .yarnrc.yml .yarnrc.yml
COPY --chown=node:node .pnp.cjs .pnp.cjs
COPY --chown=node:node .pnp.loader.mjs .pnp.mjs
COPY --chown=node:node .yarn/ .yarn/
COPY --chown=node:node yarn.lock yarn.lock
COPY --chown=node:node package.json package.json
COPY --chown=node:node packages/nest-app/package.json packages/nest-app/package.json
COPY --chown=node:node packages/vue-app/package.json packages/vue-app/package.json

RUN yarn install

VOLUME ["/monorepo/.yarn"]

COPY --chown=node:node packages/ packages/
RUN yarn lerna run build
RUN yarn lerna run test
# VOLUME \
#   "/monorepo/packages/nest-app/dist" \
#   "/monorepo/packages/vue-app/dist" \
# COPY --chown=node:node ormconfig.json ormconfig.json
ENTRYPOINT ["/monorepo/docker-entrypoint.sh"]
CMD ["start"]
