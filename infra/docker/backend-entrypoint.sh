#!/bin/sh
set -e

cat > /app/backend/.env <<EOF
PORT=3001
JWT_KEY=${JWT_KEY:-local-dev-jwt-key-change-me}
NODE_ENV=development
DEV_DB_USERNAME=${DEV_DB_USERNAME:-conduit}
DEV_DB_PASSWORD=${DEV_DB_PASSWORD:-conduit}
DEV_DB_NAME=${DEV_DB_NAME:-conduit_dev}
DEV_DB_HOSTNAME=${DEV_DB_HOSTNAME:-postgres}
DEV_DB_DIALECT=postgres
EOF

echo "Waiting for Postgres at ${DEV_DB_HOSTNAME:-postgres}..."
until nc -z "${DEV_DB_HOSTNAME:-postgres}" 5432; do
  sleep 1
done
echo "Postgres is ready."

echo "Running database migrations..."
npm run sqlz -- db:migrate

exec npm run start -w backend
