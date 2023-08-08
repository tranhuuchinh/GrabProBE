export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_PORT: number
      DB_USER: string
      PORT_AUTH: number
      PORT_CUSTOMER: number
      PORT_DRIVER: number
      PORT_CALLCENTER: number
      PORT_ADMIN: number
      PORT_GEOLOCATION: number
      PORT_COORDINATOR: number
      ENV: 'test' | 'dev' | 'prod'
      DB_DATABASE: string
    }
  }
}
