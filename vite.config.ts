import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// ✅ 读取环境变量（开发/生产不同）
const backendUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://seigou-webapi.onrender.com' // ✅ Render 生产后端地址
    : 'https://localhost:44388';           // ✅ 本地开发时用 https://localhost:44388

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

  // ✅ 构建时注入变量（Vercel 会自动读取）
  define: {
    __BACKEND_URL__: JSON.stringify(backendUrl),
  },
})


