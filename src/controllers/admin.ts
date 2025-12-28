import { Admin } from "../models/admin";
import { Institute } from "../models/institution";
import { AdminLoginType, AdminRegisterType } from "../types/admin";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors/handler";
import { VendingMachine } from "../models/vendingMachine";

export const getAllInstitutions = async () => {
    const institutions = await Institute.find();
    if (!institutions) {
        throw new NotFoundError("No Institutions found");
    }
    return institutions;
};

export const getInstitutionById = async (_id: string) => {
    const institution = await Institute.findById(_id);
    if (!institution) {
        throw new NotFoundError("Institution not found");
    }
    return institution;
};

export const createAdmin = async (data: AdminRegisterType, jwt_admin: any) => {
    const existing = await Admin.findOne({ mail: data.mail });
    if (existing) {
        throw new BadRequestError("Admin already exists");
    }
    const hashedPassword = await Bun.password.hash(data.password);
    const admin = new Admin({ ...data, password: hashedPassword });
    await admin.save();
    const token = await jwt_admin.sign({
        id: admin._id.toString(),
        mail: admin.mail,
        role: admin.role
    });
    return {
        token,
        user: {
            id: admin._id,
            name: admin.name,
            mail: admin.mail
        }
    };
};

export const updateAdmin = async (_id: string, data: Partial<AdminRegisterType>) => {
    const updated = await Admin.findByIdAndUpdate(_id, data, { new: true });
    if (!updated) {
        throw new NotFoundError("Admin not found");
    }
    return updated;
};

export const deleteAdmin = async (_id: string) => {
    const deleted = await Admin.findByIdAndDelete(_id);
    if (!deleted) {
        throw new NotFoundError("Admin not found");
    }
    return deleted;
};

export const authenticateAdmin = async (_id: string) => {
    const admin = await Admin.findById(_id);
    if (!admin) {
        throw new NotFoundError("User not found");
    }
    return admin;
};

export const loginAdmin = async (data: AdminLoginType, jwt_admin: any) => {
    const admin = await Admin.findOne({ mail: data.mail });
    if (!admin) {
        throw new UnauthorizedError("Invalid credentials");
    }
    const isMatch = await Bun.password.verify(data.password, admin.password);
    if (!isMatch) {
        throw new UnauthorizedError("Invalid credentials");
    }

    const token = await jwt_admin.sign({
        id: admin._id.toString(),
        mail: admin.mail,
        role: admin.role
    });

    return {
        token,
        user: {
            id: admin._id,
            name: admin.name,
            mail: admin.mail
        }
    };
};

export const getAllMachines = async () => {
    const machines = await VendingMachine.find();
    if (!machines) {
        throw new NotFoundError("No Vending Machines found");
    }
    return machines;
};

export const getMachineById = async (id: string) => {
    const machine = await VendingMachine.findById(id);
    if (!machine) {
        throw new NotFoundError("Vending Machine not found");
    }
    return machine;
};
