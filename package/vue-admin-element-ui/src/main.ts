import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import 'element-plus/dist/index.css';
import ElementPlus from 'element-plus';

import '@/styles/index.css';

import Layout from '@/layout';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.use(Layout);

app.mount('#app');
