# Chingu Dashboard
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->
  ![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
  ![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

## Description

This is the Chingu Dashboard backend project. Be sure to set your .env.dev [environment variables file](#envfiles)

## Creating new components

To generate Modules, Controllers and Services inline with the NestJs documentation we recommend using the `Nest cli`, which you can download from their [site](https://docs.nestjs.com/cli/overview)

### Module

```bash
# Generate a new module
$ nest g module <name of module>
```

### Controller

```bash
# Generate a new controller
$ nest g controller <name of controller>
```

### Service

```bash
# Generate a new service
$ nest g service <name of service>
```

## 

## <a name="envfiles">Environment variables</a>
This file is needed for development and testing purposes, set it in your root directory alongside the docker-compose.yml files. The file should be named `.env.dev`

```bash
# .env.dev
DATABASE_URL=postgresql://chingu:chingu@localhost:5433/dashboard?schema=public
POSTGRES_USER=chingu
POSTGRES_PASSWORD=chingu
POSTGRES_DB=dashboard
PGADMIN_DEFAULT_EMAIL=chinguadmin@chingu.com
PGADMIN_DEFAULT_PASSWORD=chingu5432
PORT=8000
```

## Installation

To install all the project's dependencies run:

```bash
$ yarn install
```


## <a name="prismaStudio">Prisma</a>

To prepare the DB
```bash
# migrate db schema
$ yarn migrate

# seed db
$ yarn db:reset

# run Prisma Studio
$ yarn studio
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test<a name="tests"></a>

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# integration tests
$ yarn test:int

# test coverage
$ yarn test:cov
```

## Docker 

By using Docker you can: spin up Postgres, the API & PGAdmin, as well as run [Prisma Studio](#prismaStudio) and even [tests](#dockerTests).

### Running the project in Docker

With Docker open, from the project's root you can run Docker in dev or testing mode: 

```bash
# spin up dev Docker services (API, PGAdmin, Postgres DB)
$ yarn docker:dev

# spin up the Docker testing services (API, Postgres testing DB)
$ yarn docker:test
```
Docker will run in  detached mode, meaning it's effectively running in the background, so you can continue using your local terminal as normal whilst interacting with the services running on Docker.

When Docker is running make sure to setup the DB as directed [above](#prismaStudio) from your local terminal (e.g. the terminal integrated into your IDE).

*When logging into PGAdmin set the `Host name/address` as `host.docker.internal` and follow the .env [above](#envfiles) for the other fields.*

Having spun up your Docker services and migrated + seeded your DB your services will be running on the following default ports:

- API: `8000`
- Postgres: `5433`
- PGAdmin: `4000`
- Prisma Studio: `5555`


### <a name="tearDown">Tearing down Docker services<a/>

To stop and tear down the Docker services:
```bash
# tear down all Docker services but retain volumes
$ yarn docker:down

# tear down Docker services and remove all volumes
$ yarn docker:clean
```

### <a name="dockerTests"></a> Running tests with Docker

With the Docker test services running, run your tests as shown [above](#tests)
When you've finished testing just [tear down the container](#tearDown)

If you want to run integration or e2e tests on the fly you can quickly spin up a Postgres service and run your tests against it. 

If you're using Linux, Mac OS, or Windows with Bash configured:

```bash
# run integration tests through Docker test image
$ yarn docker:test:int

# run e2e tests through Docker test image
$ yarn docker:test:e2e
```

These commands will spin up the test Postgres container, run your tests and tear down the containers for you in one command.
