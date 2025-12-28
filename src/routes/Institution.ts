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
  updateMachineStock,
} from "../controllers/institution";
import { InstituteLoginType, InstituteRegisterType, InstituteUpdateType } from "../types/institution";
import { authGuard, verifyUser } from "../middlewares/auth";
import { VendingMachineUpdateStockType } from "../types/vendingMachine";

export const institutionRoutes = new Elysia({ prefix: "/institutes" })
  .use(errorPlugin)
  .use(jwtMiddlewareInstitution)
  .post("/login", async ({ body, jwt_institution }) => await loginInstitution(body as InstituteLoginType, jwt_institution))
  .post("/", async ({ body, jwt_institution }) => await createInstitution(body as InstituteRegisterType, jwt_institution))
  .use(authGuard("institution"))
  .guard({
    beforeHandle: verifyUser
  }, (app) => app
    .get("/me", ({ user }) => authenticateInstitution(user._id))
    .patch("/update", ({ body, user }) => updateInstitution(user._id, body as Partial<InstituteUpdateType>))
    .delete("/delete", ({ user }) => deleteInstitution(user._id))
    .get("/machines", ({ user }) => getVendingMachines(user._id))
    .patch("/machines", ({ body, user }) => updateMachineStock(user._id, body as Partial<VendingMachineUpdateStockType>))
  );
