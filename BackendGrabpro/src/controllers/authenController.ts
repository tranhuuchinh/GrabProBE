import express from 'express'
import UserFactory from '~/services/UserService/UserFactory'
import { catchAsync } from '~/utils/catchAsync'
import crypto from 'crypto'
import { promisify } from 'util'
import fs from 'fs'
import jwt, { Secret } from 'jsonwebtoken'
import firebase from '~/configs/firebase'
// Đảm bảo đã cài đặt thư viện dotenv để đọc các biến môi trường từ tệp .env
import dotenv from 'dotenv'

dotenv.config()

const jwtCookieExpiresIn = process.env.JWT_COOKIE_EXPIRES_IN
if (!jwtCookieExpiresIn) {
  throw new Error('JWT_COOKIE_EXPIRES_IN is not defined in environment variables.')
}
// Chuyển đổi giá trị sang kiểu số
const expiresInDays = parseInt(jwtCookieExpiresIn, 10)

if (isNaN(expiresInDays)) {
  throw new Error('JWT_COOKIE_EXPIRES_IN is not a valid number in environment variables.')
}

const expiresInMilliseconds = expiresInDays * 24 * 60 * 60 * 1000

const cookieOptions = {
  expires: new Date(Date.now() + expiresInMilliseconds),
  httpOnly: true,
  sameSite: 'None',
  secure: true
}

const base64_encode = (path: string, root = '') => {
  const ext = path.substring(path.lastIndexOf('.')).split('.')[1]
  const base64 = fs.readFileSync(`${root}${path}`, 'base64')

  return `data:${ext};base64,${base64}`
}

const signToken = (phone: string, expires: string | null = null) => {
  const secret: Secret = !expires ? process.env.ACCESS_TOKEN_SECRET || '' : process.env.REFRESH_TOKEN_SECRET || ''
  const expiresIn: string = !expires ? process.env.JWT_EXPIRES_IN || '30m' : process.env.JWT_EXPIRES_IN_REFRESH || '1d'

  return jwt.sign({ phone }, secret, {
    expiresIn: expiresIn
  })
}

const createSendToken = async (user: any, statusCode: number, req: any, res: any) => {
  const cookies = req?.cookies

  const token = signToken(user.phone)
  const newRefreshToken = signToken(user.phone, 'refresh')

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

  // Save refresh token to DB
  const newRefreshTokenArray = !cookies?.jwt
    ? user.refreshToken
    : user.refreshToken.filter((rt: any) => rt !== cookies.jwt)

  if (cookies?.jwt) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
  }
  user.refreshToken = [...newRefreshTokenArray, newRefreshToken]

  const result = await user.save()

  // Remove password from output
  user.password = undefined
  user.refreshToken = undefined

  res.cookie('jwt', newRefreshToken, cookieOptions)

  res.status(statusCode).json({
    status: 'success',
    access_token: token,
    data: {
      user
    }
  })
}

export default {
  login: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const loginType = req.query.by
    const data = req.body

    res.status(200).json({
      status: 'success',
      access_token: '',
      refresh_token: '',
      data: data
    })
  }),
  register: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const role = req.body.role
    const phone = req.body.phone
    const password = req.body.password
    const data = req.body
    let user = null

    if (role === 'customer') {
      user = await UserFactory.createUser(role, '', phone, password, '')
    } else if (role === 'driver') {
      user = await UserFactory.createUser(role, '', phone, password, '')
    }

    // TOKEN

    res.status(200).json({
      status: 'success',
      access_token: '',
      refresh_token: '',
      data: user
    })
  })
}
