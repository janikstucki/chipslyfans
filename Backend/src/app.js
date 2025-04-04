import express from "express";
import postRoutes from "./routes/postRoutes.js";
import { connectDB, sequelize } from "./config/db.js";
import cors from "cors";
import { Post } from "./models/Post.js"; // Direkt importieren

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: "*", // Erlaubt alle Ursprünge
    redentials: true, 
};

app.use(express.json());
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }));
app.use("/posts", postRoutes);

async function startServer() {
    await connectDB();
    try {
        await sequelize.sync({ alter: true }); // Synchronisation nach Verbindungsaufbau
        console.log("✅ Datenbank synchronisiert!");
        app.listen(PORT, () => {
            console.log(`🚀 Server läuft auf Port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Fehler beim Starten des Servers:", error);
    }
}

startServer();
