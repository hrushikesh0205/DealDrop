import mongoose from "mongoose";
import env from "dotenv";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";

env.config();

async function createAdmin() {
    try {
        await mongoose.connect("mongodb+srv://Prajwal23K:Prajwal23@prajwalworkspace.xv6fbxz.mongodb.net/DealDrop?appName=PrajwalWorkspace");

        const hashed = await bcrypt.hash("admin123", 10);

        await User.create({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashed,
            role: "admin"
        });

        console.log("Admin created successfully ✅");
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

createAdmin();