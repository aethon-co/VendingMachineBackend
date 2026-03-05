import { MaintenanceLog } from "../models/maintenanceLog";
import { VendingMachine } from "../models/vendingMachine";
import { BadRequestError, NotFoundError } from "../errors/handler";
import { CreateMaintenanceLogType, UpdateMaintenanceLogType } from "../types/maintenanceLog";

export const getMaintenanceLogs = async (institutionId: string, machineId: string) => {
  const machine = await VendingMachine.findOne({ _id: machineId, institute_id: institutionId });
  if (!machine) throw new NotFoundError("Vending machine not found");
  const logs = await MaintenanceLog.find({ machine_id: machineId, institute_id: institutionId }).sort({ createdAt: -1 });
  return logs;
};

export const createMaintenanceLog = async (institutionId: string, data: CreateMaintenanceLogType) => {
  if (!data.machine_id) throw new BadRequestError("machine_id is required");
  if (!data.title) throw new BadRequestError("title is required");
  if (!data.type) throw new BadRequestError("type is required");

  const machine = await VendingMachine.findOne({ _id: data.machine_id, institute_id: institutionId });
  if (!machine) throw new NotFoundError("Vending machine not found");

  const log = new MaintenanceLog({
    machine_id: data.machine_id,
    institute_id: institutionId,
    type: data.type,
    title: data.title,
    description: data.description || "",
    technician: data.technician || "Unknown",
    status: data.status || "pending",
    scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
  });
  await log.save();
  return log;
};

export const updateMaintenanceLog = async (institutionId: string, logId: string, data: UpdateMaintenanceLogType) => {
  const log = await MaintenanceLog.findOne({ _id: logId, institute_id: institutionId });
  if (!log) throw new NotFoundError("Maintenance log not found");

  if (data.type) log.type = data.type;
  if (data.title) log.title = data.title;
  if (data.description !== undefined) log.description = data.description;
  if (data.technician) log.technician = data.technician;
  if (data.status) {
    log.status = data.status;
    if (data.status === "completed" && !log.completedAt) {
      log.completedAt = new Date();
    }
  }
  if (data.scheduledAt) log.scheduledAt = new Date(data.scheduledAt);
  if (data.completedAt) log.completedAt = new Date(data.completedAt);

  await log.save();
  return log;
};

export const deleteMaintenanceLog = async (institutionId: string, logId: string) => {
  const log = await MaintenanceLog.findOneAndDelete({ _id: logId, institute_id: institutionId });
  if (!log) throw new NotFoundError("Maintenance log not found");
  return { message: "Log deleted successfully" };
};
