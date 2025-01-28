FROM node:alpine AS base

WORKDIR /usr/src/app

COPY analyser-api/src src
COPY protos protos
COPY analyser-api/package.json .
COPY analyser-api/pnpm-lock.yaml ./

RUN npm install -g pnpm

FROM base AS development

COPY analyser-api/test test
COPY analyser-api/tsconfig.json ./
COPY analyser-api/nest-cli.json ./
COPY analyser-api/global.d.ts ./
COPY analyser-api/ormconfig.ts ./

RUN pnpm install
RUN pnpm run build

FROM base AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN pnpm install --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
