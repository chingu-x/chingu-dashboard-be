# Chingu Dashboard
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->
  ![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
  ![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

## Description

This is the Chingu Dashboard backend project

## Creating new components

### Module

In this files we will handle each module of the project, but in general it basically has to call the controller and the service

```bash
nest g module <name of module>
```

### Controller

In this files we will handle each controller of the module, in this files we will have each route identified with its respective method

```bash
nest g controller <name of controller>
```

### Service

In this files we will have the business logic for each controller

```bash
nest g service <name of service>
```

## Environment variables

The following variables should be on the .env file

```
DATABASE_URL="postgres://<username>:<password>@<host>:<database port>/<database name>"
PORT=<application port>
```

## Installation

To install all the project's dependencies run:

```bash
$ yarn install
```

## Prisma

```bash
# reset database/schema, and seed
$ prisma migrate reset

$ prisma db seed 
```
or 
```bash
$ yarn db:reset
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
