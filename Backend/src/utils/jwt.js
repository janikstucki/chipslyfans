// utils/jwt.js
import { config } from 'dotenv';

import jwt from 'jsonwebtoken';
config(); 

export const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        username: user.username
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    return jwt.sign(payload, secret, { expiresIn: '1d' });
};

export const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    try {
        return jwt.verify(token, secret);
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
};
