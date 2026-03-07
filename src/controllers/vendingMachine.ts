import { VendingMachine } from "../models/vendingMachine";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors/handler";

const HEARTBEAT_TIMEOUT_MS = 35 * 60 * 1000; // 35 minutes — allows a 5 minute grace period for the 30-minute pings

export const initMachine = async (secretToken: string) => {
    const machine = await VendingMachine.findOne({ secret_token: secretToken });
    if (!machine) {
        throw new UnauthorizedError("Invalid secret token");
    }
    return {
        id: machine._id,
        name: machine.name,
        location: machine.location,
        institute_id: machine.institute_id,
        items: machine.items,
        is_online: machine.is_online,
        upi_vpa: machine.upi_vpa || "",
    };
};

export const heartbeat = async (machineId: string, secretToken: string) => {
    const machine = await VendingMachine.findOneAndUpdate(
        { _id: machineId, secret_token: secretToken },
        { last_heartbeat: new Date(), is_online: true },
        { new: true }
    );
    if (!machine) {
        throw new UnauthorizedError("Invalid machine ID or secret token");
    }
    return { status: "ok", last_heartbeat: machine.last_heartbeat };
};

export const getMachineStatus = async (machineId: string) => {
    const machine = await VendingMachine.findById(machineId);
    if (!machine) {
        throw new NotFoundError("Vending Machine not found");
    }

    const isOnline = machine.last_heartbeat
        ? (Date.now() - new Date(machine.last_heartbeat).getTime()) < HEARTBEAT_TIMEOUT_MS
        : false;

    // Update is_online if stale
    if (machine.is_online !== isOnline) {
        machine.is_online = isOnline;
        await machine.save();
    }

    return {
        id: machine._id,
        name: machine.name,
        is_online: isOnline,
        last_heartbeat: machine.last_heartbeat,
    };
};

export const purchase = async (machineId: string, secretToken: string, purchasedItems: { row: number, quantity: number }[]) => {
    // 1. Verify machine
    const machine = await VendingMachine.findOne({ _id: machineId, secret_token: secretToken });
    if (!machine) {
        throw new UnauthorizedError("Invalid machine ID or secret token");
    }

    // 2. Deduct quantities
    let itemsUpdated = false;
    for (const purchased of purchasedItems) {
        const itemIndex = machine.items.findIndex(i => i.row === purchased.row);
        if (itemIndex > -1 && machine.items[itemIndex].quantity >= purchased.quantity) {
            machine.items[itemIndex].quantity -= purchased.quantity;
            itemsUpdated = true;
        }
    }

    if (itemsUpdated) {
        machine.markModified('items');
        await machine.save();
    }

    return { status: "success", items: machine.items };
};

const verifyMachine = async (machineId: string, secretToken: string) => {
    const machine = await VendingMachine.findOne({ _id: machineId, secret_token: secretToken });
    if (!machine) {
        throw new UnauthorizedError("Invalid machine ID or secret token");
    }
    return machine;
};

const getRazorpayAuth = () => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
        throw new BadRequestError("RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set in backend environment");
    }
    return "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");
};

export const createPaymentQR = async (machineId: string, secretToken: string, amountInRupees: number) => {
    const machine = await verifyMachine(machineId, secretToken);

    if (!Number.isFinite(amountInRupees) || amountInRupees <= 0) {
        throw new BadRequestError("Amount must be greater than zero");
    }

    const amountInPaise = Math.round(amountInRupees * 100);
    const closeBy = Math.floor(Date.now() / 1000) + 20 * 60;
    const auth = getRazorpayAuth();

    const res = await fetch("https://api.razorpay.com/v1/payments/qr_codes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: auth,
        },
        body: JSON.stringify({
            type: "upi_qr",
            name: machine.name || "Vending Machine",
            usage: "single_use",
            fixed_amount: true,
            payment_amount: amountInPaise,
            description: "Vending Machine Order",
            close_by: closeBy,
        }),
    });

    const data: any = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new BadRequestError(data?.error?.description || "Failed to create Razorpay QR code");
    }

    const imageUrl = typeof data?.image_url === "string" ? data.image_url : "";
    const shortUrl = typeof data?.short_url === "string" ? data.short_url : "";
    if (!imageUrl && !shortUrl) {
        throw new BadRequestError("Razorpay QR response missing both image_url and short_url");
    }

    return { qrId: data.id, imageUrl, shortUrl, amount: amountInRupees };
};

export const checkQRPayment = async (machineId: string, secretToken: string, qrId: string) => {
    await verifyMachine(machineId, secretToken);
    const auth = getRazorpayAuth();

    const res = await fetch(`https://api.razorpay.com/v1/payments/qr_codes/${qrId}/payments`, {
        headers: { Authorization: auth },
    });
    if (!res.ok) return { paid: false };

    const data: any = await res.json();
    const captured = (data.items || []).find((p: any) => p.status === "captured");
    return { paid: !!captured, paymentId: captured?.id };
};

export const closePaymentQR = async (machineId: string, secretToken: string, qrId: string) => {
    await verifyMachine(machineId, secretToken);
    const auth = getRazorpayAuth();

    await fetch(`https://api.razorpay.com/v1/payments/qr_codes/${qrId}/close`, {
        method: "POST",
        headers: { Authorization: auth },
    }).catch(() => { });

    return true;
};
