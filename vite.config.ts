import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      formats: ["es"]
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "@radix-ui/react-scroll-area"]
    },
  },
  plugins: [
    react(),
    libInjectCss(),
    dts({ include: ['lib'] })
  ],
})
