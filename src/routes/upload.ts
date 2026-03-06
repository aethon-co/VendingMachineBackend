import { Elysia, t } from "elysia";
import { uploadImageToS3 } from "../controllers/upload";
import { jwtMiddlewareInstitution } from "../middlewares/jwtInstitution";
import { authGuard, verifyUser } from "../middlewares/auth";

export const uploadRoutes = new Elysia({ prefix: "/upload" })
    .use(jwtMiddlewareInstitution)
    .use(authGuard("institution"))
    .guard({
        beforeHandle: verifyUser
    }, (app) => app
        .post(
            "/image",
            async ({ body, set }) => {
                try {
                    const file = body.file as File;
                    if (!file) {
                        set.status = 400;
                        return { error: "No file provided" };
                    }

                    const url = await uploadImageToS3(file);
                    return { url };
                } catch (error: any) {
                    console.error("S3 Upload error:", error);
                    set.status = 500;
                    return { error: error.message };
                }
            },
            {
                body: t.Object({
                    file: t.File(),
                }),
            }
        )
    );
