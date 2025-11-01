import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers:[ElementPlusResolver({importStyle: 'css'})],
    }),
    Components({
      resolvers:[ElementPlusResolver({importStyle: 'css'})],
    })
  ],

  // ... (plugins 部分保持不变) ...

  server:{
    open: true,
    proxy:{

      '^/api/.*': {
        target: 'https://localhost:44388', // 你的数据后端
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'https://localhost:44388', // 你的 WebApi 后端 (它有 wwwroot)
        changeOrigin: true,
        secure: false,
      }
    }
  }
})

