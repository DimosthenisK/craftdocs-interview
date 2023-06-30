FROM --platform=linux/amd64 node:18-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

COPY prisma ./prisma/

RUN yarn install --frozen-lockfile
RUN yarn prisma generate

COPY . .

RUN yarn build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD yarn prisma migrate deploy ; yarn start:prod
