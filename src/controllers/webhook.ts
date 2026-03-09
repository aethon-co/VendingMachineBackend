import { createHmac } from "node:crypto";
import { Transaction } from "../models/transaction.js";
import { VendingMachine } from "../models/vendingMachine.js";
import { BadRequestError } from "../errors/handler.js";

/**
 * Handles Razorpay webhooks.
 * The machine polls checkTransactionStatus, which becomes 'paid' 
 * immediately after this webhook processes.
 */
export const handleRazorpayWebhook = async ({ request, rawBody }: { request: Request, rawBody: string }) => {
    const body = JSON.parse(rawBody);
    const signature = request.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !secret) {
        console.error(`[Webhook] ERROR: Signature or Secret missing! Secret: ${secret ? 'Set' : 'MISSING'}, Signature: ${signature ? 'Set' : 'MISSING'}.`);
        throw new BadRequestError("Unauthorized");
    }

    // Verify signature using the RAW request body specifically
    const hmac = createHmac("sha256", secret).update(rawBody).digest("hex");

    // Note: In some environments/versions, signature verification might differ. 
    // Razorpay's typical verification is comparing the signature directly.
    if (hmac !== signature) {
        console.error("[Webhook] Invalid signature");
        throw new BadRequestError("Invalid signature");
    }

    const event = body.event;
    console.log(`[Webhook] Received Razorpay event: ${event}. Payload Sample (QR ID): ${body.payload?.payment?.entity?.qr_code_id || body.payload?.payment?.entity?.notes?.qr_id || 'N/A'}`);

    if (event === "payment.captured" || event === "order.paid") {
        const payload = body.payload.payment?.entity || body.payload.order?.entity;
        const qrId = payload?.qr_code_id || payload?.notes?.qr_id;
        const paymentId = payload?.id;
        console.log(`[Webhook] Identified QR ID ${qrId} for event ${event}`);

        if (!qrId) {
            console.warn("[Webhook] No QR ID found in payload");
            return { status: "ignored" };
        }

        const transaction = await Transaction.findOne({ qr_id: qrId, status: "pending" });
        if (!transaction) {
            console.warn(`[Webhook] No pending transaction found for QR: ${qrId}`);
            return { status: "not_found" };
        }
        console.log(`[Webhook] Found pending transaction ${transaction._id} for QR ${qrId}. Machine: ${transaction.machine_id}`);

        // 1. Deduct stock from machine
        const machine = await VendingMachine.findById(transaction.machine_id);
        if (machine) {
            let itemsUpdated = false;
            for (const purchased of transaction.items) {
                const itemIndex = machine.items.findIndex(i => i.row === purchased.row);
                if (itemIndex > -1) {
                    const currentQty = machine.items[itemIndex].quantity;
                    if (currentQty >= purchased.quantity) {
                        machine.items[itemIndex].quantity -= purchased.quantity;
                        itemsUpdated = true;
                        console.log(`[Webhook] Deducting stock for item ${purchased.name || 'Row ' + purchased.row}: ${currentQty} -> ${machine.items[itemIndex].quantity}`);
                    } else {
                        console.error(`[Webhook] INSIGNIFICANT STOCK for ${purchased.name || 'Row ' + purchased.row}! Requested: ${purchased.quantity}, Available: ${currentQty}`);
                    }
                } else {
                    console.warn(`[Webhook] ITEM NOT FOUND in machine for row ${purchased.row}`);
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
