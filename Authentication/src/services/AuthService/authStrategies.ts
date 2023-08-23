import Account from '~/models/AccountModel'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { createSendToken } from '../../utils/token'

// auth-strategies.ts
interface AuthStrategy {
  login(data: any, role: any): Promise<any>
}

class PhoneAuthStrategy implements AuthStrategy {
  async login(data: any, roleAcc: any): Promise<any> {
    const { phone, password } = data
    console.log(data)
    const role = roleAcc
    console.log(role)

    // Xử lý đăng nhập bằng số điện thoại và mật khẩu
    // eslint-disable-next-line no-useless-catch
    try {
      // Tìm người dùng dựa trên số điện thoại
      const user = await Account.findOne({ phone })
      console.log('User: ' + user)

      if (!user) {
        throw new Error('Người dùng không tồn tại')
      }

      // Kiểm tra mật khẩu
      // const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')

      if (data.password !== user.password) {
        throw new Error('Sai mật khẩu')
      }

      if (user.role !== role) {
        throw new Error('Vai trò người dùng không hợp lệ')
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
