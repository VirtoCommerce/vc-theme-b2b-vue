import {
  AnyAddressType,
  getSortingExpression,
  isEqualAddresses,
  ISortInfo,
  Logger,
  SortDirection,
  toInputAddress,
} from "@/core";
import { deleteMemberAddresses, getMyAddresses, updateMemberAddresses } from "@/xapi/graphql/account";
import { InputMemberAddressType, MemberAddressType, UserType } from "@/xapi/types";
import { MaybeRef } from "@vueuse/core";
import { computed, readonly, ref, Ref, shallowRef, unref } from "vue";

export default (options: { user: MaybeRef<UserType> }) => {
  const { user } = options;

  const loading: Ref<boolean> = ref(false);
  const addresses: Ref<MemberAddressType[]> = shallowRef<MemberAddressType[]>([]);
  const defaultShippingAddress: Ref<MemberAddressType | undefined> = ref();
  const defaultBillingAddress: Ref<MemberAddressType | undefined> = ref();

  // TODO: refine the sorting logic
  const sort: Ref<ISortInfo> = ref({
    fieldName: "lastName",
    direction: SortDirection.Ascending,
  });

  function isExistAddress(address: AnyAddressType): boolean {
    return addresses.value.some((item) => isEqualAddresses(item, address));
  }

  async function fetchAddresses() {
    loading.value = true;

    const sortingExpression = getSortingExpression(sort.value);

    try {
      addresses.value = await getMyAddresses({ sort: sortingExpression });
    } catch (e) {
      Logger.error("useUserAddresses.fetchAddresses", e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function setDefaultAddress(_address: MemberAddressType): Promise<void> {
    //TODO: will be implemented in the separate story
  }

  async function updateAddresses(items: MemberAddressType[], memberId = unref(user).memberId!): Promise<void> {
    loading.value = true;

    const inputAddresses: InputMemberAddressType[] = items.map(toInputAddress);

    try {
      await updateMemberAddresses(memberId, inputAddresses);
    } catch (e) {
      Logger.error("useUserAddresses.updateAddresses", e);
      throw e;
    } finally {
      loading.value = false;
    }

    await fetchAddresses();
  }

  async function addOrUpdateAddresses(items: MemberAddressType[], memberId?: string): Promise<void> {
    if (!items.length) {
      return;
    }

    loading.value = true;

    const updatedAddresses: MemberAddressType[] = addresses.value.slice();

    items.forEach((newAddress: MemberAddressType) => {
      const index = updatedAddresses.findIndex((oldAddress) => oldAddress.id === newAddress.id);

      if (index === -1) {
        updatedAddresses.push(newAddress);
      } else {
        updatedAddresses.splice(index, 1, newAddress);
      }
    });

    await updateAddresses(updatedAddresses, memberId);
  }

  async function removeAddresses(items: MemberAddressType[], memberId = unref(user).memberId!): Promise<void> {
    if (!items.length) {
      return;
    }

    loading.value = true;

    const inputAddresses: InputMemberAddressType[] = items.map(toInputAddress);

    try {
      await deleteMemberAddresses(inputAddresses, memberId);
    } catch (e) {
      Logger.error(`useUserAddresses.${removeAddresses.name}`, e);
      throw e;
    } finally {
      loading.value = false;
    }

    await fetchAddresses();
  }

  return {
    sort,
    isExistAddress,
    fetchAddresses,
    setDefaultAddress,
    updateAddresses,
    addOrUpdateAddresses,
    removeAddresses,
    loading: readonly(loading),
    addresses: computed(() => addresses.value),
    defaultShippingAddress: computed(() => defaultShippingAddress.value),
    defaultBillingAddress: computed(() => defaultBillingAddress.value),
  };
};
