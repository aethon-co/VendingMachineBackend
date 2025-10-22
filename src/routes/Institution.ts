import { Elysia } from "elysia";
import {
  getAllInstitutions,
  getInstitutionById,
  createInstitution,
  updateInstitution,
  deleteInstitution,
} from "../controllers/institution";
import { InstituteType } from "../types/vendingMachine";

export const institutionRoutes = new Elysia({ prefix: "/institutes" })
  .get("/", async () => await getAllInstitutions())
  .get("/:id", async ({ params }) => await getInstitutionById(params.id))
  .post("/", async ({ body }) => await createInstitution(body as InstituteType))
  .patch("/:id", async ({ params, body }) => await updateInstitution(params.id, body))
  .delete("/:id", async ({ params }) => await deleteInstitution(params.id));
