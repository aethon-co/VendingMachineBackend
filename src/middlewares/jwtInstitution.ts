import { jwt } from '@elysiajs/jwt'
import { t } from 'elysia'

export const jwtMiddlewareInstitution = jwt({
    name: 'jwt_institution',
    secret: process.env.JWT_INSTITUTION_SECRET!,
    exp: '7d',
    schema: t.Object({
        id: t.String(),
        mail: t.String(),
        role: t.String(),
    })
})
