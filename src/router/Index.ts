
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/authStore'

let list = [
    {
        name: "home",
        path: "/",
        component: () => import("../views/HomePage.vue")
    },

    {
        path: '/contact',
        name: 'Contact',
        component: () => import('../views/Contact.vue') // 确保路径正确
    },

    {
        name: "login",
        path: "/login",
        component: () => import("../views/LoginPage.vue")
    },

    {
        name: "crud", // 这是你的 AdminPage
        path: "/AdminPage",
        component: () => import("../views/AdminCRUDPage.vue"),
        meta: { requiresAuth: true } // 2. 添加路由保护
    },

    
    {
        name: "CreateBlog",
        path: "/AdminPage/create-blog", // 我把它设为 AdminPage 的子路径
        component: () => import("../views/CreateBlog.vue"),
        meta: { requiresAuth: true } // 4. 同样添加路由保护
    },

    {
        name: "ManageBlogs",
        path: "/AdminPage/manage", // (新路径)
        component: () => import("../views/ManageBlogs.vue"), // (新组件)
        meta: { requiresAuth: true }
    },

    {
        name: "EditBlog",
        path: "/AdminPage/edit/:id",
        component: () => import("../views/CreateBlog.vue"),
        meta: { requiresAuth: true }
    },

    {
        name: "ManageTypes",
        path: "/AdminPage/manage-types", // 新增类型管理路径
        component: () => import("../views/ManageTypes.vue"),
        meta: { requiresAuth: true }
    },

    {
        path: '/AdminPage/messages',
        name: 'MessageManage',
        component: () => import('../views/MessageManage.vue'),
        // 建议加上之前的路由守卫逻辑，确保只有管理员能进入
        meta: { requiresAuth: true }
    },

    {
        path: '/news-list',
        name: 'NewsList',
        component: () => import('../views/BlogList.vue')
    },

    {
        name: "BlogDetail",
        path: "/blog/:id",
        component: () => import("../views/BlogDetailPage.vue")
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: list ,
    scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // 如果是通过浏览器的“后退”按钮返回，则恢复之前的滚动位置
      return savedPosition;
    } else {
      // 否则，所有的跳转都滚动到页面顶部
      return { top: 0, behavior: 'smooth' }; // 'smooth' 是平滑滚动，如果你想要瞬间跳转可以改为 'auto'
    }
  }
})

router.beforeEach((to, _from, next) => {
    // 注意：在路由守卫中实例化 store
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        // 如果目标页面需要登录，而用户未认证
        next({ name: 'login' }); // 重定向到登录页
    } else {
        next(); // 正常放行
    }
});

export default router