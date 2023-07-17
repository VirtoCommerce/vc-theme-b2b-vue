import _ from "lodash";
import { computed, markRaw, ref, unref } from "vue";
import type { ClosePopupHandle, IPopup } from "..";

const stack = ref<IPopup[]>([]);

export default function usePopup() {
  function openPopup(options: IPopup): ClosePopupHandle {
    const id = options.id || _.uniqueId();

    stack.value.push({
      id,
      props: options.props,
      component: typeof options.component === "string" ? options.component : markRaw(options.component),
    });

    return () => closePopup(id);
  }

  function closePopup(id?: string) {
    if (!id) {
      // Close last popup window
      stack.value.pop();
      return;
    }

    const index = stack.value.findIndex((item) => item.id === id);

    if (index === -1) {
      return;
    }

    stack.value.splice(index, 1);
  }

  function isPopupOpened(id: string) {
    return !!stack.value.find((el) => el.id === id);
  }

  return {
    openPopup,
    closePopup,
    isPopupOpened,
    popupStack: computed(() => stack.value),
  };
}
