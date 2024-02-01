import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert';

import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config({ path: '.env' });
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
