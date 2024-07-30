<script setup lang="ts">
import { BaseCard, BaseLink } from '@point-hub/papp'
</script>

<template>
  <div class="bg-slate-50 dark:bg-slate-900 w-screen h-screen">
    <div class="mx-auto max-w-xl py-10">
      <component :is="BaseCard" class="rounded-xl">
        <div class="flex flex-col gap-2">
          <div>
            <p class="text-xs text-red">Error 403</p>
          </div>

          <div>
            <h1>Forbidden Access</h1>
            <p>You don't have necessary permissions for this resource.</p>
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
