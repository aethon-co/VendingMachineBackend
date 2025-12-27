import Elysia from "elysia";
import { jwtMiddleware } from "../middlewares/jwtAdmin";
import { authenticateAdmin, createAdmin, deleteAdmin, getAllInstitutions, getInstitutionById, loginAdmin, updateAdmin } from "../controllers/admin";
import { AdminLoginType, AdminRegisterType, AdminUpdateType } from "../types/admin";
import { verifyUser } from "../middlewares/auth";
import { authGuard } from "../middlewares/auth";

export const adminRoutes = new Elysia({ prefix: "/admin" })
    .use(jwtMiddleware)
    .post("/", async ({ body, jwt_admin }) => await createAdmin(body as AdminRegisterType, jwt_admin))
    .post("/login", async ({ body, jwt_admin }) => await loginAdmin(body as AdminLoginType, jwt_admin))
    .use(authGuard)
    .guard({
        beforeHandle: verifyUser
    }, (app) => app
        .get("/me", ({ user }) => authenticateAdmin(user.id))
        .patch("/update", ({ body, user }) => updateAdmin(user.id, body as Partial<AdminUpdateType>))
        .delete("/delete", ({ user }) => deleteAdmin(user.id))
        .get("/institutions", async () => await getAllInstitutions())
        .get("/institutions/:id", async ({ params }) => await getInstitutionById(params.id))
    )
