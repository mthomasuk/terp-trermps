#!/bin/bash

set -e

cd ../backend

docker compose up --build > /dev/null 2>&1 &

while ! nc -z localhost 5432; do
  sleep 1
done

go run main.go > /dev/null 2>&1 &

while ! nc -z localhost 4001; do
  sleep 1
done

cd ../frontend

BROWSER=none yarn start > /dev/null 2>&1 &

while ! nc -z localhost 3000; do
  sleep 1
done

cd ../tests
yarn cypress:run

cd ../backend
docker compose down

trap 'pkill -P $$' SIGINT SIGTERM EXIT
