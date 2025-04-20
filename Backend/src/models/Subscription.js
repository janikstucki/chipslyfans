import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./User.js";
import { Abonnement } from "./Abonnement.js";

export const Subscription = sequelize.define("Subscription", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    abonnementId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    consumerId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    subscribedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // wird true wenn bezahlt
    },
}, {
    tableName: "subscriptions",
    timestamps: true,
});

