<script setup lang="ts">
import AppBreadcrumb from '@/components/app-breadcrumb.vue'

interface IProps {
  breadcrumbs: { name: string; path?: string }[]
  apps: { name: string; icon: string; link: string; bgColor?: string; color?: string }[]
}

const props = defineProps<IProps>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <app-breadcrumb :breadcrumbs="breadcrumbs" />

    <div class="grid cols-1 sm:cols-2 lg:cols-3 xl:cols-4 gap-4">
      <base-button size="none" v-for="app in props.apps" :key="app" class="w-full h-full">
        <a :href="app.link" class="w-full h-full">
          <base-card class="p-4! h-full" :bg-color="app.bgColor" :body-color="app.color">
            <div class="flex flex-col gap-4">
              <img :src="app.icon" class="h-12 w-12 self-center" />
              <div class="flex flex-col">
                <p class="line-clamp-2 font-bold">{{ app.name }}</p>
              </div>
            </div>
          </base-card>
        </a>
      </base-button>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
