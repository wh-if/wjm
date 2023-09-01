import "./assets/main.css";

import { createApp, watch } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// element-plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// element-plus icon
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);

const pinia = createPinia()
app.use(pinia);
app.use(router);

// element-plus
app.use(ElementPlus);
// element-plus icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount("#app");


const storagedState = JSON.parse(sessionStorage.getItem('piniaState') || '{}')
pinia.state.value = storagedState;

watch(
  pinia.state,
  (state) => {
    // 每当状态发生变化时，将整个 state 持久化到本地存储。
    sessionStorage.setItem('piniaState', JSON.stringify(state))
  },
  { deep: true }
)
