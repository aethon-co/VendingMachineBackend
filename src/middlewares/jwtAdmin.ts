import { jwt } from '@elysiajs/jwt'

export const jwtMiddleware = jwt({
    name: 'jwt',
    secret: process.env.JWT_ADMIN_SECRET!,
    exp: '15m'
})
