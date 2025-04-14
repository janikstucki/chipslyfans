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
    likes: {
        type: DataTypes.JSON,
        defaultValue: {
            likeCount: 0,
            likedBy: [],
        },
    },
    authorId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    images: {
        type: DataTypes.JSON, // Geändert von ARRAY zu JSON
        defaultValue: []
    },
    visibility: {
        type: DataTypes.ENUM('public', 'subscription'),
        allowNull: false,
        defaultValue: 'subscription'
    },
    tags: {
        type: DataTypes.JSON, // Geändert von ARRAY zu JSON
        defaultValue: []
    },
    taggedUsers: {
        type: DataTypes.JSON, // Geändert von ARRAY zu JSON
        defaultValue: []
    },
    scheduleDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    sendNotification: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: "posts",
    timestamps: true,
});