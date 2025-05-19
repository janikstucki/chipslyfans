import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Post = sequelize.define("Post", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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

        type: DataTypes.JSON,
        defaultValue: []
    },
    visibility: {
        type: DataTypes.ENUM('public', 'subscription'),
        allowNull: false,
        defaultValue: 'subscription'
    },
    tags: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    taggedUsers: {
        type: DataTypes.JSON,
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
