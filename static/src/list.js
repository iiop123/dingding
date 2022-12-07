import { createApp } from 'vue'
import VueClipboard from 'vue-clipboard2'
import list from './list.vue'

createApp(list).use(VueClipboard).mount('#app')