import { Elysia } from "elysia";
import { connectDB } from "./db/dbConnect";
import 'dotenv/config';

const app = new Elysia();

await connectDB();

app.get("/", () => "Hello Vending Machine");

app.listen(process.env.PORT || 3000);
console.log("Server is up and running");