# Chingu Dashboard

  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

## Description

This is the Chingu Dashboard backend project.
You can run the project locally or using Docker.
Once you have cloned the repo locally, be sure to set your .env [environment variables files](#envfiles)

## <a name="envfiles">Environment variables</a>

-   if using the docker databases, and an external terminal, use these DATABASE_URL

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

JWT_SECRET={can be any string}
AT_SECRET={can be any string}
RT_SECRET={can be any string}
BCRYPT_HASHING_ROUNDS=10

MJ_APIKEY_PRIVATE={check Important Resources page}
MJ_APIKEY_PUBLIC={check Important Resources page}
MJ_ENV=local

NODE_ENV=development

FRONTEND_URL=https://chingu-dashboard-git-dev-chingu-dashboard.vercel.app/

DISCORD_CLIENT_ID={check Important Resources page}
DISCORD_CLIENT_SECRET={check Important Resources page}
DISCORD_CALLBACK_URL=http://localhost:8000/api/v1/auth/discord/redirect

# .env.test
DATABASE_URL={your test database connection string}
NODE_ENV=test
```

## Installation

If you don't have yarn installed, make sure to install it first. Some useful steps are available in the [official Yarn documentation](https://yarnpkg.com/getting-started/install).

To install all the project's dependencies run the following command in the project root:

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

> [!TIP]
> It is recommended to use `db push` to [prototype your schema](https://www.prisma.io/docs/orm/prisma-migrate/workflows/prototyping-your-schema)

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

> [!IMPORTANT]
> To prepare the test database, run `yarn push:test` or `yarn push:test:docker`

```bash
# all tests (unit and e2e for now)
$ yarn test

# unit tests
$ yarn test:unit

# e2e tests
$ yarn test:e2e

# integration tests
$ yarn test:int

# test coverage
$ yarn test:cov
```

If using the docker terminal the commands would be

```bash
# all tests (unit and e2e for now)
$ yarn test:docker

# unit tests
$ yarn test:unit:docker

# e2e tests
$ yarn test:e2e:docker

# integration tests
$ yarn test:int:docker

# test coverage
$ yarn test:cov:docker
```

## Docker

By using Docker you can: spin up Postgres, the API & PGAdmin, as well as run prisma Studio and even tests.
Start by installing Docker if you don't have it already (it may require a machine restart in order to finalize installation).

### Running the project in Docker

Open the Docker app and from the project's root you can run Docker in dev or testing mode using commands below:

```bash
# spin up dev Docker services (API, PGAdmin, Postgres DB)
$ yarn docker
```

Docker will run in detached mode, meaning it's effectively running in the background, however, you will need to use the various scripts inside the docker cli.

Once the services are spun up, go to your docker desktop, chingu-dashboard-be container, click into it and then locate the chingu-dashboard-be_api container.

Using the container actions, select 'Open in terminal'.

From here, type all the commands [above](#prismaStudio).

## PG Admin

http://localhost:4000/

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

-   API: `8000`
-   Postgres: `5433`
-   PGAdmin: `4000`
-   Prisma Studio: `5555`

If you want to manually check that the API is receiving incoming requests, you can perform a GET request on the health endpoint using a tool like Postman (or another tool of your choice).

### <a name="tearDown">Tearing down Docker services</a>

To stop and tear down the Docker services:

```bash
# tear down all Docker services but retain volumes
$ yarn docker:down

# tear down Docker services and remove all volumes
$ yarn docker:clean
```

## Custom Pipes

### FormInputValidationPipe

For use with form responses, this pipe validates that the responses or response (array) values include a questionId and at least one input value of any type.

Example: `@Body(new FormInputValidationPipe())`

### VoyageTeamMemberValidationPipe

It checks the voyageTeamMemberId in the request body and validates if the logged in user belongs to that team.

Example: `@Body(VoyageTeamMemberValidationPipe)`

## Custom Decorators

### @Public()

Marks the route as public, bypassing the JWT auth guard (`jwtAuthGuard`)

Examples: <br/>
`@Public()`

### @Unverified()

Marks the route as accessible to users that have not verified thier account by email

### @CheckAbilities()

This accepts 2 arguments -
<br/>
action: Manage, Create, Read, Update, Delete, etc
<br/>
subject: 'User', 'Voyage' - these are prisma models

-   Actions, and abilites are defined in the CASL factory `src/ability/ability.factory/ability.factory.ts`,
    where the subjects are defined in `prisma-generated-types.ts`
-   Manage, and 'all' are wildcards
-   They also accept arrays like `action: [Action.Read, Action.Update]`

Examples: <br/>
`@CheckAbilities({ action: Action.Manage, subject: "all" })` - when a route is marked with this,
only users with the ability to manage 'all' subjects are allowed to access to route,
otherwise, a 403 forbidden error is returned.

`@CheckAbilities({ action: Action.Read, subject: "VoyageTeam" })` - users with Read ability for `VoyageTeam` subject can access this route.

## Custom Exception Filter

Note: A try-catch block is not required to catch these exceptions

### Prisma Client exception Filter (`prisma-client-exception.filter.ts`)

This filter catches all prisma generated exceptions with type `PrismaClientKnownRequestError` and handle them

### CASL Forbidden Exception Filter

This filter catches all `ForbiddenError` from `@casl/ability`

## Global Guards

These guards are applied to every route in the app

### JWT Auth Guard (JwtAuthGuard) - `jwt-auth.guard.ts`

This guard checks user access based on the passport strategy 'jwt-at', which extracts cookies from the request body, validates the user in the database and attaches additional user information in req.user
It also checks if the `@public()` is applied to the route, if yes, user access check is bypassed

### CASL Abilities Guard (AbilitiesGuard)- `abilities.guard.ts`

This guard defines and checks required permissions to access the route, it checks if the user has the required permission based on user roles.
Permissions based on roles are defined in the CASL ability factory (`ability.factory.ts`)

## Guards

### JWT Refresh Token Guard (JwtRefreshAuthGuard) - `jwt-rt-auth.guard.ts`

This guard is only used for the refresh access token route, `/refresh`, using passport 'jwt-refresh' strategy

### Local Auth guard (LocalAuthGuard) - `local-auth.guard.ts`

This guard is only used for the `/login` route, using the passport 'local' strategy
