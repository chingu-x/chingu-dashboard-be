FROM node:20.1.0-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY prisma ./prisma/

RUN yarn install

RUN apt-get update -y && apt-get install -y openssl


COPY . .