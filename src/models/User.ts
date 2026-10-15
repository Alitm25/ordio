import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            // safety net: any email written to the DB is stored trimmed and lowercase
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema );

export default User;