import { User } from './User.js';
import { Abonnement } from './Abonnement.js';
import { Post } from './Post.js';
import { Subscription } from './Subscription.js';
import { Payment } from './Payment.js';
import { Comment } from './Comment.js'
import { Interaction } from './Interaction.js';
import { UserTagInterest } from './userTagInterests.js';

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

User.hasMany(Comment, { foreignKey: "authorId", as: "comments" });
Comment.belongsTo(User, { foreignKey: "authorId", as: "author" });

Post.hasMany(Comment, { foreignKey: "postId", as: "comments" });
Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });

User.hasMany(Interaction, { foreignKey: "userId", as: "interactions" });
Interaction.belongsTo(User, { foreignKey: "userId", as: "user" });

Interaction.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
Post.hasMany(Interaction, { foreignKey: 'postId', as: 'interactions' });

User.hasMany(UserTagInterest, { foreignKey: 'userId', as: 'tagInterests' });
UserTagInterest.belongsTo(User, { foreignKey: 'userId', as: 'user' });



export {
  User,
  Abonnement,
  Post,
  Subscription,
  Payment,
  Comment,
  Interaction,
  UserTagInterest,
};
