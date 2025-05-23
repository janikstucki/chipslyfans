import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth.js';
const Home = () => import(/* webpackChunkName: "Home" */ '../views/HomeView.vue');
const Login = () => import(/* webpackChunkName: "LoginView" */ '../views/LoginView.vue');

const Subscriptions = () => import(/* webpackChunkName: "Subscriptions" */ '../views/SubscriptionsView.vue');
const Postfach = () => import(/* webpackChunkName: "Notifications" */ '../views/NotificationsView.vue');
const PostDetail = () => import(/* webpackChunkName: "PostView" */ '../views/PostView.vue');
const UserDetail = () => import(/* webpackChunkName: "UserView" */ '../views/UserView.vue');
const Settings = () => import(/* webpackChunkName: "Settings" */ '../views/SettingsView.vue');
const NewPost = () => import(/* webpackChunkName: "NewPostView" */ '../views/NewPostView.vue')
const PaymentSuccess = () => import(/* webpackChunkName: "PaymentSuccess" */ '../views/PaymentSuccess.vue')


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/inbox',
        name: 'Postfach',
        component: Postfach
    },
    { 
        path: '/post/:id', 
        name: 'PostDetail', 
        component: PostDetail, 
        props: true,
        meta: { requiresAuth: true}

    },
    { 
        path: '/user/:id', 
        name: 'UserDetail', 
        component: UserDetail, 
        props: true,
        meta: { requiresAuth: true}

    },
    {
        path: '/user/:id/settings',
        name: 'Settings',
        component: Settings,
        props: true,
        meta: { requiresAuth: true}
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { fullScreen: true },
    },
    {
        path: '/subscriptions',
        name: 'Subscriptions',
        component: Subscriptions
    },
    {
        path: '/new-post',
        name: 'New-Post',
        component: NewPost,
        meta: { requiresAuth: true}
    },
    {
        path: '/payment-success',
        name: 'PaymentSuccess',
        component: PaymentSuccess
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    if (authStore.loading) {
        await authStore.checkAuth();
    }
    if (to.meta.requiresAuth && !authStore.authenticated) {
        next({ path: '/login' });
    } else {
        next();
    }
});

export default router;