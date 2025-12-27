import { jwt } from '@elysiajs/jwt'
import { t } from 'elysia'

export const jwtMiddleware = jwt({
    name: 'jwt_admin',
    secret: process.env.JWT_ADMIN_SECRET!,
    exp: '15m',
    schema: t.Object({
        name: t.String(),
        email: t.String(),
        role: t.String(),
    })
})
