import './assets/main.css'
import 'sweetalert2/dist/sweetalert2.min.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueSweetalert2 from 'vue-sweetalert2';
import peticion from '../utilities/peticion';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

//utilities
app.config.globalProperties.$peticion = peticion

app.use(VueSweetalert2)

app.mount('#app')
