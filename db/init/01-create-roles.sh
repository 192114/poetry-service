#!/bin/bash
set -e

echo "==> Creating application role..."

psql -v ON_ERROR_STOP=1 -U "$POSTGRES_OWNER_USER" -d "$POSTGRES_DB" <<EOSQL
CREATE ROLE "$POSTGRES_APP_USER"
  LOGIN
  PASSWORD '$POSTGRES_APP_PASSWORD';
EOSQL
