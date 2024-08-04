<script setup lang="ts">
import AuthFooter from '../components/auth-footer.vue'
import AuthHeader from '../components/auth-header.vue'
</script>

<template>
  <div class="auth-layout">
    <component :is="AuthHeader"></component>
    <RouterView />
    <component :is="AuthFooter"></component>
  </div>
</template>

<style scoped lang="postcss">
.auth-layout {
  @apply flex flex-col gap-8 items-center justify-center container mx-auto py-16;
}
</style>
