import { model, Schema } from "mongoose";
import { InstituteSchemaType } from "../types/institution";

const InstituteSchema = new Schema<InstituteSchemaType>({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    mail: {
        type: String,
        required: true,
        minlength: 3,
        match: /^\S+@\S+\.\S+$/
    },
    password: {
        type: String,
        required: true,
        minlength: 3
    },

    // Might implement in the future
    refreshToken: {
        type: String,
        required: false
    },
    createdAt: {
        type: String,
        default: Date.now().toString()
    },
    role: {
        type: String,
        default: "institution"
    }
})

export const Institute = model<InstituteSchemaType>(
    "Institute",
    InstituteSchema
);
