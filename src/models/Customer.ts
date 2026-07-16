import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
    {
        name: {
          type: String,
          required: true,
        },

        phone: {
          type: String,
          required: true,
        },

        notes: {
            type: String,
            default: "",
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    },
    { timestamps: true }
)

const Customer = mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);