import { Abonnement, Subscription } from '../models/index.js';
import { Op } from 'sequelize';

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

export const getAbonnementDashboard = async (req, res) => {
    const creatorId = req.params.creatorId;

    try {
        const abonnement = await Abonnement.findOne({
            where: { creatorId, isActive: true },
        });

        if (!abonnement) {
            return res.status(404).json({ message: "Abonnement nicht gefunden" });
        }

        // Anzahl aktiver Abonnenten
        const activeSubscribers = await Subscription.count({
            where: {
                abonnementId: abonnement.id,
                isActive: true,
            },
        });

        // Einnahmen berechnen
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        const [earningsToday, earningsMonth, earningsYear] = await Promise.all([
            Subscription.count({
                where: {
                    abonnementId: abonnement.id,
                    isActive: true,
                    subscribedAt: { [Op.gte]: startOfToday },
                },
            }),
            Subscription.count({
                where: {
                    abonnementId: abonnement.id,
                    isActive: true,
                    subscribedAt: { [Op.gte]: startOfMonth },
                },
            }),
            Subscription.count({
                where: {
                    abonnementId: abonnement.id,
                    isActive: true,
                    subscribedAt: { [Op.gte]: startOfYear },
                },
            }),
        ]);

        // Ergebnis berechnen (Anzahl × Preis)
        const cost = parseFloat(abonnement.cost);
        const totalToday = (earningsToday * cost).toFixed(2);
        const totalMonth = (earningsMonth * cost).toFixed(2);
        const totalYear = (earningsYear * cost).toFixed(2);

        res.json({
            abonnement,
            subscriberCount: activeSubscribers,
            earnings: {
                today: totalToday,
                month: totalMonth,
                year: totalYear,
            },
        });
    } catch (error) {
        console.error("Fehler beim Abrufen des Abonnement-Dashboards:", error);
        res.status(500).json({ message: "Serverfehler beim Abrufen des Abonnement-Dashboards" });
    }
};



export async function updateFutureCost(abonnementId, futureCost) {
    if (!futureCost || isNaN(futureCost)) {
        throw new Error('Ungültiger Preis');
    }

    const abonnement = await Abonnement.findByPk(abonnementId);
    if (!abonnement) {
        throw new Error('Abonnement nicht gefunden');
    }

    abonnement.futureCost = futureCost;
    await abonnement.save();

    return abonnement;
}

export async function handleUpdateFutureCost(req, res) {
    const { id } = req.params;
    const { futureCost } = req.body;

    try {
        const updatedAbonnement = await updateFutureCost(id, futureCost);
        res.json({
            message: 'Future-Cost erfolgreich aktualisiert',
            abonnement: updatedAbonnement,
        });
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Future-Cost:', error);
        if (error.message === 'Abonnement nicht gefunden') {
            res.status(404).json({ message: error.message });
        } else if (error.message === 'Ungültiger Preis') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Interner Serverfehler' });
        }
    }
}

