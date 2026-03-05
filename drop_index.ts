import { connectDB } from "./src/db/dbConnect";
import { Admin } from "./src/models/admin";

async function run() {
    await connectDB();
    try {
        await Admin.collection.dropIndex("email_1");
        console.log("Dropped email index");
    } catch (e) {
        console.log("No email index to drop");
    }
    process.exit(0);
}

run();
