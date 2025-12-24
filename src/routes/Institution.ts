import { Elysia } from "elysia";
import {
  getAllInstitutions,
  getInstitutionById,
  createInstitution,
  updateInstitution,
  deleteInstitution,
  authenticateInstitution,
  loginInstitution,
} from "../controllers/institution";
import { InstituteType } from "../types/vendingMachine";

export const institutionRoutes = new Elysia({ prefix: "/institutes" })
  .get("/", async () => await getAllInstitutions())
  .post("/login", async ({ body, jwt }: any) => await loginInstitution(body as Pick<InstituteType, "mail" | "password">, jwt))
  .get("/me", async ({ headers, jwt }: any) => await authenticateInstitution(jwt, headers.authorization))
  .get("/:id", async ({ params }) => await getInstitutionById(params.id))
  .post("/", async ({ body }) => await createInstitution(body as InstituteType))
  .patch("/:id", async ({ params, body }) => await updateInstitution(params.id, body as Partial<InstituteType>))
  .delete("/:id", async ({ params }) => await deleteInstitution(params.id));
