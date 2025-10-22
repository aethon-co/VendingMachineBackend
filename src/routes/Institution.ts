import { Elysia } from "elysia";
import {
  getAllInstitutions,
  getInstitutionById,
  createInstitution,
  updateInstitution,
  deleteInstitution,
} from "../controllers/institution";
import { InstituteType} from "../types/vendingMachine";

export const vendingRoutes = new Elysia()
  .get("/institutions", async () => {
    return await getAllInstitutions();
  })
  .get("/institution/:id", async ({ params }) => {
    return await getInstitutionById(params.id);
  })
  .post("/institutions", async (context) => {
    const body = context.body as InstituteType;
    return await createInstitution(body);
  })
  .put("/institution/:id", async ({ params, body }) => {
    return await updateInstitution(params.id, body);
  })
  .delete("/institution/:id", async ({ params }) => {
    return await deleteInstitution(params.id);
  });
