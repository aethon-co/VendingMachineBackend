import { Elysia } from "elysia";
import { connectDB } from "./db/dbConnect";
import 'dotenv/config';
import { institutionRoutes } from "./routes/Institution";
import { errorPlugin } from "./errors/handler";
import { adminRoutes } from "./routes/admin";
import { vendingMachineRoutes } from "./routes/vendingMachine";

import { uploadRoutes } from "./routes/upload";

const app = new Elysia();

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