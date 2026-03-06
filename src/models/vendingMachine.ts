import { Schema, model } from "mongoose";
import { CellItemType, VendingMachineSchemaType } from "../types/vendingMachine";

const CellItemSchema = new Schema<CellItemType>({
  row: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
  image: { type: String, default: "" },
});

export const VendingMachineSchema = new Schema<VendingMachineSchemaType>({
  name: { type: String, required: true },
  location: { type: String, default: "" },
  items: { type: [CellItemSchema], default: [] },
  institute_id: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  secret_token: {
    type: String,
    required: true,
    unique: true,
  },
  role: { type: String, default: "vending_machine" },
  last_heartbeat: { type: Date, default: null },
  is_online: { type: Boolean, default: false },
});

export const VendingMachine = model<VendingMachineSchemaType>(
  "VendingMachine",
  VendingMachineSchema
);
