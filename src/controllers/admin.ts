import { Admin } from "../models/admin";
import { Institute } from "../models/institution";
import { AdminLoginType, AdminRegisterType } from "../types/admin";

export const getAllInstitutions = async () => {
    return await Institute.find();
};

export const getInstitutionById = async (_id: string) => {
    return await Institute.findById(_id);
};

export const createAdmin = async (data: AdminRegisterType, jwt_admin: any) => {
    const existing = await Admin.findOne({ email: data.email });
    if (existing) {
        throw new Error("Admin already exists");
    }
    const hashedPassword = await Bun.password.hash(data.password);
    const admin = new Admin({ ...data, password: hashedPassword });
    await admin.save();
    const token = await jwt_admin.sign({
        id: admin._id,
        email: admin.email,
        role: admin.role
    });
    return {
        token,
        user: {
            id: admin._id,
            name: admin.name,
            email: admin.email
        }
    };
};

export const updateAdmin = async (_id: string, data: Partial<AdminRegisterType>) => {
    return await Admin.findByIdAndUpdate(_id, data, { new: true });
};

export const deleteAdmin = async (_id: string) => {
    return await Admin.findByIdAndDelete(_id);
};

export const authenticateAdmin = async (_id: string) => {
    const admin = await Admin.findById(_id);
    if (!admin) {
        throw new Error("User not found");
    }
    return admin;
};

export const loginAdmin = async (data: AdminLoginType, jwt_admin: any) => {
    const admin = await Admin.findOne({ email: data.email });
    if (!admin) {
        throw new Error("Invalid credentials");
    }
    const isMatch = await Bun.password.verify(data.password, admin.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    const token = await jwt_admin.sign({
        id: admin._id,
        email: admin.email,
        role: admin.role
    });

    return {
        token,
        user: {
            id: admin._id,
            name: admin.name,
            email: admin.email
        }
    };
};
