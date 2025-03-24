import { createRouter, createWebHistory } from 'vue-router';

const Home = () => import(/* webpackChunkName: "Home" */ '../views/HomeView.vue');


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});


export default router;