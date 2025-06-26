import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';
import tsconfigPaths from 'vite-tsconfig-paths';

const TARGET_API_URL = 'http://api.openweathermap.org/data/2.5/'; // This value will be use by ENV
const APP_ID = '528d4cf5e3e6ea6698a74fb5d1b916e9'; // This value will use by ENV

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), svgLoader()],
  server: {
    proxy: {
      '^/api/.*': {
        target: TARGET_API_URL,
        changeOrigin: true,
        rewrite(path) {
          const newPath = path.replace(/^\/api/, '');
          return `${newPath}&appid=${APP_ID}`;
        },
      },
    },
  },
});
