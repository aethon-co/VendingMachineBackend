import { Elysia } from 'elysia';

export class NotFoundError extends Error { }
export class BadRequestError extends Error { }
export class UnauthorizedError extends Error { }

export const errorPlugin = new Elysia()
    .error({
        NOT_FOUND: NotFoundError,
        BAD_REQUEST: BadRequestError,
        UNAUTHORIZED: UnauthorizedError
    })
    .onError(({ code, error, set }) => {
        switch (code) {
            case 'NOT_FOUND':
                set.status = 404;
                return { status: 404, message: error.message };
            case 'BAD_REQUEST':
                set.status = 400;
                return { status: 400, message: error.message };
            case 'UNAUTHORIZED':
                set.status = 401;
                return { status: 401, message: error.message };
            case 'VALIDATION':
                set.status = 422;
                return { status: 422, message: 'Validation failed', errors: error.all };
            case 'INTERNAL_SERVER_ERROR':
                set.status = 500;
                return { status: 500, message: 'Internal Server Error' };
        }
    });