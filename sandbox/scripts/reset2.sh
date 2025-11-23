#!/bin/bash

# the user needs to manually run this when they need to reset the docker stack
sleep 3
echo "$(date -Iseconds) - Timer triggered, running reset"
cd "$(dirname "$(realpath "$0")")/.."


echo "Removing compose stack..."
docker compose -p sandbox down --remove-orphans --volumes

echo "Removing network..."
docker network rm sandbox-net 2>/dev/null || true

echo "Restarting network..."
docker network create sandbox-net

echo "Reset complete"
