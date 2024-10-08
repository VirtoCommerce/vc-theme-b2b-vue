<template>
  <router-link v-slot="{ href, navigate, isActive, isExactActive }" :to="toValue" custom>
    <component
      :is="isLink ? 'a' : 'button'"
      :href="getHrefValue(href)"
      :class="[
        'flex min-h-9 items-center gap-x-3.5 text-left leading-tight tracking-[0.01em]',
        isLink && !isExternalLink && (isActive || isExactActive)
          ? 'text-[--mobile-menu-link-active-color]'
          : 'text-[--mobile-menu-link-color]',
        $attrs.class,
      ]"
      @click.prevent="click(navigate)"
    >
      <slot name="icon" v-bind="{ isActive, isExactActive }">
        <svg
          v-if="link.icon"
          height="36"
          width="36"
          :class="[
            'shrink-0',
            isLink && (isActive || isExactActive)
              ? 'text-[--mobile-menu-icon-active-color]'
              : 'text-[--mobile-menu-icon-color]',
          ]"
        >
          <use :href="link.icon" />
        </svg>
      </slot>

      <span class="line-clamp-3 break-words">
        <slot v-bind="{ isActive, isExactActive }" />
      </span>

      <VcBadge v-if="count" variant="solid-light" color="neutral" size="lg" rounded>
        {{ $n(count, "decimal", { notation: "compact" }) }}
      </VcBadge>

      <VcIcon v-if="isParent" class="ml-auto text-[--mobile-menu-navigation-color]" name="chevron-right" />
    </component>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getLinkAttr } from "@/core/utilities";
import type { ExtendedMenuLinkType } from "@/core/types";
import type { NavigationFailure } from "vue-router";

interface IEmits {
  (event: "select"): void;
  (event: "close"): void;
}

interface IProps {
  link: ExtendedMenuLinkType;
  count?: number;
}

const emit = defineEmits<IEmits>();
const props = withDefaults(defineProps<IProps>(), {
  count: 0,
});

const isParent = computed<boolean>(() => !!props.link.children?.length);
const isLink = computed<boolean>(() => !!props.link.route);

function click(navigate: () => Promise<void | NavigationFailure>) {
  if (isParent.value) {
    emit("select");
  } else {
    if (isExternalLink.value) {
      window.open(props.link.route as string, "_blank")?.focus();
    } else {
      void navigate();
    }
    emit("close");
  }
}

const isExternalLink = computed(() => {
  return isLink.value && "externalLink" in getLinkAttr(props.link.route);
});

function getHrefValue(href?: string) {
  if (isExternalLink.value) {
    return props.link.route;
  }
  return href;
}

const toValue = computed(() => {
  if (isExternalLink.value) {
    return "";
  }
  return props.link.route ?? "#";
});
</script>
