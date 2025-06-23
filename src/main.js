import './assets/main.css';

import { createApp } from 'vue';
import { h } from 'vue';
import App from './App.vue';
import router from './router';

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.css';

const app = createApp(App);

app.use(ElementPlus);
app.use(router);

app.mount('#app');
