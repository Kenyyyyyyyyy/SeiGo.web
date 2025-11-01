import { createApp } from 'vue'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router/Index'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // 引入 Pinia 持久化插件
import { useAuthStore } from './store/authStore'




const pinia = createPinia()
pinia.use(piniaPluginPersistedstate) // 使用 Pinia 并启用持久化插件

const app = createApp(App)




app.use(pinia)
app.use(router)

try {
  const authStore = useAuthStore();
  // 检查 state 中是否有 token (从 localStorage 恢复的)
  if (authStore.token) {
    authStore.setAuthHeader(authStore.token);
    // (可选) 你也可以在这里重新解码并加载用户信息
    // authStore.user = jwtDecode(authStore.token);
  }
} catch (error) {
  console.error("无法初始化 Auth Store:", error);
  // 可能是 store 定义错误，或 localStorage 数据损坏
}

app.mount('#app')


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
