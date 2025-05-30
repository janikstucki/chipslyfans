import { Abonnement } from '../models/index.js';

export const createAbonnement = async (req, res) => {
    const creatorId = req.user?.id;
    const { cost, description } = req.body;

    if (!creatorId) {
        return res.status(401).json({ message: "Nicht autorisiert" });
    }

    if (!cost) {
        return res.status(400).json({ message: "Preis ist erforderlich" });
    }

    try {
        // Prüfen, ob schon eins existiert
        const existing = await Abonnement.findOne({
            where: { creatorId },
        });

        if (existing) {
            return res.status(400).json({ message: "Du hast bereits ein Abonnement" });
        }

        const newAbonnement = await Abonnement.create({
            creatorId,
            cost,
            description,
            isActive: true,
        });

        res.status(201).json(newAbonnement);
    } catch (error) {
        console.error("Fehler beim Erstellen des Abonnements:", error);
        res.status(500).json({ message: "Serverfehler beim Erstellen des Abonnements" });
    }
};
