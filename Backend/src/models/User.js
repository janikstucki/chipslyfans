import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false, 
        validate: {
            notEmpty: true
        }
    },
    firstname: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    lastname: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    birthdate: {
        type: DataTypes.DATEONLY, 
        allowNull: true,
    },
    interest: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    tableName: "users",
    timestamps: true, 
    createdAt: false, 
    updatedAt: false  
});