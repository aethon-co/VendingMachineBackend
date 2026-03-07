import { Types } from "mongoose";

export type CellItemType = {
    row: number;
    name: string;
    price: number;
    quantity: number;
    image: string;

}

export type VendingMachineSchemaType = {
    name: string;
    location: string;
    items: CellItemType[];
    institute_id: Types.ObjectId | null;
    secret_token: string;
    role: string;
    last_heartbeat: Date | null;
    is_online: boolean;
    upi_vpa: string;
}

export type VendingMachineUpdateDetailsType = {
    name: string;
    location: string;
    institute_id: Types.ObjectId;
    upi_vpa: string;
}

export type VendingMachineUpdateStockType = {
    items: CellItemType[];
}

export type VendingMachineCreationType = {
    name: string;
    location?: string;
}
