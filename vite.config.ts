import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // amazon-cognito-identity-js (via the `buffer` package) expects Node's `global` —
  // polyfill it to the browser's globalThis rather than pulling in a full node-polyfills plugin.
  define: {
    global: "globalThis",
  },
})
