    // vite.config.js
    import { defineConfig } from 'vite';
    import tailwindcss from '@tailwindcss/vite';
    import react from '@vitejs/plugin-react'; // if using React

    export default defineConfig({
      plugins: [
        react(), // if using React
        tailwindcss(),
      ],
    });