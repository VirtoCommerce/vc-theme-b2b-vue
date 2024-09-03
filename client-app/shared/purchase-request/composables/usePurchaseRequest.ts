import { computed, toValue } from "vue";
import { useAllGlobalVariables } from "@/core/api/graphql/composables";
import { useGetPurchaseRequestQuery } from "@/core/api/graphql/purchase-request/queries/getPurchaseRequest";
import { useUserQuote } from "@/shared/account/composables/useUserQuote";
import { useFullCart } from "@/shared/cart";
import { toAttachedFile } from "@/ui-kit/utilities/file";
import type { MaybeRefOrGetter } from "vue";

export function usePurchaseRequest(variables: MaybeRefOrGetter<{ id: string }>) {
  const { result, refetch, loading: purchaseRequestLoading } = useGetPurchaseRequestQuery(variables);

  const purchaseRequest = computed(() => result?.value?.purchaseRequest);

  const sources = computed(() => purchaseRequest.value?.sources ?? []);

  const sourceFiles = computed(() =>
    sources.value.map((source) => toAttachedFile(source.name, source.size, source.contentType, source.url)),
  );

  const {
    loading: cartLoading,
    cart,
    allItemsAreDigital: allCartItemsAreDigital,
    forceFetch: fetchCart,
    changeItemQuantityBatched: _changeCartItemQuantity,
    removeItems: _removeCartItems,
  } = useFullCart();
  const {
    fetching: quoteLoading,
    quote,
    fetchQuote,
    changeItemQuantity: _changeQuoteItemQuantity,
    removeItem: _removeQuoteItem,
  } = useUserQuote();

  async function fetchItems() {
    if (purchaseRequest.value?.cartId) {
      await fetchCart({ cartType: "PurchaseRequest", cartName: purchaseRequest.value.number });
    }
    if (purchaseRequest.value?.quoteId) {
      await fetchQuote({ id: purchaseRequest.value.quoteId, ...toValue(useAllGlobalVariables()) });
    }
  }

  async function changeCartItemQuantity(value: { itemId: string; quantity: number }) {
    await _changeCartItemQuantity(value.itemId, value.quantity);
    await fetchItems();
  }

  async function changeQuoteItemQuantity(value: { itemId: string; quantity: number }) {
    await _changeQuoteItemQuantity(purchaseRequest.value!.quoteId!, value.itemId, value.quantity);
    await fetchItems();
  }

  async function removeCartItems(itemIds: string[]) {
    await _removeCartItems(itemIds);
    await fetchItems();
  }

  async function removeQuoteItem(itemId: string) {
    await _removeQuoteItem(purchaseRequest.value!.quoteId!, itemId);
    await fetchItems();
  }

  return {
    loading: computed(() => purchaseRequestLoading.value || cartLoading.value || quoteLoading.value),
    purchaseRequest,
    sources,
    sourceFiles,
    cart,
    allCartItemsAreDigital,
    quote,
    refetch,
    fetchItems,
    changeCartItemQuantity,
    changeQuoteItemQuantity,
    removeCartItems,
    removeQuoteItem,
  };
}
