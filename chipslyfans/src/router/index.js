import { createRouter, createWebHistory } from 'vue-router';

const Home = () => import(/* webpackChunkName: "Home" */ '../views/HomeView.vue');
const Postfach = () => import(/* webpackChunkName: "Postfach" */ '../views/NotificationsView.vue');
const Login = () => import(/* webpackChunkName: "Postfach" */ '../views/LoginView.vue');

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
        props: true 
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { fullScreen: true },

    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});


export default router;