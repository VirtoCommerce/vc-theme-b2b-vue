import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { toEndDateFilterValue, toStartDateFilterValue } from "@/core/utilities";
import type { FacetTermType } from "@/core/api/graphql/types";
import type { DateFilterType } from "@/core/types";
import type { OrdersFilterData, OrdersFilterChipsItem } from "@/shared/account";
import type { Ref } from "vue";

const filterData: Ref<OrdersFilterData> = ref({ statuses: [] });
const appliedFilterData: Ref<OrdersFilterData> = ref({ ...filterData.value });
const facetLocalization: Ref<FacetTermType[] | undefined> = ref();

export function useUserOrdersFilter() {
  const { d, t } = useI18n();

  const currentDate = new Date();

  const yesterdayDate = new Date(currentDate);
  yesterdayDate.setDate(currentDate.getDate() - 1);

  const lastWeekDate = new Date(currentDate);
  lastWeekDate.setDate(currentDate.getDate() - 7);

  const lastMonthDate = new Date(currentDate);
  lastMonthDate.setMonth(currentDate.getMonth() - 1);

  const lastYearDate = new Date(currentDate);
  lastYearDate.setFullYear(currentDate.getFullYear() - 1);

  const dateFilterTypes: DateFilterType[] = [
    {
      id: "custom",
      label: t("common.labels.custom_date"),
    },
    {
      id: "lastDay",
      label: t("common.labels.last_24_hours"),
      startDate: yesterdayDate,
      endDate: currentDate,
    },
    {
      id: "lastWeek",
      label: t("common.labels.last_week"),
      startDate: lastWeekDate,
      endDate: currentDate,
    },
    {
      id: "lastMonth",
      label: t("common.labels.last_month"),
      startDate: lastMonthDate,
      endDate: currentDate,
    },
    {
      id: "lastYear",
      label: t("common.labels.last_year"),
      startDate: lastYearDate,
      endDate: currentDate,
    },
  ];

  const isFilterEmpty = computed(() => {
    const { statuses, startDate, endDate } = appliedFilterData.value;
    return !statuses.length && !startDate && !endDate;
  });

  const isFilterDirty = computed(() => {
    return JSON.stringify(filterData.value) !== JSON.stringify(appliedFilterData.value);
  });

  const filterChipsItems = computed(() => {
    const items: OrdersFilterChipsItem[] = [];

    if (appliedFilterData.value.statuses.length) {
      for (const status of appliedFilterData.value.statuses) {
        items.push({ fieldName: "statuses", value: status, label: getFacetLocalization(status) || status });
      }
    }

    const startDateFilterValue = toStartDateFilterValue(appliedFilterData.value.startDate);
    const endDateFilterValue = toEndDateFilterValue(appliedFilterData.value.endDate);
    if (startDateFilterValue) {
      const formattedDate = d(startDateFilterValue);
      items.push({
        fieldName: "startDate",
        value: appliedFilterData.value.startDate,
        label: t("common.labels.starts_from", [formattedDate]),
      });
    }
    if (endDateFilterValue) {
      const formattedDate = d(endDateFilterValue);
      items.push({
        fieldName: "endDate",
        value: appliedFilterData.value.endDate,
        label: t("common.labels.ends_to", [formattedDate]),
      });
    }
    return items;
  });

  function applyFilters() {
    if (JSON.stringify(appliedFilterData.value) === JSON.stringify(filterData.value)) {
      return;
    }
    appliedFilterData.value = { ...filterData.value };
  }

  function resetFilters() {
    filterData.value = { statuses: [] };
    appliedFilterData.value = { ...filterData.value };
  }

  function resetDataToApplied() {
    filterData.value = { ...appliedFilterData.value };
  }

  function removeFilterChipsItem(item: OrdersFilterChipsItem) {
    if (item.fieldName === "statuses") {
      appliedFilterData.value.statuses.splice(appliedFilterData.value.statuses.indexOf(item.value as string), 1);
    }

    if (item.fieldName === "startDate") {
      appliedFilterData.value.startDate = undefined;
    }

    if (item.fieldName === "endDate") {
      appliedFilterData.value.endDate = undefined;
    }

    filterData.value = { ...appliedFilterData.value };
  }

  function setFacetsLocalization(facets: FacetTermType[] | undefined) {
    facetLocalization.value = facets;
  }

  function getFacetLocalization(term: string): string | undefined {
    return facetLocalization.value?.find((el) => el.term === term)?.label;
  }

  return {
    filterData,
    appliedFilterData: computed(() => appliedFilterData.value),
    dateFilterTypes: computed(() => dateFilterTypes),
    isFilterEmpty,
    isFilterDirty,
    filterChipsItems,
    applyFilters,
    resetFilters,
    resetDataToApplied,
    removeFilterChipsItem,
    setFacetsLocalization,
  };
}
