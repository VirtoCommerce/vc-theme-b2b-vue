import { getSortingExpression, ISortInfo, Logger, SortDirection, toInputAddress } from "@/core";
import { deleteMemberAddresses, updateMemberAddresses } from "@/xapi/graphql/account";
import { getOrganizationAddresses } from "@/xapi/graphql/organization";
import { InputMemberAddressType, MemberAddressType } from "@/xapi/types";
import { MaybeRef } from "@vueuse/core";
import { computed, readonly, ref, shallowRef, unref } from "vue";

const requestedAddressesQuantity = 9999;

export default function useOrganizationAddresses(organizationId: MaybeRef<string>) {
  const loading = ref(false);
  const addresses = shallowRef<MemberAddressType[]>([]);
  const sort = ref<ISortInfo>({
    fieldName: "createdDate",
    direction: SortDirection.Descending,
  });

  async function fetchAddresses() {
    try {
      loading.value = true;

      const sortingExpression = getSortingExpression(sort.value);

      const { items = [] } = await getOrganizationAddresses(unref(organizationId), {
        sort: sortingExpression,
        first: requestedAddressesQuantity,
      });

      addresses.value = items;
    } catch (e) {
      Logger.error(`${useOrganizationAddresses.name}.${fetchAddresses.name}`, e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function removeAddresses(items: MemberAddressType[]): Promise<void> {
    loading.value = true;

    const inputAddresses: InputMemberAddressType[] = items.map(toInputAddress);

    try {
      await deleteMemberAddresses(inputAddresses, unref(organizationId));
    } catch (e) {
      Logger.error(`${useOrganizationAddresses.name}.${removeAddresses.name}`, e);
      throw e;
    } finally {
      loading.value = false;
    }

    await fetchAddresses();
  }

  async function updateAddresses(items: MemberAddressType[]): Promise<void> {
    loading.value = true;

    const inputAddresses: InputMemberAddressType[] = items.map(toInputAddress);

    try {
      await updateMemberAddresses(unref(organizationId), inputAddresses);
    } catch (e) {
      Logger.error("useUserAddresses.updateAddresses", e);
      throw e;
    } finally {
      loading.value = false;
    }

    await fetchAddresses();
  }

  async function addOrUpdateAddresses(items: MemberAddressType[]): Promise<void> {
    if (!items.length) {
      return;
    }

    const updatedAddresses: MemberAddressType[] = addresses.value.slice();

    items.forEach((newAddress: MemberAddressType) => {
      const index = updatedAddresses.findIndex((oldAddress) => oldAddress.id === newAddress.id);

      if (index === -1) {
        updatedAddresses.push(newAddress);
      } else {
        updatedAddresses.splice(index, 1, newAddress);
      }
    });

    await updateAddresses(updatedAddresses);
  }

  return {
    sort,
    fetchAddresses,
    removeAddresses,
    addOrUpdateAddresses,
    loading: readonly(loading),
    addresses: computed(() => addresses.value),
  };
}
