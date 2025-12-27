import { Elysia } from "elysia";
import {
  createMachine,
  updateMachine,
  deleteMachine,
  purchaseItem,
  authenticateMachine,
} from "../controllers/vending";
import { VendingMachineCreationType, VendingMachineUpdateDetailsType, VendingMachineUpdateStockType } from "../types/vendingMachine";
import { jwtMiddlewareVendingMachine } from "../middlewares/jwtVendingMachine";
import { authGuard, verifyUser } from "../middlewares/auth";

export const vendingRoutes = new Elysia({ prefix: "/machines" })
  .use(jwtMiddlewareVendingMachine)
  .post("/", async ({ body, jwt_vending_machine }) => await createMachine(body as VendingMachineCreationType, jwt_vending_machine))
  .use(authGuard)
  .guard({
    beforeHandle: verifyUser
  }, (app) => app
    .get("/me", ({ user }) => authenticateMachine(user._id))
    .patch("/update", ({ body, user }) => updateMachine(user._id, body as Partial<VendingMachineUpdateDetailsType>))
    .delete("/delete", ({ user }) => deleteMachine(user._id))
    .patch("/:id/purchase", async ({ user, body }) => await purchaseItem(user._id, body as VendingMachineUpdateStockType))
  )