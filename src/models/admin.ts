import { Schema, model } from "mongoose";
import { AdminSchemaType } from "../types/admin";

const AdminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "admin"
    },
    createdAt: {
        type: String,
        default: Date.now().toString()
    },

});

export const Admin = model<AdminSchemaType>(
    "Admin",
    AdminSchema
);