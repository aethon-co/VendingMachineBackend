import { Elysia } from "elysia";
import { errorPlugin } from "../errors/handler";
import { getMachineStatus, heartbeat, initMachine, purchase } from "../controllers/vendingMachine";

export const vendingMachineRoutes = new Elysia({ prefix: "/vending" })
    .use(errorPlugin)
    .post("/init", async ({ body }) => {
        const { secret_token } = body as { secret_token: string };
        return await initMachine(secret_token);
    })
    .post("/heartbeat", async ({ body }) => {
        const { machine_id, secret_token } = body as { machine_id: string; secret_token: string };
        return await heartbeat(machine_id, secret_token);
    })
    .post("/purchase", async ({ body }) => {
        const { machine_id, secret_token, items } = body as { machine_id: string; secret_token: string; items: { row: number, quantity: number }[] };
        return await purchase(machine_id, secret_token, items);
    })
    .get("/status/:id", async ({ params }) => {
        return await getMachineStatus(params.id);
    });
