import { model, Schema } from "mongoose";
import { VendingMachineSchema } from "./vendingMachine";
import { InstituteType } from "../types/vendingMachine";

const InstituteSchema = new Schema<InstituteType>({
    name:{
        type:String,
        required:true
    },
    mail:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required: true,
        minlength: 3
    },
    VendingMachines:{
        type: [VendingMachineSchema],
        default: []
    }
})

export const Institute = model<InstituteType>(
    "Institute",
    InstituteSchema
  );