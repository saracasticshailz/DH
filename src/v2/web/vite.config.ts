import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';  // Import the path module

// Resolve the path to the .env.dev file
console.log("ENV :" +process.env.ENV);
const env = process.env.ENV || 'dev';  // Default to 'dev' if APP_ENV is not set
const envPath = path.resolve(process.cwd(), `../common-env/.env.${env}`);

// Log the resolved path to verify it's correct
console.log('Loading env from path:', envPath);

// Load the environment variables from the resolved path
dotenv.config({ path: envPath });

// Log the environment variables to check if they are loaded
console.log('Loaded process.env:', process.env);

export default defineConfig({
  plugins: [react()],
  root: process.cwd(),
  publicDir: 'public',
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      common: `${process.cwd()}/../common`,
      resources: `${process.cwd()}/../resources`,
    },
  },
  define: {
    'process.env': process.env,  // Ensure the environment variables are accessible in your code
  },
});
