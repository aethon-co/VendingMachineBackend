import { Types } from "mongoose";

export type CellItemType = {
    row: number;
    col: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

export type VendingMachineSchemaType = {
    name: string;
    location: string;
    items: CellItemType[];
    institute_id: Types.ObjectId;
    qrToken: string | null;
    status: "online" | "offline" | "maintenance";
    imageUrl: string;
    role: string;
    createdAt: Date;
}

export type VendingMachineUpdateDetailsType = {
    name: string;
    location: string;
    status?: "online" | "offline" | "maintenance";
    imageUrl?: string;
    institute_id: Types.ObjectId;
}

export type VendingMachineUpdateStockType = {
    items: CellItemType[];
}

export type VendingMachineCreationType = {
    name: string;
    location?: string;
    institute_id: Types.ObjectId;
}
