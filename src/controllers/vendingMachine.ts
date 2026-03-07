import { VendingMachine } from "../models/vendingMachine";
import { NotFoundError, UnauthorizedError } from "../errors/handler";

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

    // 3. Save
    if (itemsUpdated) {
        machine.markModified('items');
        await machine.save();
    }

    return { status: "success", items: machine.items };
};
