import { Sequelize } from "sequelize";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;

const createDatabaseIfNotExists = async () => {
    try {
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASS,
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        await connection.end();
    } catch (error) {
        console.error("❌ Fehler beim Erstellen der Datenbank:", error);
    }
};

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: "mariadb",
    logging: false,
});

export const connectDB = async () => {
    await createDatabaseIfNotExists();
    try {
        await sequelize.authenticate();
        console.log("✅ Verbindung zur Datenbank erfolgreich!");
    } catch (error) {
        console.error("❌ Verbindungsfehler:", error);
        process.exit(1); // Beende den Prozess bei Verbindungsfehler
    }
};
