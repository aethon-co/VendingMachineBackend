import { Elysia } from "elysia";
import { connectDB } from "./db/dbConnect";
import 'dotenv/config';
import { institutionRoutes } from "./routes/Institution";
import { errorPlugin } from "./errors/handler";
import { adminRoutes } from "./routes/admin";
<<<<<<< HEAD
import { vendingMachineRoutes } from "./routes/vendingMachine";
=======
import { maintenanceRoutes } from "./routes/maintenance";
>>>>>>> a6ff7b6862c6c19005548952fcdcadf53de3a127

const app = new Elysia();

connectDB();

app.get("/", () => "Hello Vending Machine");
app.use(errorPlugin);
app.use(institutionRoutes);
app.use(adminRoutes);
<<<<<<< HEAD
app.use(vendingMachineRoutes);
=======
app.use(maintenanceRoutes);
>>>>>>> a6ff7b6862c6c19005548952fcdcadf53de3a127

app.listen(process.env.PORT || 3000);
console.log("Server is up and running");