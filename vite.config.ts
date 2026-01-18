import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'

// ✅ 后端地址区分（开发 / 生产）
const backendUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://seigou-webapi.onrender.com'
    : 'https://localhost:44388'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver({ importStyle: 'css' })],
    }),
    Components({
      resolvers: [ElementPlusResolver({ importStyle: 'css' })],
    }),
  ],

  // ✅ 关键：Vite 路径别名（解决 @/layout/Header.vue 报错）
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  server: {
    open: true,
    proxy: {
      '^/api/.*': {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // ✅ 构建时注入常量（前端可直接使用）
  define: {
    __BACKEND_URL__: JSON.stringify(backendUrl),
  },
})


