import { jwt } from '@elysiajs/jwt'

export const jwtMiddleware = jwt({
    name: 'jwt',
    secret: process.env.JWT_VENDING_MACHINE_SECRET!,
    exp: '15m'
})
