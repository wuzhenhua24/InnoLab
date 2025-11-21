import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import monacoEditorPluginModule from 'vite-plugin-monaco-editor'

// 处理 CommonJS/ESM 兼容性
const monacoEditorPlugin = (monacoEditorPluginModule as any).default || monacoEditorPluginModule

// https://vite.dev/config/
export default defineConfig({
  base: './', // 使用相对路径，确保在任何部署路径下都能正常工作
  plugins: [
    react(),
    monacoEditorPlugin({
      languageWorkers: ['editorWorkerService', 'typescript', 'json', 'html', 'css'],
      globalAPI: true, // 使 Monaco 全局可用，提高兼容性
      customWorkers: [
        {
          label: 'editorWorkerService',
          entry: 'monaco-editor/esm/vs/editor/editor.worker',
        },
        {
          label: 'typescript',
          entry: 'monaco-editor/esm/vs/language/typescript/ts.worker',
        },
        {
          label: 'json',
          entry: 'monaco-editor/esm/vs/language/json/json.worker',
        },
        {
          label: 'html',
          entry: 'monaco-editor/esm/vs/language/html/html.worker',
        },
        {
          label: 'css',
          entry: 'monaco-editor/esm/vs/language/css/css.worker',
        },
      ],
    }),
  ],
  optimizeDeps: {
    include: ['monaco-editor'],
  },
  build: {
    commonjsOptions: {
      include: [/monaco-editor/, /node_modules/],
    },
    rollupOptions: {
      output: {
        // 确保worker文件输出到正确的位置
        manualChunks: {
          'monaco-editor': ['monaco-editor'],
        },
      },
    },
  },
})
