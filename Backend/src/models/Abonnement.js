import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./User.js";

export const Abonnement = sequelize.define("Abonnement", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    creatorId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    futureCost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    
    
}, {
    tableName: "abonnements",
    timestamps: false
});

