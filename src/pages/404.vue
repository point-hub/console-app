<script setup lang="ts">
import { BaseCard, BaseLink } from '@point-hub/papp'
</script>

<template>
  <div class="bg-slate-50 dark:bg-slate-900 w-screen h-screen">
    <div class="mx-auto max-w-xl py-10">
      <component :is="BaseCard" class="rounded-xl">
        <div class="flex flex-col gap-2">
          <div>
            <p class="text-xs text-red">Error 404</p>
          </div>

          <div>
            <h1>Page not found</h1>
            <p>The page you are looking for doesn't exist.</p>
          </div>

          <div class="mt-4 flex gap-2">
            <component :is="BaseLink" href="/" color="primary">Go to Homepage</component>
          </div>
        </div>
      </component>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
