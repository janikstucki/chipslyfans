import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { verifyToken } from '../utils/jwt.js'

dotenv.config(); 


export const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        
        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' })
        }
    
        const decoded = verifyToken(token) // Deine Token-Verifizierungsfunktion
        const user = await User.findByPk(decoded.id)
        
        if (!user) {
            return res.status(401).json({ message: 'User not found' })
        }
    
        req.user = user // User-Objekt an Request anhängen
        next()
    } catch (error) {
        console.error('Authentication error:', error)
        res.status(401).json({ message: 'Invalid token' })
    }
}

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


export const optionalAuthMiddleware = async (req, res, next) => {
    try {
        // Prüfe Cookie
        const token = req.cookies.jwt;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded.id);
            if (user) {
                req.user = user;
                return next();
            }
        }

        // Prüfe Authorization-Header
        if (req.headers.authorization) {
            const headerToken = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(headerToken, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded.id);
            if (user) {
                req.user = user;
                return next();
            }
        }

        // Prüfe Session (falls genutzt)
        if (req.session && req.session.user) {
            req.user = req.session.user;
            return next();
        }

        // Wenn nichts gefunden → anonym
        req.user = null;
        next();

    } catch (err) {
        console.error('OptionalAuth error:', err);
        req.user = null;
        next();
    }
};

