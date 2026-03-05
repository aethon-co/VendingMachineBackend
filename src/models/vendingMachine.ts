import { Schema, model } from "mongoose";
import { CellItemType, VendingMachineSchemaType } from "../types/vendingMachine";

const CellItemSchema = new Schema<CellItemType>({
  row: { type: Number, required: true },
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
    default: null,
  },
  secret_token: {
    type: String,
    required: true,
    unique: true,
  },
  qrToken: { type: String, default: null },
  status: { type: String, enum: ["online", "offline", "maintenance"], default: "online" },
  imageUrl: { type: String, default: "" },
  role: { type: String, default: "vending_machine" },
<<<<<<< HEAD
  last_heartbeat: { type: Date, default: null },
  is_online: { type: Boolean, default: false },
=======
  createdAt: { type: Date, default: Date.now },
>>>>>>> a6ff7b6862c6c19005548952fcdcadf53de3a127
});

export const VendingMachine = model<VendingMachineSchemaType>(
  "VendingMachine",
  VendingMachineSchema
);
