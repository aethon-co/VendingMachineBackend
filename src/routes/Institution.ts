import { Elysia } from "elysia";
import { jwtMiddleware } from "../middlewares/jwtInstitution";
import {
  getAllInstitutions,
  getInstitutionById,
  createInstitution,
  updateInstitution,
  deleteInstitution,
  authenticateInstitution,
  loginInstitution,
} from "../controllers/institution";
import { InstituteLoginType, InstituteRegisterType, InstituteUpdateType } from "../types/institution";

export const institutionRoutes = new Elysia({ prefix: "/institutes" })
  .use(jwtMiddleware)
  .get("/", async () => await getAllInstitutions())
  .post("/login", async ({ body, jwt }: any) => await loginInstitution(body as InstituteLoginType, jwt))
  .get("/me", async ({ headers, jwt }: any) => await authenticateInstitution(jwt, headers.authorization))
  .get("/:id", async ({ params }: { params: { id: string } }) => await getInstitutionById(params.id))
  .post("/", async ({ body, jwt }: any) => await createInstitution(body as InstituteRegisterType, jwt))
  .patch("/:id", async ({ params, body }) => await updateInstitution(params.id, body as Partial<InstituteUpdateType>))
  .delete("/:id", async ({ params }: { params: { id: string } }) => await deleteInstitution(params.id));
