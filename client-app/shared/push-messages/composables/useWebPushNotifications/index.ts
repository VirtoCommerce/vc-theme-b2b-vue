import { defineAsyncComponent } from "vue";
import { useNavigations } from "@/core/composables";
import { useModuleSettings } from "@/core/composables/useModuleSettings";
import { useThemeContext } from "@/core/composables/useThemeContext";
import { MODULE_ID_PUSH_MESSAGES } from "@/core/constants/modules";
import { useUser } from "@/shared/account/composables/useUser";
import { useCustomHeaderLinkComponents } from "@/shared/layout/composables/useCustomHeaderLinkComponents";
import type { MenuType } from "@/core/types";
import type { ElementType } from "@/shared/layout/composables/useCustomHeaderLinkComponents";
import type { DeepPartial } from "utility-types";

const REGISTRATION_SCOPE = "/firebase-cloud-messaging-push-scope";

const desktopMenuItems: DeepPartial<MenuType> = {
  header: {
    desktop: {
      main: [
        {
          id: "push-messages",
          title: "shared.layout.header.menu.push-messages",
          icon: "/static/icons/basic/bell.svg#icon",
          priority: 40,
        },
      ],
      account: {
        children: [
          {
            id: "push-messages",
            title: "shared.account.navigation.links.notifications",
            route: {
              name: "Notifications",
            },
            icon: "bell",
            priority: 75,
          },
        ],
      },
    },
  },
};

const menuLinkCustomElement: ElementType = {
  id: "push-messages",
  component: defineAsyncComponent(() => import("@/shared/push-messages/components/link-push-messages.vue")),
};

export function useWebPushNotifications() {
  async function init() {
    const { hasModuleSettings } = useModuleSettings(MODULE_ID_PUSH_MESSAGES);
    const { isAuthenticated } = useUser();
    const { themeContext } = useThemeContext();
    const { mergeMenuSchema } = useNavigations();
    const { registerCustomLinkComponent } = useCustomHeaderLinkComponents();

    if (!themeContext.value?.settings?.push_messages_enabled || !isAuthenticated.value || !hasModuleSettings.value) {
      const serviceWorkerRegistration = await navigator.serviceWorker.getRegistration(REGISTRATION_SCOPE);
      if (serviceWorkerRegistration) {
        void serviceWorkerRegistration.unregister();
      }
      return;
    }

    const { useWebPushNotificationsModule } = await import("./useWebPushNotificationsModule");
    const { initModule } = useWebPushNotificationsModule();
    await initModule();
    mergeMenuSchema(desktopMenuItems);
    registerCustomLinkComponent(menuLinkCustomElement);
  }

  return { init };
}
