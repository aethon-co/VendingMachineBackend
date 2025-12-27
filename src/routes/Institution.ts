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
import { authGuard, verifyUser } from "../middlewares/auth";

export const institutionRoutes = new Elysia({ prefix: "/institutes" })
  .use(jwtMiddleware)
  .get("/", async () => await getAllInstitutions())
  .post("/login", async ({ body, jwt_institution }) => await loginInstitution(body as InstituteLoginType, jwt_institution))
  .get("/:id", async ({ params }: { params: { id: string } }) => await getInstitutionById(params.id))
  .post("/", async ({ body, jwt_institution }) => await createInstitution(body as InstituteRegisterType, jwt_institution))
  .use(authGuard)
  .guard({
    beforeHandle: verifyUser
  }, (app) => app
    .get("/me", ({ user }) => authenticateInstitution(user.id))
    .patch("/update", ({ body, user }) => updateInstitution(user.id, body as Partial<InstituteUpdateType>))
    .delete("/delete", ({ user }) => deleteInstitution(user.id))
  );
