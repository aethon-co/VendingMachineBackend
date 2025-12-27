import { jwt } from '@elysiajs/jwt'
import { t } from 'elysia'

export const jwtMiddlewareVendingMachine = jwt({
    name: 'jwt_vending_machine',
    secret: process.env.JWT_VENDING_MACHINE_SECRET!,
    exp: '15m',
    schema: t.Object({
        _id: t.String(),
        role: t.String(),
    })
})
