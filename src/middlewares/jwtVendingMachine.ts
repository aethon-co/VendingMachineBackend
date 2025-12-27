import { jwt } from '@elysiajs/jwt'
import { t } from 'elysia'

export const jwtMiddleware = jwt({
    name: 'jwt_vending_machine',
    secret: process.env.JWT_VENDING_MACHINE_SECRET!,
    exp: '15m',
    schema: t.Object({
        id: t.String(),
        name: t.String(),
        role: t.String(),
    })
})
