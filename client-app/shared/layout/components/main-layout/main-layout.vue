<template>
  <div class="main-layout">
    <VcHeader />

    <!-- Main Content -->
    <div class="main-layout__content">
      <slot />
    </div>

    <VcFooter />
  </div>
</template>

<script setup lang="ts">
import VcFooter from "@/shared/layout/components/footer/vc-footer.vue";
import VcHeader from "@/shared/layout/components/header/vc-header.vue";
</script>

<style lang="scss">
.main-layout {
  @apply flex min-h-screen flex-col;

  &__content {
    @apply relative flex grow flex-col;
  }
}
</style>
