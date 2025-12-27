import { Elysia } from "elysia";
import { connectDB } from "./db/dbConnect";
import 'dotenv/config';
import { institutionRoutes } from "./routes/Institution";
import { vendingRoutes } from "./routes/vendingMachine";
import { jwtMiddleware } from "./middlewares/jwtInstitution";


const app = new Elysia();

await connectDB();

app.use(jwtMiddleware)


app.get("/", () => "Hello Vending Machine");
app.use(institutionRoutes);
app.use(vendingRoutes)

app.listen(process.env.PORT || 3000);
console.log("Server is up and running");