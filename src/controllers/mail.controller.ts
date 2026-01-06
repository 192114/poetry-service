import type { NextFunction, Response } from 'express'
import type { SendEmailCodeQuery } from '@/schemas/mail.schema.js'
import type { TypedRequest } from '@/types/request.js'

import { successResponse } from '@/utils/response.js'
import { sendEmailCodeService } from '@/services/mail.service.js'

// 发送邮箱验证码
export const sendEmailCodeController = async (
  req: TypedRequest<{ query: SendEmailCodeQuery }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await sendEmailCodeService(req.query)
    successResponse(res, null, '验证码发送成功')
  } catch (error) {
    next(error)
  }
}
