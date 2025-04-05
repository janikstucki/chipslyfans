import express from "express";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js"; 
import authRoutes from "./routes/authRoutes.js";
import { connectDB, sequelize } from "./config/db.js";
import cookieParser from 'cookie-parser';
import cors from "cors";
import { Post } from "./models/Post.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware-Initialisierung
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());  // Cookie-Parser vor den Routen einbinden

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routen einbinden
app.use("/posts", postRoutes);
app.use("/users", userRoutes); 
app.use("/auth", authRoutes);

async function startServer() {
    await connectDB();
    try {
        await sequelize.sync({ alter: true }); 
        console.log("✅ Datenbank synchronisiert!");
        app.listen(PORT, () => {
            console.log(`🚀 Server läuft auf Port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Fehler beim Starten des Servers:", error);
    }
}

startServer();
