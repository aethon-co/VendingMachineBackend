import crypto from "crypto";
import { Admin } from "../models/admin.js";
import { Institute } from "../models/institution.js";
import { AdminLoginType, AdminRegisterType } from "../types/admin.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors/handler.js";
import { VendingMachine } from "../models/vendingMachine.js";
import { VendingMachineCreationType } from "../types/vendingMachine.js";

export const createVendingMachine = async (data: VendingMachineCreationType) => {
    if (!data.name) {
        throw new BadRequestError("Machine name is required");
    }
    const secretToken = crypto.randomUUID();
    const machine = new VendingMachine({
        name: data.name,
        location: data.location || "",
        secret_token: secretToken,
        items: [],
    });
    await machine.save();
    return {
        machine: {
            id: machine._id,
            name: machine.name,
            location: machine.location,
        },
        secret_token: secretToken,
    };
};

export const getAllInstitutions = async () => {
    const institutions = await Institute.find().select("-password -refreshToken -__v");
    if (!institutions) {
        throw new NotFoundError("No Institutions found");
    }
    return institutions;
};

export const getInstitutionById = async (_id: string) => {
    const institution = await Institute.findById(_id).select("-password -refreshToken -__v");
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
    const updated = await Admin.findByIdAndUpdate(_id, data, { new: true }).select("-password");
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
    const admin = await Admin.findById(_id).select("-password");
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
    const machines = await VendingMachine.find().select("-secret_token -__v");
    if (!machines) {
        throw new NotFoundError("No Vending Machines found");
    }
    return machines;
};

export const getMachineById = async (id: string) => {
    const machine = await VendingMachine.findById(id).select("-secret_token -__v");
    if (!machine) {
        throw new NotFoundError("Vending Machine not found");
    }
    return machine;
};

export const updateVendingMachine = async (id: string, data: Partial<{ name: string; location: string; upi_vpa: string }>) => {
    const machine = await VendingMachine.findByIdAndUpdate(id, data, { new: true }).select("-secret_token -__v");
    if (!machine) {
        throw new NotFoundError("Vending Machine not found");
    }
    return machine;
};
