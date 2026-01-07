import * as argon2 from 'argon2'

import { verifyEmailCode } from './mail.service.js'

import type { LoginBody, RegisterBody } from '@/schemas/auth.schema.ts'

import { prisma } from '@/database/prisma.js'
import { HttpError, ErrorCode } from '@/utils/httpError.js'

export const loginService = async (body: LoginBody) => {
  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  })
  if (!user) {
    throw new HttpError(ErrorCode.INVALID_CREDENTIALS, '用户名或密码错误')
  }

  return {
    token: '1111',
    refreshToken: '222',
  }
}

export const registerService = async (body: RegisterBody) => {
  const { email, emailCode, password } = body

  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  })

  if (existingUser) {
    // 用户存在
    throw new HttpError(ErrorCode.EMAIL_ALREADY_EXISTS, '邮箱已存在')
  }

  // 校验验证码
  await verifyEmailCode(email, emailCode, 'REGISTER')

  const passwordHash = await argon2.hash(password)

  await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email,
      },
    })

    await tx.userCredential.create({
      data: {
        passwordHash,
        userId: newUser.id,
        type: 'PASSWORD',
      },
    })
  })
}
