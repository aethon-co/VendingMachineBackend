import mongoose, { model, Schema } from "mongoose";
import { InstituteSchemaType } from "../types/institution";

const InstituteSchema = new Schema<InstituteSchemaType>({
    name: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 3
    },
    refreshToken: {
        type: String
    }
})

export const Institute = model<InstituteSchemaType>(
    "Institute",
    InstituteSchema
);
