import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { User } from '../models/User.js';
import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';

config();

export const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        console.log("Input Password:", password);

        if (!identifier || !password) {
            res.status(400).json({ message: "Missing credentials" });
            return;
        }

        const user = await User.findOne({
            where: {
                [Op.or]: [{ email: identifier }, { username: identifier }]
            }
        });
        console.log("User PasswordHash:", user?.passwordHash);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username, email: user.email },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '15m' }
        );

        // Refresh-Token
        const refresh_token = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH || 'your_jwt_secret',
            { expiresIn: '1y' }
        );

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 365 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error("Login error details:", {
            error: error.message,
            stack: error.stack,
            body: req.body
            });
        res.status(500).json({ 
            message: "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};

export const register = async (req, res) => {
    try {
        const { password } = req.body;
        
        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }

        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync(password, salt);

        await User.create({
            ...req.body,
            passwordHash 
        });

        res.status(201).json({ message: "User created" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ 
            error: process.env.NODE_ENV === 'development' 
            ? error.message 
            : "Registration failed"
        });
    }
};

export const success = async (req, res) => {
    const user = req.user;
    const { passwordHash, _id, ...userWithoutPassword } = user.toJSON();
    const token = jwt.sign(
        { ...userWithoutPassword },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '15m' }
    );
    res.json({ message: "success", username: user.username, user: user, token: token });
};