import "./assets/main.css";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import pinia from "./stores";
import ElementPlus from "./plugins/ElementPlus";

const app = createApp(App);

app.use(router);
app.use(pinia);

app.use(ElementPlus);

app.mount("#app");
