import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Subscription } from "./Subscription.js";
import { User } from "./User.js";

export const Payment = sequelize.define("Payment", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    subscriptionId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    paymentMethod: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    paidAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: "payments",
    timestamps: true,
});

Payment.belongsTo(User, { foreignKey: "userId", as: "payer" });
Payment.belongsTo(Subscription, { foreignKey: "subscriptionId", as: "subscription" });
