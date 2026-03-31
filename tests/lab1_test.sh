#!/bin/bash
set -e

echo "--- Starting Lab 1 Grading ---"

if [ $(docker ps -q -f name=app | wc -l) -eq 0 ]; then
  echo "Error: Container named 'app' not found."
  exit 1
fi

echo "Step 1: Checking /health (Expect 200)..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" localhost:8080/health)
if [ "$STATUS" -ne 200 ]; then
  echo "Error: Expected 200, but got $STATUS"
  exit 1
fi

echo "Step 2: Checking JSON logs..."
if ! docker logs app --tail 5 | jq . > /dev/null 2>&1; then
  echo "Error: Logs are not valid JSON."
  exit 1
fi

echo "Step 3: Stopping DB to check 503 error..."
DB_CONTAINER=$(docker compose ps -q db)
docker stop $DB_CONTAINER > /dev/null
sleep 3
STATUS_503=$(curl -s -o /dev/null -w "%{http_code}" localhost:8080/health)
if [ "$STATUS_503" -ne 503 ]; then
  echo "Error: App must return 503 when DB is offline."
  docker start $DB_CONTAINER > /dev/null
  exit 1
fi

docker start $DB_CONTAINER > /dev/null
echo "SUCCESS: Lab 1 is passed!"
