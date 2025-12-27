import { Elysia } from "elysia";
import {
  createMachine,
  updateMachine,
  deleteMachine,
  purchaseItem,
} from "../controllers/vending";
import { VendingMachineCreationType, VendingMachineUpdateDetailsType, VendingMachineUpdateStockType } from "../types/vendingMachine";

export const vendingRoutes = new Elysia({ prefix: "/machines" })
  .post("/", async ({ body }) => await createMachine(body as VendingMachineCreationType))
  .patch("/:id", async ({ params, body }) => await updateMachine(params.id, body as VendingMachineUpdateDetailsType))
  .delete("/:id", async ({ params }) => await deleteMachine(params.id))
  .patch("/:id/purchase", async ({ params, body }) => await purchaseItem(params.id, body as VendingMachineUpdateStockType));