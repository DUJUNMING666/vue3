import { createApp } from 'vue'
import axios from "axios";
import store from "./store/index.js";
import App from './App.vue'
import router from "./router/index";
import "vuetify/dist/vuetify.min.css"
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import '@mdi/font/css/materialdesignicons.css';
// 导入 Vuetify 相关内容
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
axios.defaults.baseURL = "http://localhost:3000"
const vuetify = createVuetify({
    components, // 使用导入的组件
    directives, // 使用导入的指令
    theme: { defaultTheme: 'light' },
})
// 全局注册 QuillEditor 组件// 创建 Vue 应用实例时，将 vuetify 配置传递给 use() 方法
createApp(App).component('QuillEditor', QuillEditor)
    .use(router)
    .use(vuetify)
    .use(store)
    .mount('#app')
