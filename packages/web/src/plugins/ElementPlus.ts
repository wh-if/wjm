import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { ElLoading } from "element-plus";
import type { App } from "vue";

export default (app: App) => {
  // ElementPlusIcons
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
  // loading directive
  app.use(ElLoading);
};
