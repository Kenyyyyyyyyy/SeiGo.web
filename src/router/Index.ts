import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'
import { createRouter, createWebHistory } from 'vue-router'

let list=
[
    {
        name:"home",
        path:"/",
        component: () => import("../views/HomePage.vue")
    },
    {
        name:"login",
        path:"/login",
        component: () => import("../views/LoginPage.vue")
    },
    {
        name:"crud",
        path:"/AdminPage",
        component: () => import("../views/AdminCRUDPage.vue")
    }
]

const router = createRouter({
    history:createWebHistory(),
    routes: list
})

export default router