import { Abonnement, Subscription } from '../models/index.js';

export const checkSubscriptionStatus = async (req, res) => {
    const { creatorId } = req.params; // ID des Profilbesitzers
    const consumerId = req.user?.id;  // aktuell eingeloggter Nutzer

    if (!consumerId || consumerId === creatorId) {
        return res.json({ hasActiveSubscription: false });
    }

    try {
        const abonnement = await Abonnement.findOne({
            where: { creatorId, isActive: true },
        });

        if (!abonnement) {
            return res.json({ hasActiveSubscription: false });
        }

        const subscription = await Subscription.findOne({
            where: {
                abonnementId: abonnement.id,
                consumerId,
                isActive: true,
            },
        });

        return res.json({ hasActiveSubscription: !!subscription });
    } catch (error) {
        console.error("Fehler bei checkSubscriptionStatus:", error);
        res.status(500).json({ message: "Serverfehler beim Prüfen der Subscription" });
    }
};
