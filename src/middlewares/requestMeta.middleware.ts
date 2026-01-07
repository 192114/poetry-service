import type { Request, Response, NextFunction } from 'express'

export const requestMetaMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const ipAddress = req.ip ?? 'unknown'
  const userAgent = req.headers['user-agent'] ?? 'unknown'

  req.meta = {
    ipAddress,
    userAgent,
  }

  next()
}
