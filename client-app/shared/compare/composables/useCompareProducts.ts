import { inject, computed } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { useNotifications } from "@/shared/notification";
import { Product } from "@core/api/graphql/types";
import { truncate } from "@core/utilities";
import { configInjectionKey } from "@core/injection-keys";

const NOTIFICATIONS_GROUP = "compare-pruducts";

const productsIds = useLocalStorage<string[]>("productCompareListIds", []);

export default () => {
  const config = inject(configInjectionKey);
  const notifications = useNotifications();
  const productsLimit = config?.product_compare_limit || 5;

  function addToCompareList(product: Product) {
    if (productsIds.value.length >= productsLimit) {
      notifications.show({
        duration: 15000,
        type: "primary",
        html: `Only ${productsLimit} products can be compared`,
        group: NOTIFICATIONS_GROUP,
      });

      return;
    }

    if (productsIds.value.includes(product.id)) return;

    productsIds.value.push(product.id);

    notifications.success({
      duration: 15000,
      html:
        `Product <span class="hidden lg:inline">“<strong>${truncate(product.name, 60)}</strong>”</span> ` +
        `is added to compare list ` +
        `<span class="hidden lg:inline">(${productsLimit - productsIds.value.length} items left)</span>`,
      button: {
        text: "Compare",
        to: { path: "/compare" },
        clickHandler() {
          notifications.clear(NOTIFICATIONS_GROUP);
        },
      },
      group: NOTIFICATIONS_GROUP,
    });
  }

  function removeFromCompareList(product: Product) {
    const index = productsIds.value.indexOf(product.id);

    if (index === -1) return;

    productsIds.value.splice(index, 1);

    notifications.show({
      duration: 15000,
      type: "primary",
      html:
        `Product <span class="hidden lg:inline">“<strong>${truncate(product.name, 60)}</strong>”</span> ` +
        `was removed from the compare list`,
      group: NOTIFICATIONS_GROUP,
    });
  }

  function clearCompareList() {
    productsIds.value = [];
  }

  return {
    addToCompareList,
    removeFromCompareList,
    clearCompareList,
    productsIds: computed(() => productsIds.value.slice(0, productsLimit)),
  };
};
