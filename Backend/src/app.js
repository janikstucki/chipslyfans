import express from "express";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js"; 
import authRoutes from "./routes/authRoutes.js";
import { connectDB, sequelize } from "./config/db.js";
import cors from "cors";
import { Post } from "./models/Post.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(express.urlencoded({ extended: true }));
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
