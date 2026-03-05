import { Types } from "mongoose";

export type MaintenanceLogSchemaType = {
  machine_id: Types.ObjectId;
  institute_id: Types.ObjectId;
  type: "Scheduled" | "Repair" | "Emergency" | "Inspection";
  title: string;
  description: string;
  technician: string;
  status: "pending" | "in_progress" | "completed" | "upcoming";
  scheduledAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
};

export type CreateMaintenanceLogType = {
  machine_id: string;
  type: "Scheduled" | "Repair" | "Emergency" | "Inspection";
  title: string;
  description?: string;
  technician?: string;
  status?: "pending" | "in_progress" | "completed" | "upcoming";
  scheduledAt?: string;
};

export type UpdateMaintenanceLogType = {
  type?: "Scheduled" | "Repair" | "Emergency" | "Inspection";
  title?: string;
  description?: string;
  technician?: string;
  status?: "pending" | "in_progress" | "completed" | "upcoming";
  scheduledAt?: string;
  completedAt?: string;
};
