import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      // Extend Tailwind theme for custom background size
      theme: {
        extend: {
          backgroundSize: {
            '200': '200% 100%',
          },
        },
      },
    }),
  ],
});
