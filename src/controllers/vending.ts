import { VendingMachine } from "../models/vendingMachine";
import { VendingMachineCreationType, VendingMachineUpdateDetailsType, VendingMachineUpdateStockType } from "../types/vendingMachine";

export const getAllMachines = async () => {
  return await VendingMachine.find();
};

export const getMachineById = async (id: string) => {
  return await VendingMachine.findById(id);
};

export const createMachine = async (data: VendingMachineCreationType) => {
  const machine = new VendingMachine(data);
  return await machine.save();
};

export const updateMachine = async (id: string, data: VendingMachineUpdateDetailsType) => {
  return await VendingMachine.findByIdAndUpdate(id, data, { new: true });
};

export const updateMachineStock = async (id: string, data: VendingMachineUpdateStockType) => {
  return await VendingMachine.findByIdAndUpdate(id, data, { new: true });
};

export const deleteMachine = async (id: string) => {
  return await VendingMachine.findByIdAndDelete(id);
};
