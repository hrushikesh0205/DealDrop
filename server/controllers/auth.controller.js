import { User } from "../models/user.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function register(req, res) {

    try {

        const name = req.body.name?.trim();


        const email = req.body.email?.trim().toLowerCase();
        const phone = req.body.phone?.trim();
        const password = req.body.password?.trim();

        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const formattedName =
            name.charAt(0).toUpperCase() +
            name.slice(1);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            return res.status(400).json({
                message: "Phone number must be 10 digits"
            });
        }

        const existing_email = await User.findOne({ email });

        if (existing_email) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        const hashed_pass = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: formattedName,
            email,
            phone,
            password: hashed_pass
        });

        return res.status(201).json({
            message: "User registered successfully",
            userID: user._id,
            role: user.role
        });

    } catch (e) {

        console.error("Registration Failed:", e.message);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function login(req, res) {

    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();

    try {

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Email does not exist"
            });
        }

        if (user.isBlocked) {
            return res.status(403).json({
                message: "User is blocked by admin"
            });
        }

        const isSame = await bcrypt.compare(password, user.password);

        if (!isSame) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            message: "Login Successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (e) {

        console.error(e.message);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function upgradeToSeller(req, res) {
    try {
        const userId = req.user.userId;

        const user = await User.findByIdAndUpdate(
            userId,
            { role: "seller" },
            { new: true }
        );

        return res.status(200).json({
            message: "Upgrade to seller successfully",
            role: user.role
        });
    } catch (e) {
        console.error(e.message);
        res.status(500).json({ message: "Upgrade failed" });
    }
}


async function requestSeller(req, res) {

    try {

        const userId = req.user.userId;

        const {
            sellerType,
            sellingCategory,
            sellerReason
        } = req.body;

        const user = await User.findById(userId);

        if (user.role === "seller") {
            return res.status(400).json({
                message: "Already a Seller"
            });
        }

        if (user.sellerRequest === "PENDING") {
            return res.status(400).json({
                message: "Request already pending"
            });
        }

        console.log(req.body);

        // 🔥 Store request details
        user.sellerType = sellerType;
        user.sellingCategory = sellingCategory;
        user.sellerReason = sellerReason;

        user.sellerRequest = "PENDING";


        await user.save();
        console.log(user);

        return res.status(200).json({
            message: "Seller request submitted"
        });

    } catch (e) {

        console.error(e.message);

        return res.status(500).json({
            message: "Request Failed"
        });
    }
}
async function getSellerRequests(req, res) {
    try {
        const users = await User.find({
            sellerRequest: "PENDING"
        }).select(
            "name email role sellerType sellingCategory sellerReason sellerRequest"
        );
        console.log(users);
        res.status(200).json(users);
    } catch (e) {
        res.status(500).json({ message: "Error fetching requests" });
    }
}

async function approveSeller(req, res) {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndUpdate(userId,
            {
                role: "seller",
                sellerRequest: "APPROVED"
            },
            { new: true }
        );

        res.status(200).json({
            message: "User approved as seller"
        });

    } catch (e) {
        res.status(500).json({ message: "Approval failed" });
    }
}

async function getMe(req, res) {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        res.status(200).json(user);
    } catch (e) {
        res.status(500).json({ message: "Failed to fetch User" });
    }
}

async function rejectSeller(req, res) {
    try {
        const { userId } = req.params;

        const user = await User.findByIdAndUpdate(
            userId,
            {
                sellerRequest: "REJECTED"
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Seller request rejected"
        });

    } catch (e) {
        console.error(e.message);
        res.status(500).json({ message: "Rejection failed" });
    }
}
export { register, login, upgradeToSeller, getSellerRequests, approveSeller, requestSeller, getMe, rejectSeller };