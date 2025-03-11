sudo npx @react-native-community/cli@latest init ADCBMIB


vitejs defineConfig
###################

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: process.cwd(), // Set root to parent directory
  publicDir: "public",  //`${process.cwd()}/../resources`, // Public assets directory
  build: {
    outDir: "dist",
  },
  resolve: {
    alias: {
      common: `${process.cwd()}/../common`, // Allow @ imports from root
      resources: `${process.cwd()}/../resources`,
    },
  },
});



npm i --save-dev @types/node