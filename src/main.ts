import { createApp } from 'vue'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router/Index'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // 引入 Pinia 持久化插件

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate) // 使用 Pinia 并启用持久化插件

const app = createApp(App)




app.use(pinia)
app.use(router)
app.mount('#app')


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
