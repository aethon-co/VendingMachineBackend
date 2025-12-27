import { Elysia } from "elysia";
import {
  getAllMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
} from "../controllers/vending";
import { VendingMachineCreationType, VendingMachineUpdateDetailsType } from "../types/vendingMachine";

export const vendingRoutes = new Elysia({ prefix: "/machines" })
  .get("/", async () => await getAllMachines())
  .get("/:id", async ({ params }) => await getMachineById(params.id))
  .post("/", async ({ body }) => await createMachine(body as VendingMachineCreationType))
  .patch("/:id", async ({ params, body }) => await updateMachine(params.id, body as VendingMachineUpdateDetailsType))
  .delete("/:id", async ({ params }) => await deleteMachine(params.id));
