import { ref, computed, readonly, triggerRef } from "vue";
import { getProduct } from "@/core/api/graphql/catalog";
import { Logger } from "@/core/utilities";
import { productsInWishlistEvent, useBroadcast } from "@/shared/broadcast";
import type { Product } from "@/core/api/graphql/types";
import type { ProductInWishlistEventDataType } from "@/shared/broadcast";
import type { Ref } from "vue";

export function useProduct() {
  const loading: Ref<boolean> = ref(true);
  const product: Ref<Product | null> = ref(null);

  const broadcast = useBroadcast();

  async function loadProduct(id: string) {
    loading.value = true;
    try {
      product.value = await getProduct(id);
    } catch (e) {
      Logger.error("useProduct.loadProduct", e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  broadcast.on(productsInWishlistEvent, (eventItems: ProductInWishlistEventDataType[]) => {
    let trigger = false;

    eventItems.forEach(({ productId, inWishlist }) => {
      if (product.value && product.value.id === productId) {
        product.value.inWishlist = inWishlist;
        trigger = true;
      }
    });

    if (trigger) {
      triggerRef(product);
    }
  });

  return {
    loadProduct,
    loading: readonly(loading),
    product: computed(() => product.value),
  };
}
