import { Elysia } from "elysia";
import { errorPlugin } from "../errors/handler";
import { checkQRPayment, closePaymentQR, createPaymentQR, getMachineStatus, heartbeat, initMachine, purchase } from "../controllers/vendingMachine";

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
    .post("/payment/create-qr", async ({ body }) => {
        const { machine_id, secret_token, amount } = body as { machine_id: string; secret_token: string; amount: number };
        return await createPaymentQR(machine_id, secret_token, amount);
    })
    .post("/payment/check-qr", async ({ body }) => {
        const { machine_id, secret_token, qr_id } = body as { machine_id: string; secret_token: string; qr_id: string };
        return await checkQRPayment(machine_id, secret_token, qr_id);
    })
    .post("/payment/close-qr", async ({ body }) => {
        const { machine_id, secret_token, qr_id } = body as { machine_id: string; secret_token: string; qr_id: string };
        return await closePaymentQR(machine_id, secret_token, qr_id);
    })
    .get("/status/:id", async ({ params }) => {
        return await getMachineStatus(params.id);
    });
