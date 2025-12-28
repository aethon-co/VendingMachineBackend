import { Elysia } from "elysia";
import { connectDB } from "./db/dbConnect";
import 'dotenv/config';
import { institutionRoutes } from "./routes/Institution";
import { errorPlugin } from "./errors/handler";
import { vendingRoutes } from "./routes/vendingMachine";
import { adminRoutes } from "./routes/admin";

const app = new Elysia();

connectDB();

app.get("/", () => "Hello Vending Machine");
app.use(errorPlugin);
app.use(institutionRoutes);
app.use(vendingRoutes)
app.use(adminRoutes)

app.listen(process.env.PORT || 3000);
console.log("Server is up and running");