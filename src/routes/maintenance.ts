import { Elysia } from "elysia";
import { jwtMiddlewareInstitution } from "../middlewares/jwtInstitution.js";
import { errorPlugin } from "../errors/handler.js";
import { authGuard, verifyUser } from "../middlewares/auth.js";
import {
  getMaintenanceLogs,
  createMaintenanceLog,
  updateMaintenanceLog,
  deleteMaintenanceLog,
} from "../controllers/maintenance.js";
import { CreateMaintenanceLogType, UpdateMaintenanceLogType } from "../types/maintenanceLog.js";

export const maintenanceRoutes = new Elysia({ prefix: "/maintenance" })
  .use(errorPlugin)
  .use(jwtMiddlewareInstitution)
  .use(authGuard("institution"))
  .guard({ beforeHandle: verifyUser }, (app) =>
    app
      .get("/machine/:machineId", ({ user, params }) =>
        getMaintenanceLogs(user.id, params.machineId)
      )
      .post("/", ({ user, body }) =>
        createMaintenanceLog(user.id, body as CreateMaintenanceLogType)
      )
      .patch("/:logId", ({ user, params, body }) =>
        updateMaintenanceLog(user.id, params.logId, body as UpdateMaintenanceLogType)
      )
      .delete("/:logId", ({ user, params }) =>
        deleteMaintenanceLog(user.id, params.logId)
      )
  );
