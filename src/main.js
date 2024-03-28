import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './router/index';

const app = createApp(App);

setupRouter(app);

app.mount('#app', true);
