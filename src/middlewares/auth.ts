import { Elysia } from 'elysia'

export const auth = new Elysia({ name: 'auth' }).derive(
  async (context) => {
    const { headers, jwt, set } = context as typeof context & {
      jwt: {
        verify: (token: string) => Promise<any | false>
      }
    }
    const authHeader = headers.authorization

    if (!authHeader) {
      set.status = 402
      throw new Error('Unauthorized')
    }

    const token = authHeader.replace('Bearer ', '')
    const payload = await jwt.verify(token)

    if (!payload) {
      set.status = 401
      throw new Error('Invalid token')
    }

    return {
      user: payload
    }
  }
)
