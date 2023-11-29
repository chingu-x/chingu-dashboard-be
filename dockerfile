FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY prisma ./prisma/

RUN yarn install

COPY . .