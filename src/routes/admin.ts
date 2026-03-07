import Elysia from "elysia";
import { jwtMiddlewareAdmin } from "../middlewares/jwtAdmin";
import { errorPlugin } from "../errors/handler";
import { authenticateAdmin, createAdmin, deleteAdmin, getAllInstitutions, getAllMachines, getInstitutionById, getMachineById, loginAdmin, updateAdmin, createVendingMachine, updateVendingMachine } from "../controllers/admin";
import { AdminLoginType, AdminRegisterType, AdminUpdateType } from "../types/admin";
import { verifyUser } from "../middlewares/auth";
import { authGuard } from "../middlewares/auth";

export const adminRoutes = new Elysia({ prefix: "/admin" })
    .use(errorPlugin)
    .use(jwtMiddlewareAdmin)
    .post("/signup", async ({ body, jwt_admin }) => await createAdmin(body as AdminRegisterType, jwt_admin))
    .post("/login", async ({ body, jwt_admin }) => await loginAdmin(body as AdminLoginType, jwt_admin))
    .use(authGuard("admin"))
    .guard({
        beforeHandle: verifyUser
    }, (app) => app
        .get("/me", ({ user }) => authenticateAdmin(user.id))
        .patch("/update", ({ body, user }) => updateAdmin(user.id, body as Partial<AdminUpdateType>))
        .delete("/delete", ({ user }) => deleteAdmin(user.id))
        .get("/institutions", async () => await getAllInstitutions())
        .get("/institutions/:id", async ({ params }) => await getInstitutionById(params.id))
        .post("/machines", async ({ body }) => await createVendingMachine(body as any))
        .get("/machines", async () => await getAllMachines())
        .get("/machines/:id", async ({ params }) => await getMachineById(params.id))
        .patch("/machines/:id", async ({ params, body }) => await updateVendingMachine(params.id, body as any))
    )
