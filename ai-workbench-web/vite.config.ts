import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  // Monaco Editor 现在通过 CDN 加载，不需要特殊配置
  optimizeDeps: {
    exclude: ['monaco-editor'], // 排除 monaco-editor，使用 CDN
  },
})
