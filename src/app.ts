import express from 'express'
import cors from 'cors'

import { httpLoggerMiddleware } from '@/middlewares/httpLogger.middleware.js'
import {
  helmetMiddleware,
  corsConfig,
  apiLimiter,
  bodyParserLimit,
} from '@/middlewares/security.middleware.js'
import routes from '@/routes/index.js'
import { errorMiddleware } from '@/middlewares/error.middleware.js'
import { config } from '@/config/index.js'

const app = express()

// 安全中间件
app.use(helmetMiddleware)
// CORS 中间件
app.use(cors(corsConfig))
// API 速率限制中间件
app.use(apiLimiter)
// 请求大小限制中间件
app.use(express.json(bodyParserLimit.json))
// 请求大小限制中间件
app.use(express.urlencoded(bodyParserLimit.urlencoded))
// HTTP 请求日志中间件
app.use(httpLoggerMiddleware)
// 路由中间件
app.use(config.app.apiPrefix, routes)
// 错误处理中间件
app.use(errorMiddleware)

export default app
