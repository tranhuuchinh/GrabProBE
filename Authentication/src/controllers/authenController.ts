import express from 'express'
import { Request, Response, NextFunction } from 'express'
import UserFactory from '~/services/UserService/UserFactory'
import { catchAsync } from '~/utils/catchAsync'
import crypto from 'crypto'
import { promisify } from 'util'
import fs from 'fs'
import jwt, { Secret } from 'jsonwebtoken'
import firebase from '~/configs/firebase'
// Đảm bảo đã cài đặt thư viện dotenv để đọc các biến môi trường từ tệp .env
import dotenv from 'dotenv'
import IAccount from '../models/AccountModel'
import { AuthStrategy, PhoneAuthStrategy, GoogleAuthStrategy } from '../services/AuthService/authStrategies'
import AuthProcessor from '../services/AuthService/authProcessor'
import { createSendToken } from '../utils/token'

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

const phoneAuthStrategy = new PhoneAuthStrategy()
const googleAuthStrategy = new GoogleAuthStrategy()

// const base64_encode = (path: string, root = '') => {
//   const ext = path.substring(path.lastIndexOf('.')).split('.')[1]
//   const base64 = fs.readFileSync(`${root}${path}`, 'base64')

//   return `data:${ext};base64,${base64}`
// }

export default {
  login: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const loginType = req.body.loginType //.....
    const data = req.body

    let strategy: AuthStrategy | null = null // Khởi tạo với giá trị mặc định null

    if (loginType === 'phone') {
      strategy = phoneAuthStrategy
      console.log('phone')
    } else if (loginType === 'google') {
      strategy = googleAuthStrategy
      console.log('google')
    } else {
      // Xử lý các loại đăng nhập khác (nếu có)
    }

    if (strategy) {
      // Kiểm tra xem strategy đã được gán giá trị chưa
      const loginProcessor = new AuthProcessor(strategy)

      try {
        const tokens = await loginProcessor.login(data)

        res.status(200).json({
          status: 'success',
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          data: tokens.user
        })
      } catch (error) {
        next(error)
      }
    } else {
      res.status(400).json({
        status: 'fail',
        message: 'Loại đăng nhập không hợp lệ'
      })
    }
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
    const dataRegis = await createSendToken(user)
    console.log(dataRegis)

    res.status(200).json({
      status: 'success',
      dataRegis
    })
  })
}
