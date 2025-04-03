import { createRouter, createWebHistory } from 'vue-router';

const Home = () => import(/* webpackChunkName: "Home" */ '../views/HomeView.vue');
const Postfach = () => import(/* webpackChunkName: "Postfach" */ '../views/NotificationsView.vue');


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
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});


export default router;