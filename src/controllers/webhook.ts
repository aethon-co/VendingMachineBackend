import { createHmac } from "node:crypto";
import { Transaction } from "../models/transaction.js";
import { VendingMachine } from "../models/vendingMachine.js";
import { BadRequestError } from "../errors/handler.js";

/**
 * Handles Razorpay webhooks.
 * The machine polls checkTransactionStatus, which becomes 'paid' 
 * immediately after this webhook processes.
 */
export const handleRazorpayWebhook = async ({ request, body }: { request: Request, body: any }) => {
    const signature = request.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !secret) {
        console.error("[Webhook] Missing signature or secret");
        throw new BadRequestError("Unauthorized");
    }

    // Verify signature using standard Node crypto (available in Bun)
    const rawBody = JSON.stringify(body);
    const hmac = createHmac("sha256", secret).update(rawBody).digest("hex");

    // Note: In some environments/versions, signature verification might differ. 
    // Razorpay's typical verification is comparing the signature directly.
    if (hmac !== signature) {
        console.error("[Webhook] Invalid signature");
        throw new BadRequestError("Invalid signature");
    }

    const event = body.event;
    console.log(`[Webhook] Received Razorpay event: ${event}`);

    if (event === "payment.captured" || event === "order.paid") {
        const payload = body.payload.payment?.entity || body.payload.order?.entity;
        const qrId = payload?.qr_code_id || payload?.notes?.qr_id;
        const paymentId = payload?.id;

        if (!qrId) {
            console.warn("[Webhook] No QR ID found in payload");
            return { status: "ignored" };
        }

        const transaction = await Transaction.findOne({ qr_id: qrId, status: "pending" });
        if (!transaction) {
            console.warn(`[Webhook] No pending transaction found for QR: ${qrId}`);
            return { status: "not_found" };
        }

        // 1. Deduct stock from machine
        const machine = await VendingMachine.findById(transaction.machine_id);
        if (machine) {
            let itemsUpdated = false;
            for (const purchased of transaction.items) {
                const itemIndex = machine.items.findIndex(i => i.row === purchased.row);
                if (itemIndex > -1 && machine.items[itemIndex].quantity >= purchased.quantity) {
                    machine.items[itemIndex].quantity -= purchased.quantity;
                    itemsUpdated = true;
                }
            }
            if (itemsUpdated) {
                machine.markModified('items');
                await machine.save();
                console.log(`[Webhook] Stock updated for machine ${machine.name}`);
            }
        }

        // 2. Mark transaction as paid
        transaction.status = "paid";
        transaction.payment_id = paymentId;
        await transaction.save();

        console.log(`[Webhook] Transaction ${qrId} marked as PAID`);
    }

    return { status: "ok" };
};
