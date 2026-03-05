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
<<<<<<< HEAD
  linkMachineToInstitution,
=======
  generateQrToken,
  verifyQrToken,
  updateMachineDetails,
>>>>>>> a6ff7b6862c6c19005548952fcdcadf53de3a127
} from "../controllers/institution";
import { InstituteLoginType, InstituteRegisterType, InstituteUpdateType } from "../types/institution";
import { authGuard, verifyUser } from "../middlewares/auth";
import { VendingMachineUpdateStockType, VendingMachineUpdateDetailsType } from "../types/vendingMachine";

export const institutionRoutes = new Elysia({ prefix: "/institution" })
  .use(errorPlugin)
  .use(jwtMiddlewareInstitution)
  .post("/login", async ({ body, jwt_institution }) => await loginInstitution(body as InstituteLoginType, jwt_institution))
  .post("/", async ({ body, jwt_institution }) => await createInstitution(body as InstituteRegisterType, jwt_institution))
  .use(authGuard("institution"))
  .guard({
    beforeHandle: verifyUser
  }, (app) => app
    .get("/me", ({ user }) => authenticateInstitution(user.id))
    .patch("/update", ({ body, user }) => updateInstitution(user.id, body as Partial<InstituteUpdateType>))
    .delete("/delete", ({ user }) => deleteInstitution(user.id))
    .get("/machines", ({ user }) => getVendingMachines(user.id))
    .get("/machines/:id", ({ user, params }) => getVendingMachineById(user.id, params.id))
<<<<<<< HEAD
    .post("/machines/link", ({ body, user }) => linkMachineToInstitution(user.id, (body as any).machine_id))
    .patch("/machines/:id", ({ body, user, params }) => updateMachineStock(user.id, params.id, body as Partial<VendingMachineUpdateStockType>))
=======
    .post("/machines", ({ body, user }) => createMachineForInstitution(user.id, body as { name: string; location?: string; imageUrl?: string }))
    .patch("/machines/:id/stock", ({ body, user, params }) => updateMachineStock(user.id, params.id, body as Partial<VendingMachineUpdateStockType>))
    .patch("/machines/:id/details", ({ body, user, params }) => updateMachineDetails(user.id, params.id, body as Partial<VendingMachineUpdateDetailsType>))
>>>>>>> a6ff7b6862c6c19005548952fcdcadf53de3a127
    .delete("/machines/:id", ({ user, params }) => deleteMachineForInstitution(user.id, params.id))
    .post("/machines/:id/qr", ({ user, params }) => generateQrToken(user.id, params.id))
    .post("/machines/verify-qr", ({ user, body }) => verifyQrToken(user.id, (body as { qrToken: string }).qrToken))
  );
