import Account from '~/models/AccountModel'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { createSendToken } from '../../utils/token'

// auth-strategies.ts
interface AuthStrategy {
  login(data: any): Promise<any>
}

class PhoneAuthStrategy implements AuthStrategy {
  async login(data: any): Promise<any> {
    const { phone, password } = data
    console.log('Vinh' + data.password)

    // Xử lý đăng nhập bằng số điện thoại và mật khẩu
    // eslint-disable-next-line no-useless-catch
    try {
      // Tìm người dùng dựa trên số điện thoại
      const user = await Account.findOne({ phone })

      if (!user) {
        throw new Error('Người dùng không tồn tại')
      }

      // Kiểm tra mật khẩu
      // const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')

      if (data.password !== user.password) {
        throw new Error('Sai mật khẩu')
      }

      // Đăng nhập thành công, tạo và gửi token
      const tokens = await createSendToken(user)

      return tokens
    } catch (error) {
      throw error // Re-throw lỗi để cho phần xử lý global error có thể bắt lỗi này
    }
  }
}

export default PhoneAuthStrategy

class GoogleAuthStrategy implements AuthStrategy {
  async login(data: any): Promise<any> {
    const { googleToken } = data
    // Xử lý đăng nhập bằng Google
  }
}

export { AuthStrategy, PhoneAuthStrategy, GoogleAuthStrategy }
