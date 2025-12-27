import { Institute } from "../models/institution";
import { InstituteLoginType, InstituteRegisterType, InstituteUpdateType } from "../types/institution";

export const getAllInstitutions = async () => {
  return await Institute.find();
};

export const getInstitutionById = async (_id: string) => {
  return await Institute.findById(_id);
};

export const createInstitution = async (data: InstituteRegisterType, jwt: any) => {
  const existing = await Institute.findOne({ mail: data.mail });
  if (existing) {
    throw new Error("Institution already exists");
  }
  const hashedPassword = await Bun.password.hash(data.password);
  const newInstitution = new Institute({ ...data, password: hashedPassword });
  await newInstitution.save();

  const token = await jwt.sign({
    id: newInstitution._id,
    mail: newInstitution.mail
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
  return await Institute.findByIdAndUpdate(id, data, { new: true });
};

export const deleteInstitution = async (id: string) => {
  return await Institute.findByIdAndDelete(id);
};


export const loginInstitution = async (data: InstituteLoginType, jwt: any) => {
  const institute = await Institute.findOne({ mail: data.mail });
  if (!institute) {
    throw new Error("Invalid credentials");
  }
  const isMatch = await Bun.password.verify(data.password, institute.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = await jwt.sign({
    id: institute._id,
    mail: institute.mail
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
    throw new Error("User not found");
  }
  return institute;
};
