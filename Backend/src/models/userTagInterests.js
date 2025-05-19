import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./User.js";

export const UserTagInterest = sequelize.define("UserTagInterest", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: false
  },
  weight: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  tableName: "userTagInterests",
  timestamps: true
});
