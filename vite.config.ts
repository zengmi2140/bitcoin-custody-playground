import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { createRequire } from 'module'

// 条件导入 lovable-tagger，如果包不存在则跳过
let componentTagger: (() => any) | null = null;
try {
  const require = createRequire(import.meta.url);
  const tagger = require("lovable-tagger");
  componentTagger = tagger.componentTagger;
} catch (e) {
  // 包不存在时忽略错误
  console.warn('lovable-tagger not found, skipping component tagger plugin');
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "localhost",
    port: 5173,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  },
  define: {
    global: 'globalThis',
  },
}))