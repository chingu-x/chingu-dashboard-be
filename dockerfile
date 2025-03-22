FROM node:22-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY prisma ./prisma/

RUN apt-get update -y && apt-get install -y openssl

RUN yarn install

COPY . .