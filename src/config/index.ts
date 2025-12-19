import dotEnv from 'dotenv'

import { validateEnv } from './env.schema.js'

dotEnv.config({ path: '.env' })

const env = validateEnv()

export const config = {
  // 应用层配置
  app: {
    env: env.NODE_ENV,
    port: env.PORT,
    apiPrefix: env.API_PREFIX,
    isProduction: env.NODE_ENV === 'production',
    isDevelopment: env.NODE_ENV === 'development',
    isTest: env.NODE_ENV === 'test',
  },
  // 数据库配置
  database: {
    url: env.DATABASE_URL,
  },
  // JWT 配置
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshSecret: env.JWT_REFRESH_SECRET,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
  // Redis 配置
  redis: {
    url: env.REDIS_URL,
  },
  // CORS 配置
  cors: {
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
  },
} as const

export default config

export type Config = typeof config
