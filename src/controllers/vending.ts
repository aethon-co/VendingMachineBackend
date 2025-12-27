import { VendingMachine } from "../models/vendingMachine";
import { VendingMachineCreationType, VendingMachineUpdateDetailsType, VendingMachineUpdateStockType } from "../types/vendingMachine";
import { NotFoundError } from "../errors/handler";


export const createMachine = async (data: VendingMachineCreationType) => {
  const machine = new VendingMachine(data);
  return await machine.save();
};

export const authenticateMachine = async (id: string) => {
  const machine = await VendingMachine.findById(id);
  if (!machine) {
    throw new NotFoundError("Vending Machine not found");
  }
  return machine;
};

export const updateMachine = async (id: string, data: VendingMachineUpdateDetailsType) => {
  const machine = await VendingMachine.findByIdAndUpdate(id, data, { new: true });
  if (!machine) {
    throw new NotFoundError("Vending Machine not found");
  }
  return machine;
};

// Changes are to be made here after purchase
export const purchaseItem = async (id: string, data: VendingMachineUpdateStockType) => {
  const machine = await VendingMachine.findByIdAndUpdate(id, data, { new: true });
  if (!machine) {
    throw new NotFoundError("Vending Machine not found");
  }
  return machine;
};

export const deleteMachine = async (id: string) => {
  const machine = await VendingMachine.findByIdAndDelete(id);
  if (!machine) {
    throw new NotFoundError("Vending Machine not found");
  }
  return machine;
};
