import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],

  // Relative to project root
  srcDir: "src",             // default: "."
  outDir: "dist",            // default: ".output"

  // Relative to srcDir
  entrypointsDir: "entries", // default: "entrypoints"
  
  // Configure asset handling
  vite: () => ({
    publicDir: 'assets'
  })
});
