<template>
  <VcWidget
    v-if="!model.hidden"
    class="variations"
    size="lg"
    :title="model.title || $t('shared.catalog.product_details.variations.title')"
    prepend-icon="cube"
  >
    <div class="variations__views flex justify-between">
      <div v-if="!isSmallScreen">
        <button type="button" class="variations__view" :disabled="!isTableView" @click="toggleView">
          <VcIcon name="list" class="variations__icon" />

          {{ $t("shared.catalog.product_details.variations.list") }}
        </button>

        <button type="button" class="variations__view" :disabled="isTableView" @click="toggleView">
          <VcIcon name="table" class="variations__icon" />

          {{ $t("shared.catalog.product_details.variations.table") }}
        </button>
      </div>

      <VcButton variant="outline" @click="$emit('showFilters')">
        {{ $t("common.buttons.filters") }}
      </VcButton>
    </div>

    <!-- Filters chips -->
    <div v-if="hasSelectedFilters" class="flex flex-wrap gap-x-3 gap-y-2 pb-6">
      <template v-for="facet in productsFilters?.facets">
        <template v-for="filterItem in facet.values">
          <VcChip
            v-if="filterItem.selected"
            :key="facet.paramName + filterItem.value"
            color="secondary"
            closable
            @close="
              $emit('removeFacetFilter', {
                paramName: facet.paramName,
                value: filterItem.value,
              })
            "
          >
            {{ filterItem.label }}
          </VcChip>
        </template>
      </template>

      <VcChip color="secondary" variant="outline" clickable @click="$emit('resetFacetFilters')">
        <span>{{ $t("common.buttons.reset_filters") }}</span>

        <VcIcon name="reset" />
      </VcChip>
    </div>

    <VariationsDefault
      v-if="isSmallScreen || (!isSmallScreen && !isTableView)"
      :variations="variations"
      :fetching="fetchingVariations"
      :page-number="pageNumber"
      :pages-count="pagesCount"
      @change-page="changePage"
    />

    <VariationsTable
      v-else
      :variations="variations"
      :sort="sort"
      :fetching="fetchingVariations"
      :page-number="pageNumber"
      :pages-count="pagesCount"
      @apply-sorting="applySorting"
      @change-page="changePage"
    />
  </VcWidget>
</template>

<script setup lang="ts">
import { useBreakpoints } from "@vueuse/core";
import { ref } from "vue";
import { BREAKPOINTS } from "@/core/constants";
import VariationsDefault from "./variations-default.vue";
import VariationsTable from "./variations-table.vue";
import type { Product } from "@/core/api/graphql/types";
import type { FacetItemType, FacetValueItemType, ISortInfo } from "@/core/types";
import type { ProductsFiltersType } from "@/shared/catalog";

interface IEmits {
  (event: "applySorting", item: ISortInfo): void;
  (event: "changePage", pageNumber: number): void;
  (event: "showFilters"): void;
  (event: "removeFacetFilter", payload: Pick<FacetItemType, "paramName"> & Pick<FacetValueItemType, "value">): void;
  (event: "resetFacetFilters"): void;
}

interface IProps {
  variations: Product[];
  fetchingVariations: boolean;
  sort: ISortInfo;
  model: {
    title?: string;
    hidden?: boolean;
  };
  pageNumber: number;
  pagesCount: number;
  productsFilters?: ProductsFiltersType;
  hasSelectedFilters: boolean;
}

const emit = defineEmits<IEmits>();

defineProps<IProps>();

const breakpoints = useBreakpoints(BREAKPOINTS);

const isTableView = ref(false);
const isSmallScreen = breakpoints.smaller("xl");

function toggleView() {
  isTableView.value = !isTableView.value;
}

function applySorting(sortInfo: ISortInfo): void {
  emit("applySorting", sortInfo);
}

function changePage(page: number): void {
  emit("changePage", page);
}
</script>

<style lang="scss">
.variations {
  &__views {
    @apply mb-6 space-x-3;
  }

  &__view {
    @apply p-2 rounded bg-transparent text-sm text-neutral font-bold;

    &:hover {
      @apply bg-neutral-50;
    }

    &:disabled {
      @apply bg-neutral-100 text-neutral-950;
    }
  }

  &__icon {
    @apply me-1 size-5;

    *:disabled > & {
      @apply text-primary;
    }
  }
}
</style>
