import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const app = createApp(App);
app.use(router);
app.mount('#app');
app.use(ElementPlus)
