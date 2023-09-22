#!/bin/bash

run_integration_tests() {
  echo "Running integration tests..."
  yarn test:int
}

run_e2e_tests() {
  echo "Running e2e tests..."
  yarn test:e2e
}

echo "Setup: Ensuring blank slate..."
docker compose -f docker-compose-test.yml down -v --remove-orphans
docker compose -f docker-compose-dev.yml down

echo "Spinning up Postgres container..."
yarn docker:test & wait

echo "Waiting for Postgres to be ready to accept connections..."
WAIT_FOR_PG_ISREADY="while ! pg_isready; do sleep 1; done;"
docker-compose exec postgres bash -c "$WAIT_FOR_PG_ISREADY"
echo "Postgres ready to accept connections" & wait

echo "Prisma schema migration..."
yarn migrate & wait

if [[ "$1" == "-i" ]]; then
  run_integration_tests
elif [[ "$1" == "-e" ]]; then
  run_e2e_tests
else
  run_integration_tests
  run_e2e_tests
fi

echo "Tearing down all containers..."
docker compose -f docker-compose-test.yml down -v --remove-orphans
