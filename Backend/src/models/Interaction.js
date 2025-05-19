import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./User.js";
import { Post } from "./Post.js";

export const Interaction = sequelize.define("Interaction", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    postId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('visit','like', 'comment', 'share'),
        allowNull: false,
    },
}, {
    tableName: "interactions",
    timestamps: true
});