<template>
  <VcModal :title="title" max-width="60rem" hide-actions is-mobile-fullscreen>
    <template #default="{ close }">
      <VcAddressForm
        :model-value="editableAddress"
        :countries="countries"
        :disabled="loading"
        with-personal-info
        required-email
        required-city
        @save="saveAddress"
      >
        <template #append="{ dirty, valid }">
          <div class="flex flex-wrap items-center justify-center gap-4 py-3 *:max-sm:flex-1 sm:justify-end">
            <VcButton min-width="9rem" color="secondary" variant="outline" @click="close">
              {{ $t("common.buttons.cancel") }}
            </VcButton>

            <VcButton min-width="9rem" :disabled="!dirty || !valid" :loading="loading" type="submit">
              {{ saveButtonLabel }}
            </VcButton>
          </div>
        </template>
      </VcAddressForm>
    </template>
  </VcModal>
</template>

<script setup lang="ts">
import { clone } from "lodash";
import { computed, onMounted, ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useCountries } from "@/core/composables";
import type { MemberAddressType } from "@/core/api/graphql/types";

interface IEmits {
  (event: "result", address: MemberAddressType): void;
}

interface IProps {
  address?: MemberAddressType;
  loading?: boolean;
}

const emit = defineEmits<IEmits>();

const props = defineProps<IProps>();

const { countries, loadCountries } = useCountries();
const { t } = useI18n();

const editableAddress = ref<MemberAddressType>();

const title = computed<string>(() =>
  editableAddress.value ? t("common.titles.edit_address") : t("common.titles.new_address"),
);
const saveButtonLabel = computed(() => (editableAddress.value ? t("common.buttons.save") : t("common.buttons.create")));

onMounted(async () => {
  if (!countries.value.length) {
    await loadCountries();
  }
});

function saveAddress(address: MemberAddressType) {
  emit("result", address);
}

watchEffect(() => {
  editableAddress.value = clone(props.address);
});
</script>
