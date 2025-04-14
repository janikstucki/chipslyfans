import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth.js';
const Home = () => import(/* webpackChunkName: "Home" */ '../views/HomeView.vue');
const Postfach = () => import(/* webpackChunkName: "Postfach" */ '../views/NotificationsView.vue');
const Login = () => import(/* webpackChunkName: "Postfach" */ '../views/LoginView.vue');
const Subscriptions = () => import(/* webpackChunkName: "Subscriptions" */ '../views/SubscriptionsView.vue');

const PostDetail = () => import(/* webpackChunkName: "Postfach" */ '../views/PostView.vue');


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/postfach',
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