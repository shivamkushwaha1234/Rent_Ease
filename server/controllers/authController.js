import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
        });

        res.status(201).json({
            message: "Registration successful",
            user,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({
            token,
            user: userResponse,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get current authenticated profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update current authenticated profile
export const updateProfile = async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        const updates = { name, phone, address };

        if (req.body.password) {
            updates.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        ).select("-password");

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};