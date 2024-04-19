import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint'
import path from 'node:path'
const __dirname = import.meta.dirname

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 3000
    },
    plugins: [
        eslint({ exclude: ['**/node_modules/**', '**/dist/**', '**/*.min.*'] })
    ],
    build: {
        minify: false,
        emptyOutDir: true,
        outDir: 'dist',
        rollupOptions: {
            input: path.resolve(__dirname, 'src/server.js'),
            output: {
                entryFileNames: 'assets/[name].js',
                chunkFileNames: 'assets/[name].js',
                assetFileNames: 'assets/[name].[ext]'
            }
        }
    }
})
