import { Schema, model } from "mongoose";
import { CellItemType, VendingMachineSchemaType } from "../types/vendingMachine";

const CellItemSchema = new Schema<CellItemType>({
  row: { type: Number, required: true },
  col: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
  imageUrl: { type: String, default: "" },
});

export const VendingMachineSchema = new Schema<VendingMachineSchemaType>({
  name: { type: String, required: true },
  location: { type: String, default: "" },
  items: { type: [CellItemSchema], default: [] },
  institute_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  qrToken: { type: String, default: null },
  status: { type: String, enum: ["online", "offline", "maintenance"], default: "online" },
  imageUrl: { type: String, default: "" },
  role: { type: String, default: "vending_machine" },
  createdAt: { type: Date, default: Date.now },
});

export const VendingMachine = model<VendingMachineSchemaType>(
  "VendingMachine",
  VendingMachineSchema
);
