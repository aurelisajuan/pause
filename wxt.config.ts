import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  
  // Configure the extension
  manifest: {
    name: 'Pause',
    description: 'A gentle reminder to pause, breathe, and be present in your digital life.',
    version: '1.0.0',
    action: {
      default_popup: 'landing.html'
    }
  }
});
