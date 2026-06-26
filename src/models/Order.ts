import mongoose, { Schema, models, model } from "mongoose";

const OrderSchema = new Schema(
    {
        customerName: {
            type: String,
            required: true,
        },

        customerPhone: {
            type: String,
            required: true,
        },

        productName: {
            type: String,
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            default: 1,
        },

        price: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "processing", "completed"],
            default: "pending",
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["unpaid", "paid", "partial"],
            default: "unpaid",
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "card", "transfer"],
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Order =
    models.Order || model("Order", OrderSchema);

export default Order;