import { connect } from 'mongoose';
import { VendingMachine } from './src/models/vendingMachine.ts';

const MONGOURL = process.env.MONGOURL || "mongodb+srv://contactaethon_db_user:vbKBhEDZ^SVJftSCdwqFXU1D3jD@gym.yewk3dp.mongodb.net/VendingMachine?appName=GYM";

async function run() {
    await connect(MONGOURL);
    const machines = await VendingMachine.find({});
    console.log(JSON.stringify(machines, null, 2));
    process.exit(0);
}

run();
