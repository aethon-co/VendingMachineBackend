import { Schema, model } from "mongoose";
import { FoodItemType, VendingMachineSchemaType } from "../types/vendingMachine";

const FoodItemSchema = new Schema<FoodItemType>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
});

export const VendingMachineSchema = new Schema<VendingMachineSchemaType>({
  name: { type: String, required: true },
  row1: { type: FoodItemSchema, default: null },
  row2: { type: FoodItemSchema, default: null },
  row3: { type: FoodItemSchema, default: null },
  row4: { type: FoodItemSchema, default: null },
  institute_id: {
    type: Schema.Types.ObjectId,
    required: true
  },

});

export const VendingMachine = model<VendingMachineSchemaType>(
  "VendingMachine",
  VendingMachineSchema
);

