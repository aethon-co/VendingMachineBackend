import { Schema, model } from "mongoose";
import { FoodItemType, VendingMachineType } from "../types/vendingMachine";

const FoodItemSchema = new Schema<FoodItemType>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
});

export const VendingMachineSchema = new Schema<VendingMachineType>({
  name: { type: String, required: true },
  row1: { type: FoodItemSchema, default: null },
  row2: { type: FoodItemSchema, default: null },
  row3: { type: FoodItemSchema, default: null },
  row4: { type: FoodItemSchema, default: null },
});

export const VendingMachine = model<VendingMachineType>(
  "VendingMachine",
  VendingMachineSchema
);
