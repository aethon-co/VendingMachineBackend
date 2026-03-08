import { Elysia } from "elysia";
import { connectDB } from "./db/dbConnect.js";
import 'dotenv/config';
import { institutionRoutes } from "./routes/Institution.js";
import { errorPlugin } from "./errors/handler.js";
import { adminRoutes } from "./routes/admin.js";
import { vendingMachineRoutes } from "./routes/vendingMachine.js";

import { uploadRoutes } from "./routes/upload.js";
import cors from "@elysiajs/cors";

const app = new Elysia();
app.use(cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

connectDB();

app.get("/", () => "Hello Vending Machine");
app.use(errorPlugin);
app.use(institutionRoutes);
app.use(adminRoutes);
app.use(vendingMachineRoutes);
app.use(uploadRoutes);

// Listen locally if true, otherwise let Vercel handle the exported web standard fetch API
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    app.listen(process.env.PORT || 3000);
    console.log("Server is up and running");
}

export default app;