import { Elysia } from 'elysia';

export class NotFoundError extends Error {
    public status = 404;
    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
    }
}

export class BadRequestError extends Error {
    public status = 400;
    constructor(message: string) {
        super(message);
        this.name = 'BadRequestError';
    }
}

export class UnauthorizedError extends Error {
    public status = 401;
    constructor(message: string) {
        super("Unauthorized Access: " + message);
        this.name = 'UnauthorizedError';
    }
}

export const errorPlugin = new Elysia()
    .error({
        NOT_FOUND: NotFoundError,
        BAD_REQUEST: BadRequestError,
        UNAUTHORIZED: UnauthorizedError
    })
    .onError(({ code, error, set }) => {
        console.log('Error caught:', code, error);

        if ((error as any).status) {
            set.status = (error as any).status;
            return { message: (error as Error).message };
        }

        switch (code) {
            case 'VALIDATION':
                set.status = 422;
                return {
                    message: 'Validation failed',
                    errors: (error as any).all ?? error
                };

            default:
                set.status = 500;
                return {
                    message: (error as Error).message || 'Internal Server Error'
                };
        }
    });
