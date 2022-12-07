import { createApp } from 'vue'
import VueClipboard from 'vue-clipboard2'
import index from './index.vue'

createApp(index).use(VueClipboard).mount('#app')