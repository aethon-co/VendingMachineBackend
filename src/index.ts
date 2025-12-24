import { Elysia } from "elysia";
import { connectDB } from "./db/dbConnect";
import 'dotenv/config';
import { institutionRoutes } from "./routes/Institution";
import { vendingRoutes } from "./routes/vendingMachine";


const app = new Elysia();

await connectDB();
import { jwt } from '@elysiajs/jwt'

app.use(
  jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET!,
    exp: '15m'
  })
)


app.get("/", () => "Hello Vending Machine");
app.use(institutionRoutes);
app.use(vendingRoutes)

app.listen(process.env.PORT || 3000);
console.log("Server is up and running");