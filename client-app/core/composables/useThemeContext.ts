import { computed, ref } from "vue";
import { DEVELOPMENT } from "../constants";
import type { IThemeConfig, IThemeContext } from "../types";

const themeContext = ref<IThemeContext>();

export function useThemeContext() {
  async function fetchThemeContext() {
    const result: IThemeContext = await (await fetch("/storefrontapi/theme/context")).json();

    if (DEVELOPMENT) {
      // TODO: remove this when switching to SSR
      const settings: IThemeConfig = await import("../../../config/settings_data.json");

      result.settings = typeof settings.current === "string" ? settings.presets[settings.current] : settings.current;
    }

    themeContext.value = result;
  }

  return {
    fetchThemeContext,
    themeContext: computed({
      get() {
        if (!themeContext.value) {
          throw new Error("Theme context is missing.");
        }

        return themeContext.value!;
      },

      set() {
        throw new Error("Theme context change is not available.");
      },
    }),
  };
}
