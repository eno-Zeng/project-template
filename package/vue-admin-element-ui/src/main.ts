import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import Layout from '@/layout';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Layout);

app.mount('#app');
