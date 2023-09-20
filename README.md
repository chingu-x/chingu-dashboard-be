# Chingu Dashboard
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->
  ![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
  ![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

## Description

This is the Chingu Dashboard backend project. Be sure to set your dev and test [.env files](#envfiles)

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

## Installation

To install all the project's dependencies run:

```bash
$ yarn install
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

## Test<a name="tests"></a>

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# integration tests
$ yarn run test:int

# test coverage
$ yarn run test:cov
```

## Docker 

By using Docker you can: spin up Postgres, the API & PGAdmin, as well as run [Prisma Studio](#prismaStudio) and even [tests](#dockerTests).

### Running the DB and API in Docker

With Docker open, from the project's root run: 

```bash
# spin up project Docker images
$ yarn start:docker:dev
```

#### Migrate Prisma schema + Setup <a name="prismaStudio">Prisma studio</a>

With the Docker images running, either from the cli in your ide on in the Docker cli for the API image, run:

```bash
# run Prisma schema migration with dev .env variables
$ yarn migrate:dev

# run Prisma schema migration with test .env variables
$ yarn migrate:test
```

Then to set up Prisma studio:

```bash
# setup Prisma Studio
$ yarn studio
```

Docker containers and Prisma Studio should now be running on the [default ports](#deafultPorts)

### <a name="tearDown">Tearing down Docker services<a/>

To stop and tear down the Docker services:
```bash
# tear down Docker development services
$ yarn down:dev

# tear down Docker test services
$ yarn down:test
```

### <a name="dockerTests"></a> Running tests with Docker

You can start the test DB and API:

```bash
# run docker test db only
$ yarn start:docker:test

# run docker test db with API
$ yarn start:docker:test:all
```

When that is running, run your tests as shown [above](#tests)
When you've finished testing just [tear down the container manually](#tearDown)

If you don't have the full Docker image running and want to run integration tests you can quickly spin up a Postgres image and run your tests against it. 

If you're using Linux, Mac OS, or Windows with Bash configured:

```bash
# run Jest integration tests through Docker test image
$ yarn test:docker
```

This command will spin up the test Postgres container, run your tests and tear down the containers for you in one command.

#### <a name="envfiles">Dev and Testing environment variable files</a>
These files are only for development and testing purposes and are needed to run the Docker containers, set them in your root directory alongside the docker-compose.yml files. 

```bash
# .env.test
DATABASE_URL=postgresql://chingu:chingu@localhost:5433/dashboard?schema=public
HOSTNAME=localhost
POSTGRES_USER=chingu
POSTGRES_PASSWORD=chingu
POSTGRES_DB=dashboard
PORT=8000
```

```bash
# .env.dev
DATABASE_URL=postgresql://chingu:chingu@chingu:5433/dashboard?schema=public
HOSTNAME=chingu
POSTGRES_USER=chingu
POSTGRES_PASSWORD=chingu
POSTGRES_DB=dashboard
PGADMIN_DEFAULT_EMAIL=chinguadmin@chingu.com
PGADMIN_DEFAULT_PASSWORD=chingu5432
PORT=8000
```

#### <a name="deafultPorts">Default ports with Docker:<a/>

- API: `8000`
- Postgres: `5433`
- PGAdmin: `4000`
- Prisma Studio: `5555`
