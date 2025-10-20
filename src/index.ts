import { Elysia } from "elysia";
import { connectDB } from "./db/dbConnect";

const app = new Elysia();

await connectDB();

app.get("/", () => "Hello Vending Machine");

app.listen(3000);
console.log("Server is up and running");