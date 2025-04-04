import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Post = sequelize.define("Post", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "posts",
    timestamps: true,
});