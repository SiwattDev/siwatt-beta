import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv'
import path from 'path'
import { defineConfig } from 'vite'

const envFilePath = `.env${process.env.NODE_ENV === 'production' ? '.production' : ''}`
dotenv.config({ path: path.resolve(__dirname, envFilePath) })

export default defineConfig({
    plugins: [react()],
    define: {
        'process.env': process.env,
    },
})
