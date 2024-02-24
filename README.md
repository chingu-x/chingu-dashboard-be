# Chingu Dashboard
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->
  ![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
  ![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

## Description

This is the Chingu Dashboard backend project. Be sure to set your .env [environment variables files](#envfiles)

## <a name="envfiles">Environment variables</a>

- if using the docker databases, and an external terminal, use these DATABASE_URL
```bash
# .env
DATABASE_URL=postgresql://chingu:chingu@localhost:5433/dashboard?schema=public
# .env.test
DATABASE_URL=postgresql://chingu:chingu@localhost:5434/dashboard?schema=public
```


```bash
# .env
DATABASE_URL={your database url}
PORT=8000

JWT_SECRET=
AT_SECRET=
RT_SECRET=
BCRYPT_HASHING_ROUNDS=10

MJ_APIKEY_PRIVATE=
MJ_APIKEY_PUBLIC=

NODE_ENV=development

FRONTEND_URL=https://chingu-dashboard-git-dev-chingu-dashboard.vercel.app/

# .env.test
DATABASE_URL={your test database connection string}
NODE_ENV=test
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

If using the docker terminal the commands would be 
```bash
# unit tests
$ yarn test:docker

# e2e tests
$ yarn test:e2e:docker

# integration tests
$ yarn test:int:docker

# test coverage
$ yarn test:cov:docker
```

## Docker 

By using Docker you can: spin up Postgres, the API & PGAdmin, as well as run prisma Studio and even tests.

### Running the project in Docker

With Docker open, from the project's root you can run Docker in dev or testing mode: 

```bash
# spin up dev Docker services (API, PGAdmin, Postgres DB)
$ yarn docker
```
Docker will run in detached mode, meaning it's effectively running in the background, however, you will need to use the various scripts inside the docker cli.

Once the services are spun up, go to your docker desktop and go to chingu-dashboard-be_api container and click into it.

After, click on the CLI to into the terminal inside the container.

From here, type all the commands [above](#prismaStudio).

## PG Admin

Login with 
```
chinguadmin@chingu.com
chingu5432
```
Right click Servers -> Register -> Server...

dev database
```
hostname: postgres
port: 5433
maintenance database: dashboard
username: chingu
password: chingu
```

test database
```
hostname: postgres-test
port: 5434
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


## Custom Decorators 

### @Roles()

Adds role(s) requirements for the route in conjunction with the RolesGuard

Examples: <br/>
`@Roles(AppRoles.Admin)` will restrict the route for users with admin roles<br/>
`@Roles(AppRoles.Admin, AppRoles.Voyager)` restricts the route to admin and voyagers

### @Permissions()
Adds permissions requirements for the route in conjunction with the PermissionGuard

Examples: <br/>
`@Permissions(AppPermissions.OWN_TEAM)` will restrict the route for voyagers to access their own team data

## Roles
- Admin
- Voyager

## Permissions
- OWN_TEAM - only access their own team data, teamId param required (admins excepted)