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

export const cancelSubscription = async (req, res) => {
    const { subscriptionId } = req.params;
    const consumerId = req.user?.id;

    if (!consumerId) {
        return res.status(401).json({ message: "Nicht autorisiert" });
    }

    try {
        const subscription = await Subscription.findOne({
            where: {
                id: subscriptionId,
                consumerId,
                isActive: true,
            },
        });

        if (!subscription) {
            return res.status(404).json({ message: "Subscription nicht gefunden" });
        }

        subscription.isActive = false;
        await subscription.save();

        return res.json({ message: "Subscription erfolgreich gekündigt" });
    } catch (error) {
        console.error("Fehler bei cancelSubscription:", error);
        res.status(500).json({ message: "Serverfehler beim Kündigen der Subscription" });
    }
}