#! /bin/bash

echo "Setup: Ensuring blank slate..."
docker compose -f docker-compose-test.yml down  -v --remove-orphans
docker compose -f docker-compose-dev.yml down  -v --remove-orphans


echo "Spinning up Postgres container..."
yarn start:docker:test & wait

echo "Waiting for Postgres to be ready to accept connections..."
WAIT_FOR_PG_ISREADY="while ! pg_isready; do sleep 1; done;"
docker-compose exec postgres bash -c "$WAIT_FOR_PG_ISREADY"
echo "Postgres ready to accept connections" & wait

echo "Prisma schema migration..."
yarn migrate:test & wait

echo "Running Jest integration tests..."
yarn test:int

echo "Tearing down all containers..."
docker compose -f docker-compose-test.yml down  -v --remove-orphans