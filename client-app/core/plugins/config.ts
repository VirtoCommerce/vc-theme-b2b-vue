import { App } from "vue";
import { IThemeConfigPreset } from "../types";

export default {
  install: (app: App, options: IThemeConfigPreset) => {
    app.config.globalProperties.$cfg = options;
    app.provide("cfg", options);

    // Set CSS variables to use as TailwindCSS arbitrary values: https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values
    Object.entries(options)
      .filter(([key]) => /^color/.test(key))
      .forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key.replace(/_/g, "-")}`, value);
      });
  },
};
