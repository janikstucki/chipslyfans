import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { User } from "../models/index.js";
import bcrypt from 'bcryptjs';
import { generateToken, verifyToken } from '../utils/jwt.js';


config();

export const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        console.log("Login attempt for:", identifier); // Log who's trying to login
    
        const user = await User.findOne({ where: { email: identifier } });
        if (!user) {
            console.log("User not found:", identifier);
            return res.status(404).json({ message: 'User not found' });
        }
    
        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            console.log("Invalid password for user:", user.email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    
        const token = generateToken(user);
        console.log("Generated JWT for user:", user.id); // Verify token generation

        res.cookie('jwt', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // in dev: false
            sameSite: 'strict',
            maxAge: 86400000
        });
    
        res.json({ 
            id: user.id,
            username: user.username,
            email: user.email
        });
    
        } catch (error) {
        console.error("Login error:", error); // <-- THIS WILL SHOW THE ROOT CAUSE
        res.status(500).json({ message: 'Login failed', error: error.message });
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


export const protectedRoute = async (req, res) => {
    try {
        console.log("[DEBUG] Empfangene Cookies:", req.cookies);
        const token = req.cookies.jwt;
        if (!token) {
            console.log("❌ Kein Token gefunden");
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const decoded = verifyToken(token);
        const user = await User.findByPk(decoded.id);
        if (!user) {
            console.log("❌ Benutzer nicht gefunden");
            return res.status(401).json({ message: 'Not authenticated' });
        }
        console.log("✅ Authentifizierter Benutzer:", user.email);
        res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.log("🚨 Fehler bei der Tokenvalidierung:", error.message);
        res.status(401).json({ message: 'Invalid token' });
    }
};


export const oauthcallback = async (req, res) => {
    const code = req.query.code;
    const user = jwt.decode(code);

    const userExists = await User.findOne({
        where: {id: user.id},
    });
    if(!userExists){
        const newUser = await User.create({ 
            id: user.id,
            username: user.username,
            email: user.email,
            firsrname: user.firstname,
            lastname: user.lastname,
            profilepicture: user.profilepicture,
            login_site: "chipstok"
        });
        const token = generateToken(newUser);
        console.log("Generated JWT for user:", user.id); // Verify token generation


        res.cookie('jwt', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // in dev: false
            sameSite: 'strict',
            maxAge: 86400000 // Oneday
        });
    }
    else {
        const token = generateToken(userExists);
        console.log("Generated JWT for user:", user.id); // Verify token generation


        res.cookie('jwt', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // in dev: false
            sameSite: 'strict',
            maxAge: 86400000 // Oneday
        });
    }


    res.redirect(`${process.env.FRONTEND_URL}`)

}


export const logout = (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/', // wichtig, sonst wird nicht korrekt gelöscht
    });

    res.status(200).json({ message: 'Erfolgreich ausgeloggt' });
};