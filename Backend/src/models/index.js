import { User } from './User.js';
import { Abonnement } from './Abonnement.js';
import { Post } from './Post.js';
import { Subscription } from './Subscription.js';
import { Payment } from './Payment.js';

// Associations
User.hasOne(Abonnement, { foreignKey: "creatorId", as: "abonnement" });
Abonnement.belongsTo(User, { foreignKey: "creatorId", as: "creator" });

User.hasMany(Post, { foreignKey: "authorId", as: "posts" });
Post.belongsTo(User, { foreignKey: "authorId", as: "author" });

User.hasMany(Subscription, { foreignKey: "consumerId", as: "subscriptions" });
Subscription.belongsTo(User, { foreignKey: "consumerId", as: "consumer" });

Subscription.belongsTo(Abonnement, { foreignKey: "abonnementId", as: "abonnement" });
Abonnement.hasMany(Subscription, { foreignKey: "abonnementId", as: "subscriptions" });

Payment.belongsTo(User, { foreignKey: "userId", as: "payer" });
Payment.belongsTo(Subscription, { foreignKey: "subscriptionId", as: "subscription" });

export {
  User,
  Abonnement,
  Post,
  Subscription,
  Payment,
};
