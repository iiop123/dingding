import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
        input: {
            index: path.resolve(__dirname, 'index.html'),
            list: path.resolve(__dirname, 'list.html')
        },
    },
}
})
