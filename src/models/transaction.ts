import { Schema, model, Types } from "mongoose";

export interface TransactionType {
    qr_id: string;
    machine_id: Types.ObjectId;
    items: {
        row: number;
        quantity: number;
        name: string;
        price: number;
    }[];
    amount: number;
    status: "pending" | "paid" | "failed" | "expired";
    payment_id?: string;
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema = new Schema<TransactionType>(
    {
        qr_id: { type: String, required: true, unique: true },
        machine_id: { type: Schema.Types.ObjectId, ref: "VendingMachine", required: true },
        items: [
            {
                row: { type: Number, required: true },
                name: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true },
            },
        ],
        amount: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "paid", "failed", "expired"],
            default: "pending",
        },
        payment_id: { type: String, default: null },
    },
    { timestamps: true }
);

export const Transaction = model<TransactionType>("Transaction", TransactionSchema);
