import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 相对资源路径：dist 可以放在域名根目录，也可以放在任意子目录。
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
  },
})
