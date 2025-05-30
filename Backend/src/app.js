import express from "express";
import path from "path";
import fs from 'fs';
import chokidar from 'chokidar';
import { fileURLToPath } from "url";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js"; 
import authRoutes from "./routes/authRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import interactionRoutes from "./routes/interactionRoutes.js";
import abonnementRoutes from "./routes/abonnementRoutes.js";

import webhookRoutes from "./middlewares/webhookRoutes.js";
import { connectDB, sequelize } from "./config/db.js";
import cookieParser from 'cookie-parser';
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const watcher = chokidar.watch('uploads', {
    persistent: true,
    ignoreInitial: true
});
app.use("/webhook", webhookRoutes);
// Middleware-Initialisierung
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());  // Cookie-Parser vor den Routen einbinden
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


watcher
    .on('add', path => console.log(`Datei hinzugefügt: ${path}`))
    .on('error', error => console.log(`Watcher Fehler: ${error}`));


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routen einbinden
app.use("/posts", postRoutes);
app.use("/users", userRoutes); 
app.use("/auth", authRoutes);
app.use("/subscription", subscriptionRoutes);
app.use("/api/comments", commentRoutes);
app.use("/interactions", interactionRoutes)
app.use("/abonnements", abonnementRoutes)

async function startServer() {
    await connectDB();
    try {
        await sequelize.sync();
        console.log("✅ Datenbank synchronisiert!");
        app.listen(PORT, () => {
            console.log(`🚀 Server läuft auf Port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Fehler beim Starten des Servers:", error);
    }
}

startServer();


