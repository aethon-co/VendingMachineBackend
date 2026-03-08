import { Schema, model, Types } from "mongoose";
import { MaintenanceLogSchemaType } from "../types/maintenanceLog.js";

const MaintenanceLogSchema = new Schema<MaintenanceLogSchemaType>({
  machine_id: { type: Schema.Types.ObjectId, required: true, ref: "VendingMachine" },
  institute_id: { type: Schema.Types.ObjectId, required: true },
  type: { type: String, enum: ["Scheduled", "Repair", "Emergency", "Inspection"], required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  technician: { type: String, default: "Unknown" },
  status: { type: String, enum: ["pending", "in_progress", "completed", "upcoming"], default: "pending" },
  scheduledAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

export const MaintenanceLog = model<MaintenanceLogSchemaType>(
  "MaintenanceLog",
  MaintenanceLogSchema
);
