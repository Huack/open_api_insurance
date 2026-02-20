import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    server: {
        proxy: {
            '/api': {
                target: 'https://api-gateway.b7ad-use1.30e5c8e.hsp.philips.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '/v1/insurances/resources'),
                secure: true,
            },
        },
    },
})