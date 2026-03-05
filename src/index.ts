import { Elysia } from "elysia";
import { connectDB } from "./db/dbConnect";
import 'dotenv/config';
import { institutionRoutes } from "./routes/Institution";
import { errorPlugin } from "./errors/handler";
import { adminRoutes } from "./routes/admin";
import { vendingMachineRoutes } from "./routes/vendingMachine";

const app = new Elysia();

connectDB();

app.get("/", () => "Hello Vending Machine");
app.use(errorPlugin);
app.use(institutionRoutes);
app.use(adminRoutes);
app.use(vendingMachineRoutes);

app.listen(process.env.PORT || 3000);
console.log("Server is up and running");