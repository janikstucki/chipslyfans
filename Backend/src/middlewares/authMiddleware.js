import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

dotenv.config(); 


export const authMiddleware = async (req, res, next) => {
    const accessToken = req.cookies['auth_token'];
    const refreshToken = req.cookies['refresh_token'];

    try {
        if (!accessToken && !refreshToken) {
            return res.status(401).json({ message: 'No tokens provided' });
        }

        if (accessToken) {
            const decodedAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET);
            const user = await User.findByPk(decodedAccessToken.userId);

            if (!user) {
                return res.status(401).json({ message: 'User does not exist' });
            }

            req.user = user;
            return next();
        }

        if (refreshToken) {
            const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_REFRESH);
            const user = await User.findByPk(decodedRefreshToken.userId);

            if (!user) {
                return res.status(401).json({ message: 'User from refresh token does not exist' });
            }

            const token = jwt.sign(
                { userId: user._id, username: user.username, email: user.email },
                process.env.JWT_SECRET || 'your_jwt_secret',
                { expiresIn: '15m' }
            );

            res.cookie('auth_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000,
            });

            req.user = user;
            return next();
        }

        return res.status(401).json({ message: 'Unauthorized' });

    } catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({ message: 'Invalid or expired tokens' });
    }
};
