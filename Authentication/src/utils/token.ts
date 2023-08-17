import jwt, { Secret } from 'jsonwebtoken'

const signToken = (phone: string, expires: string | null = null) => {
  const secret: Secret = !expires ? process.env.ACCESS_TOKEN_SECRET || '' : process.env.REFRESH_TOKEN_SECRET || ''
  const expiresIn: string = !expires
    ? process.env.JWT_EXPIRES_IN || '360d'
    : process.env.JWT_EXPIRES_IN_REFRESH || '360d'

  return jwt.sign({ phone }, secret, {
    expiresIn: expiresIn
  })
}

export const createSendToken = async (user: any) => {
  const token = signToken(user.phone)
  const newRefreshToken = signToken(user.phone, 'refresh')
  // Save refresh token to DB
  // user.refreshToken.push(newRefreshToken);
  const result = await user.save()

  // Remove sensitive data from output
  user.password = undefined
  user.refreshToken = undefined

  return {
    access_token: token,
    refresh_token: newRefreshToken,
    user
  }
}
