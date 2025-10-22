import { Institute } from "../models/institution";
import { InstituteType } from "../types/vendingMachine";

export const getAllInstitutions = async () => {
  return await Institute.find();
};

export const getInstitutionById = async (id: string) => {
  return await Institute.findById(id);
};

export const createInstitution = async (data: InstituteType) => {
  const machine = new Institute(data);
  return await machine.save();
};

export const updateInstitution = async (id: string, data: any) => {
  return await Institute.findByIdAndUpdate(id, data, { new: true });
};

export const deleteInstitution = async (id: string) => {
  return await Institute.findByIdAndDelete(id);
};
