import Elysia from "elysia";
import { UnauthorizedError } from "../errors/handler.js";

export const authGuard = (role: "institution" | "admin" | "vending") => (app: Elysia) =>
    app.derive(async ({ jwt_institution, jwt_admin, jwt_vending_machine, headers }: any) => {
        const auth = headers.authorization;
        const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;

        if (!token) return { user: null };

        const verifiers = {
            admin: jwt_admin,
            institution: jwt_institution,
            vending: jwt_vending_machine
        };

        const verifier = verifiers[role];

        try {
            const payload = await verifier.verify(token);
            return { user: payload || null, role };
        } catch (error) {
            return { user: null };
        }
    });

export const verifyUser = ({ user }: any) => {
    if (!user) {
        throw new UnauthorizedError('Invalid token or expired token');
    }
};