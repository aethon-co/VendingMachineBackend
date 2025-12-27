import { Types } from "mongoose";

export type FoodItemType = {
    rowNumber: number;
    name: string;
    price: number;
    quantity: number;
} | null

export type VendingMachineSchemaType = {
    name: string;
    row1: FoodItemType;
    row2: FoodItemType;
    row3: FoodItemType;
    row4: FoodItemType;
    institute_id: Types.ObjectId;
    role: string;
}

export type VendingMachineUpdateDetailsType = {
    name: string;
    institute_id: Types.ObjectId;
}

export type VendingMachineUpdateStockType = {
    row1: FoodItemType;
    row2: FoodItemType;
    row3: FoodItemType;
    row4: FoodItemType;
}

export type VendingMachineCreationType = {
    name: string;
    institute_id: Types.ObjectId;
}

