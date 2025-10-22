import { Elysia } from "elysia";
import {
  getAllMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
} from "../controllers/vending";
import { VendingMachineType } from "../types/vendingMachine";

export const vendingRoutes = new Elysia({ prefix: "/machines" })
  .get("/", async () => await getAllMachines())
  .get("/:id", async ({ params }) => await getMachineById(params.id))
  .post("/", async ({ body }) => await createMachine(body as VendingMachineType))
  .patch("/:id", async ({ params, body }) => await updateMachine(params.id, body))
  .delete("/:id", async ({ params }) => await deleteMachine(params.id));
