<script setup lang="ts">
import type { IFormError } from './form'

const name = defineModel<string>('name')
const errors = defineModel<IFormError>('errors')
</script>

<template>
  <base-card>
    <template #header>Projects</template>
    <p>
      API key is a unique code that serves to provide login access and link code from one developer
      to another. As already explained, it is beneficial in the authentication process, notably when
      an API will be run by developers.
    </p>

    <div class="flex flex-col gap-4 mt-5">
      <base-input required v-model="name" label="Name" :errors="errors?.name" />
    </div>
  </base-card>
</template>

<style scoped lang="postcss"></style>
