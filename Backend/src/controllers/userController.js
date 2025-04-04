import { User } from "../models/User.js";
import bcrypt from 'bcryptjs';

export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll()
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
}

export const createUser = async (req, res) => {
    try {
        const { username, email, password, firstname, lastname, birthdate } = req.body;
        
        // Passwort hashen
        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync(password, salt);

        const newUser = await User.create({ 
            username,
            email,
            passwordHash,  
            firstname,
            lastname,
            birthdate
        });

        res.status(201).json(newUser);
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Error creating user',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const id  = req.params.id;
        const deletedUser = await User.destroy({ where: { id } });
        if (deletedUser) {
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
}