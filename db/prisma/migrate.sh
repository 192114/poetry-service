#!/bin/bash
set -e

# 加载 .env 文件
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# 构建 DATABASE_URL
export DATABASE_URL="postgresql://${POSTGRES_OWNER_USER}:${POSTGRES_OWNER_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}"

# 执行 prisma 命令
pnpm prisma "$@"