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
    id: newInstitution._id,
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

export const updateInstitution = async (id: string, data: Partial<InstituteUpdateType>) => {
  const updated = await Institute.findByIdAndUpdate(id, data, { new: true });
  if (!updated) {
    throw new NotFoundError("Institution not found");
  }
  return updated;
};

export const deleteInstitution = async (id: string) => {
  const deleted = await Institute.findByIdAndDelete(id);
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
    id: institute._id,
    mail: institute.mail,
    role: institute.role
  });

  return {
    token,
    user: {
      id: institute._id,
      name: institute.name,
      mail: institute.mail
    }
  };
};

export const authenticateInstitution = async (_id: string) => {
  const institute = await Institute.findById(_id);
  if (!institute) {
    throw new NotFoundError("User not found");
  }
  return institute;
};

export const updateMachineStock = async (id: string, data: VendingMachineUpdateStockType) => {
  const machine = await VendingMachine.findByIdAndUpdate(id, data, { new: true });
  if (!machine) {
    throw new NotFoundError("Vending Machine not found");
  }
  return machine;
};