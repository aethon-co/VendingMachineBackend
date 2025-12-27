import { jwt } from '@elysiajs/jwt'
import { t } from 'elysia'

export const jwtMiddlewareAdmin = jwt({
    name: 'jwt_admin',
    secret: process.env.JWT_ADMIN_SECRET!,
    exp: '15m',
    schema: t.Object({
        _id: t.String(),
        email: t.String(),
        role: t.String(),
    })
})
