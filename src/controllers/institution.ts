import { Types } from "mongoose";
import { Institute } from "../models/institution.js";
import { InstituteLoginType, InstituteRegisterType, InstituteUpdateType } from "../types/institution.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors/handler.js";
import { VendingMachineUpdateStockType } from "../types/vendingMachine.js";
import { VendingMachine } from "../models/vendingMachine.js";

export const createInstitution = async (data: InstituteRegisterType, jwt_institution: any) => {
  // 1 & 4. Fix Mass Assignment and NoSQL Injection
  const mail = String(data.mail);
  const existing = await Institute.findOne({ mail });
  if (existing) {
    throw new BadRequestError("Institution already exists");
  }

  const hashedPassword = await Bun.password.hash(String(data.password));

  // Explicitly pick properties to avoid mass assignment
  const newInstitution = new Institute({
    name: data.name,
    mail: mail,
    password: hashedPassword,
    // Add any other specific required fields from register type, but do not spread `...data`
  });
  await newInstitution.save();

  const token = await jwt_institution.sign({
    id: newInstitution._id.toString(),
    mail: newInstitution.mail,
    role: newInstitution.role
  });

  return {
    token,
    user: {
      id: newInstitution._id,
      name: newInstitution.name,
      mail: newInstitution.mail
    }
  };
};

export const updateInstitution = async (_id: string, data: Partial<InstituteUpdateType>) => {
  // 1. Fix Mass Assignment - strictly pick fields
  const safeData: Partial<InstituteUpdateType> = {};
  if (data.name) safeData.name = data.name;
  if (data.mail) safeData.mail = String(data.mail);
  // (Password updates are intentionally ignored here per user request, will be handled separately)

  const updated = await Institute.findByIdAndUpdate(_id, { $set: safeData }, { new: true })
    .select("-password -refreshToken -__v");
  if (!updated) {
    throw new NotFoundError("Institution not found");
  }
  return updated;
};

export const deleteInstitution = async (_id: string) => {
  const deleted = await Institute.findByIdAndDelete(_id).select("-password -refreshToken -__v");
  if (!deleted) {
    throw new NotFoundError("Institution not found");
  }
  return deleted;
};

// 3. Dummy hash to prevent timing attacks
const DUMMY_HASH = await Bun.password.hash("dummy_password_to_prevent_timing_attacks");

export const loginInstitution = async (data: InstituteLoginType, jwt_institution: any) => {
  // 4. Fix NoSQL Injection
  const mail = String(data.mail);
  const institute = await Institute.findOne({ mail });

  // 3. Fix Timing Attack
  if (!institute) {
    // Run the hash verify anyway to take the same amount of time
    await Bun.password.verify(String(data.password), DUMMY_HASH);
    throw new UnauthorizedError("Invalid credentials");
  }

  const isMatch = await Bun.password.verify(String(data.password), institute.password);
  if (!isMatch) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const token = await jwt_institution.sign({
    id: institute._id.toString(),
    mail: institute.mail,
    role: institute.role
  });

  const machines = await VendingMachine.find({ institute_id: institute._id }).select("-secret_token -__v");

  return {
    token: token,
    institution: {
      id: institute._id,
      name: institute.name,
      mail: institute.mail
    },
    machines
  };
};

export const updateMachineStock = async (institutionId: string, machineId: string, data: Partial<VendingMachineUpdateStockType>) => {
  const updateQuery = data.items ? { $set: { items: data.items } } : {};

  const machine = await VendingMachine.findOneAndUpdate(
    { _id: machineId, institute_id: institutionId },
    updateQuery,
    { new: true }
  ).select("-secret_token -__v");

  if (!machine) {
    throw new NotFoundError("Vending Machine not found");
  }
  return machine;
};

export const getVendingMachines = async (institutionId: string) => {
  const machines = await VendingMachine.find({ institute_id: institutionId }).select("-secret_token -__v");
  return machines;
};

export const getVendingMachineById = async (institutionId: string, machineId: string) => {
  const machine = await VendingMachine.findOne({ _id: machineId, institute_id: institutionId }).select("-secret_token -__v");
  if (!machine) {
    throw new NotFoundError("Vending Machine not found");
  }
  return machine;
};



export const linkMachineToInstitution = async (institutionId: string, machineId: string) => {

  const machine = await VendingMachine.findOneAndUpdate(
    { _id: machineId, institute_id: null },
    { $set: { institute_id: new Types.ObjectId(institutionId) } },
    { new: true }
  ).select("-secret_token -__v");

  if (!machine) {
    const exists = await VendingMachine.findById(machineId);
    if (!exists) throw new NotFoundError("Vending Machine not found");
    throw new BadRequestError("Machine is already linked to an institution");
  }

  return machine;
};

export const deleteMachineForInstitution = async (institutionId: string, machineId: string) => {
  const machine = await VendingMachine.findOneAndDelete({ _id: machineId, institute_id: institutionId }).select("-secret_token -__v");
  if (!machine) {
    throw new NotFoundError("Vending Machine not found");
  }
  return { message: "Machine deleted successfully" };
};

export const authenticateInstitution = async (_id: string) => {
  const institution = await Institute.findById(_id).select("-password -refreshToken -__v");
  if (!institution) {
    throw new NotFoundError("Institute not found");
  }
  const machines = await getVendingMachines(_id);

  return {
    institution,
    machines
  };
};
