import { Elysia } from "elysia";
import { jwtMiddlewareInstitution } from "../middlewares/jwtInstitution";
import { errorPlugin } from "../errors/handler";
import {
  createInstitution,
  updateInstitution,
  deleteInstitution,
  authenticateInstitution,
  loginInstitution,
  getVendingMachines,
  getVendingMachineById,
  deleteMachineForInstitution,
  updateMachineStock,
  linkMachineToInstitution,
} from "../controllers/institution";
import { InstituteLoginType, InstituteRegisterType, InstituteUpdateType } from "../types/institution";
import { authGuard, verifyUser } from "../middlewares/auth";
import { VendingMachineUpdateStockType } from "../types/vendingMachine";

export const institutionRoutes = new Elysia({ prefix: "/institution" })
  .use(errorPlugin)
  .use(jwtMiddlewareInstitution)
  .post("/signup", async ({ body, jwt_institution }) => await createInstitution(body as InstituteRegisterType, jwt_institution))
  .post("/login", async ({ body, jwt_institution }) => await loginInstitution(body as InstituteLoginType, jwt_institution))
  .use(authGuard("institution"))
  .guard({
    beforeHandle: verifyUser
  }, (app) => app
    .get("/me", ({ user }) => authenticateInstitution(user.id))
    .patch("/update", ({ body, user }) => updateInstitution(user.id, body as Partial<InstituteUpdateType>))
    .delete("/delete", ({ user }) => deleteInstitution(user.id))
    .get("/machines", ({ user }) => getVendingMachines(user.id))
    .get("/machines/:id", ({ user, params }) => getVendingMachineById(user.id, params.id))
    .post("/machines/link", ({ body, user }) => linkMachineToInstitution(user.id, (body as any).machine_id))
    .patch("/machines/:id", ({ body, user, params }) => updateMachineStock(user.id, params.id, body as Partial<VendingMachineUpdateStockType>))
    .delete("/machines/:id", ({ user, params }) => deleteMachineForInstitution(user.id, params.id))
  );
