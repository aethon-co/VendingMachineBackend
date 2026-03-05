import { Institute } from "../models/institution";
import { InstituteLoginType, InstituteRegisterType, InstituteUpdateType } from "../types/institution";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors/handler";
import { VendingMachineUpdateStockType } from "../types/vendingMachine";
import { VendingMachine } from "../models/vendingMachine";

export const createInstitution = async (data: InstituteRegisterType, jwt_institution: any) => {
  const existing = await Institute.findOne({ mail: data.mail });
  if (existing) {
    throw new BadRequestError("Institution already exists");
  }
  const hashedPassword = await Bun.password.hash(data.password);
  const newInstitution = new Institute({ ...data, password: hashedPassword });
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
  const updated = await Institute.findByIdAndUpdate(_id, data, { new: true });
  if (!updated) {
    throw new NotFoundError("Institution not found");
  }
  return updated;
};

export const deleteInstitution = async (_id: string) => {
  const deleted = await Institute.findByIdAndDelete(_id);
  if (!deleted) {
    throw new NotFoundError("Institution not found");
  }
  return deleted;
};

export const loginInstitution = async (data: InstituteLoginType, jwt_institution: any) => {
  const institute = await Institute.findOne({ mail: data.mail });
  if (!institute) {
    throw new UnauthorizedError("Invalid credentials");
  }
  const isMatch = await Bun.password.verify(data.password, institute.password);
  if (!isMatch) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const token = await jwt_institution.sign({
    id: institute._id.toString(),
    mail: institute.mail,
    role: institute.role
  });

  const machines = await VendingMachine.find({ institute_id: institute._id });

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
  const machine = await VendingMachine.findOne({ _id: machineId, institute_id: institutionId });
  if (!machine) {
    throw new NotFoundError("Vending Machine not found");
  }
  if (data.items) {
    machine.items = data.items;
  }
  await machine.save();
  return machine;
};

export const getVendingMachines = async (_id: string) => {
  const machines = await VendingMachine.find({ institute_id: _id });
  return machines;
};

export const getVendingMachineById = async (institutionId: string, machineId: string) => {
  const machine = await VendingMachine.findOne({ _id: machineId, institute_id: institutionId });
  if (!machine) {
    throw new NotFoundError("Vending Machine not found");
  }
  return machine;
};

export const linkMachineToInstitution = async (institutionId: string, machineId: string) => {
  const machine = await VendingMachine.findById(machineId);
  if (!machine) {
    throw new NotFoundError("Vending Machine not found");
  }
  if (machine.institute_id) {
    throw new BadRequestError("Machine is already linked to an institution");
  }
  machine.institute_id = institutionId as any;
  await machine.save();
  return machine;
};

export const deleteMachineForInstitution = async (institutionId: string, machineId: string) => {
  const machine = await VendingMachine.findOneAndDelete({ _id: machineId, institute_id: institutionId });
  if (!machine) {
    throw new NotFoundError("Vending Machine not found");
  }
  return { message: "Machine deleted successfully" };
};

export const authenticateInstitution = async (_id: string) => {
  const institution = await Institute.findById(_id).select("-password -__v -createdAt -role");
  if (!institution) {
    throw new NotFoundError("Institute not found");
  }
  const machines = await getVendingMachines(_id);

  return {
    institution,
    machines
  };
};
