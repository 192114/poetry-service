import type { Response, NextFunction } from 'express'
import type { LoginBody, RegisterBody } from '@/schemas/auth.schema.ts'
import type { TypedRequest } from '@/types/request.ts'

import { successResponse } from '@/utils/response.js'
import { loginService, registerService } from '@/services/auth.service.js'
import config from '@/config/index.js'

export const registerController = async (
  req: TypedRequest<{ body: RegisterBody }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await registerService(req.body)
    successResponse(res, null, '注册成功')
  } catch (error) {
    next(error)
  }
}

export const loginController = async (
  req: TypedRequest<{ body: LoginBody }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body
    const meta = req.meta
    const { refreshToken, accessToken } = await loginService(body, meta)
    // 采用rt写到cookie access_token 返回给客户端
    res.cookie('resfreshToken', refreshToken, {
      httpOnly: true,
      sameSite: true,
      secure: config.app.isProduction,
    })
    successResponse(res, { accessToken }, '登录成功')
  } catch (error) {
    next(error)
  }
}
