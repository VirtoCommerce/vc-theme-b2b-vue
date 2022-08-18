import { App } from "vue";
import { useStaticPage } from "@/core/composables";

export default {
  install: (app: App, options: any) => {
    const bodyEl = document.getElementsByTagName("body").item(0);
    if (bodyEl) {
      bodyEl.style.visibility = "hidden";
    }
    window.addEventListener("message", (event: MessageEvent) => {
      if (event.origin !== document.location.origin || event.data.source !== "builder") {
        // note: it can be cause of some problems. investigate it.
        return;
      }
      if (bodyEl) {
        bodyEl.style.visibility = "visible";
      }
      switch (event.data.type) {
        case "changed":
          useStaticPage(event.data.model.template);
          break;
        case "navigate":
          options.router.push(event.data.url);
          break;
        case "settings": {
          // console.log(app.config.globalProperties.$cfg, event.data);
          const keys = Object.entries(event.data.settings);
          keys.forEach(([key, value]) => {
            app.config.globalProperties.$cfg[key] = value;
          });
          keys
            .filter(([key]) => /^color/.test(key))
            .forEach(([key, value]) => {
              document.documentElement.style.setProperty(`--${key.replace(/_/g, "-")}`, value as string);
            });
          break;
        }
      }
    });
    window.parent.postMessage({ source: "preview", type: "loaded" }, window.location.origin);
  },
};
