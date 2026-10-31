import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from './router';

import 'element-plus/dist/index.css';
import ElementPlus from 'element-plus';

import '@/styles/index.css';

import Layout from '@/layout';

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.use(Layout);

app.mount('#app');
