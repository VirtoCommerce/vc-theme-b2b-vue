<template>
  <div v-if="!loading && (hasContent || objectType)" class="slug-content">
    <CategoryComponent v-if="objectType === 'Category'" :category-id="slugInfo?.entityInfo?.objectId" />
    <Product v-else-if="objectType === 'CatalogProduct'" :product-id="slugInfo?.entityInfo?.objectId" />
    <StaticPage v-else-if="hasContent" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, watchEffect } from "vue";
import { useNavigations } from "@/core/composables";
import { Logger } from "@/core/utilities";
import { useSlugInfo } from "@/shared/common";
import { useStaticPage } from "@/shared/static-content";
import type { StateType } from "@/pages/external/priorityManager";

interface IProps {
  seoUrl: string;
}

interface IEmits {
  (event: "setState", value: StateType): void;
}

const emit = defineEmits<IEmits>();

const props = defineProps<IProps>();

const CategoryComponent = defineAsyncComponent(() => import("@/pages/category.vue"));
const Product = defineAsyncComponent(() => import("@/pages/product.vue"));
const StaticPage = defineAsyncComponent(() => import("@/pages/static-page.vue"));

const { setMatchingRouteName } = useNavigations();

const { staticPage } = useStaticPage();

const { loading, slugInfo, hasContent, pageContent, fetchContent } = useSlugInfo(computed(() => props.seoUrl));

const objectType = computed(() => {
  return slugInfo.value?.entityInfo?.objectType || "";
});

enum ObjectType {
  CatalogProduct = "CatalogProduct",
  Category = "Category",
}

watchEffect(() => {
  if (loading.value) {
    emit("setState", "loading");
  } else if ([ObjectType.Category, ObjectType.CatalogProduct].includes(objectType.value as ObjectType)) {
    emit("setState", "ready");
  } else if (pageContent.value) {
    emit("setState", "ready");
  } else {
    emit("setState", "empty");
  }
});

onBeforeUnmount(() => {
  setMatchingRouteName("");
});

watchEffect(async () => {
  let matchingRouteName = "";

  if (hasContent.value) {
    try {
      await fetchContent();
    } catch (e) {
      Logger.error(e as string);
      emit("setState", "empty");
    }
    staticPage.value = pageContent.value || undefined;
    return;
  }

  switch (slugInfo.value?.entityInfo?.objectType) {
    case ObjectType.CatalogProduct:
      matchingRouteName = "Product";
      break;
    case ObjectType.Category:
      matchingRouteName = "Category";
      break;
  }

  setMatchingRouteName(matchingRouteName);
});
</script>
