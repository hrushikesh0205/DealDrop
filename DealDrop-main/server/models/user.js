import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is Required"]
        },
        email: {
            type: String,
            required: [true, "Email is Required"],
            unique: [true, "Email already Exists"]
        },
        phone: Number,
        password: {
            type: String,
            required: [true, "Password is Required"]
        },
        role: {
            type: String,
            enum: ["admin", "seller", "bidder"],
            default: "bidder"
        },
        sellerRequest: {
            type: String,
            enum: ["NONE", "PENDING", "APPROVED", "REJECTED"],
            default: "NONE"
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        isBlocked: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export { User };
