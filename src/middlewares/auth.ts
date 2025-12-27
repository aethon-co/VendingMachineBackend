import Elysia from "elysia";

export const authGuard = (app: Elysia) =>
    app.derive(async ({ jwt_institution, headers }: any) => {
        const auth = headers.authorization;
        const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;

        if (!token) return { user: null };

        const payload = await jwt_institution.verify(token);

        return { user: payload || null };
    });

export const verifyUser = ({ user, set }: any) => {
    if (!user) {
        set.status = 402;
        return { error: 'Unauthorized: Invalid token or session expired' };
    }
};