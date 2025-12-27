import { jwt } from '@elysiajs/jwt'
import { t } from 'elysia'

export const jwtMiddlewareInstitution = jwt({
    name: 'jwt_institution',
    secret: process.env.JWT_INSTITUTION_SECRET!,
    exp: '15m',
    schema: t.Object({
        _id: t.String(),
        mail: t.String(),
        role: t.String(),
    })
})
