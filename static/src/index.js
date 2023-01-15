import { createApp } from 'vue'
import VueClipboard from 'vue-clipboard2'
import index from './index.vue'
import "@nutui/nutui/dist/style.css";
import nutui from '@nutui/nutui'
createApp(index).use(VueClipboard).use(nutui).mount('#app')