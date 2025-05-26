import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { DataType } from "sequelize-typescript";
import { Abonnement } from "./Abonnement.js";
import { Post } from "./Post.js";

export const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: DataType.UUIDV4
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
        allowNull: true, 
        validate: {
            notEmpty: true
        }
    },
    profilepicture: {
        type: DataTypes.STRING(255),
        allowNull: true
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
    login_site:{
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "chipslyfans"
    },
    country:{
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    city_state:{
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    settings:{
        type: DataTypes.JSON,
        allowNull: true,
    }
}, {
    tableName: "users",
    timestamps: true, 
    createdAt: false, 
    updatedAt: false  
});
