# Chingu Dashboard
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->
  ![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
  ![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

## Description

This is the Chingu Dashboard backend project. Be sure to set your .env [environment variables files](#envfiles)

## <a name="envfiles">Environment variables</a>
These files are needed for development and testing purposes, set them in your root directory alongside the docker-compose.yml files.
Make sure to match it exactly the same.

```bash
# .env.dev
DATABASE_URL=postgresql://chingu:chingu@postgres:5433/dashboard?schema=public
POSTGRES_USER=chingu
POSTGRES_PASSWORD=chingu
POSTGRES_DB=dashboard
PGADMIN_DEFAULT_EMAIL=chinguadmin@chingu.com
PGADMIN_DEFAULT_PASSWORD=chingu5432
PORT=8000

AT_SECRET=
RT_SECRET=
MJ_APIKEY_PRIVATE=
MJ_APIKEY_PUBLIC=
NODE_ENV=development
FRONTEND_URL=https://chingu-dashboard.vercel.app
BCRYPT_HASHING_ROUNDS=10

# .env.test
DATABASE_URL=postgresql://chingu:chingu@postgres:5433/dashboard-test?schema=public
POSTGRES_USER=chingu
POSTGRES_PASSWORD=chingu
POSTGRES_DB=dashboard
PORT=8000
```

## Installation

To install all the project's dependencies run:

```bash
$ yarn install
```


## <a name="prismaStudio">Prisma</a> **IMPORTANT: If you're using the docker setup in this project, go to the docker section**

To prepare the DB
```bash
# migrate db schema
$ yarn migrate

# seed db
$ yarn seed

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

By using Docker you can: spin up Postgres, the API & PGAdmin, as well as run prisma Studio and even tests.

### Running the project in Docker

With Docker open, from the project's root you can run Docker in dev or testing mode: 

```bash
# spin up dev Docker services (API, PGAdmin, Postgres DB)
$ yarn docker:dev

# spin up the Docker testing services (API, Postgres testing DB)
$ yarn docker:test
```
Docker will run in detached mode, meaning it's effectively running in the background, however, you will need to use the various scripts inside the docker cli.

Once the services are spun up, go to your docker desktop and go to chingu-dashboard-be_api container and click into it.

After, click on the CLI to into the terminal inside the container.

From here, type all the commands [above](#prismaStudio).

For PG Admin (use default email and default password from the env.dev file):
```
hostname: postgres
port: 5433
maintenance database: dashboard
username: chingu
password: chingu
```

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
