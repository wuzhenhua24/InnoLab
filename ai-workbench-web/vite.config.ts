import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import monacoEditorPluginModule from 'vite-plugin-monaco-editor'

// 处理 CommonJS/ESM 兼容性
const monacoEditorPlugin = (monacoEditorPluginModule as any).default || monacoEditorPluginModule

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    monacoEditorPlugin({
      languageWorkers: ['editorWorkerService', 'typescript', 'json', 'html', 'css'],
      globalAPI: true, // 使 Monaco 全局可用，提高兼容性
    }),
  ],
  optimizeDeps: {
    include: ['monaco-editor'],
  },
  build: {
    commonjsOptions: {
      include: [/monaco-editor/, /node_modules/],
    },
  },
})
