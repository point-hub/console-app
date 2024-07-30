<script setup lang="ts">
import AppBreadcrumb from '@/components/app-breadcrumb.vue'

const breadcrumbs = [
  {
    name: 'Menu',
    path: '/menu'
  },
  {
    name: 'Home'
  }
]

const apps = [
  {
    name: 'Auth',
    link: 'http://localhost:4111',
    icon: 'https://f001.backblazeb2.com/file/pointhub-assets/services/auth.png'
  },
  {
    name: 'Mail',
    link: 'http://localhost:4121',
    icon: 'https://f001.backblazeb2.com/file/pointhub-assets/services/mail.png'
  },
  {
    name: 'Storage',
    link: 'http://localhost:4131',
    icon: 'https://f001.backblazeb2.com/file/pointhub-assets/services/storage.png'
  }
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <app-breadcrumb :breadcrumbs="breadcrumbs" />

    <base-card>
      <template #header>Welcome</template>
      <p>You're working in Pointhub Project's</p>
      <div class="mt-5">
        <base-form label="Project ID">1</base-form>
      </div>
    </base-card>

    <base-card>
      <template #header>Pointhub Services</template>
      <div class="grid cols-1 sm:cols-2 lg:cols-3 xl:cols-4 gap-4">
        <base-button size="none" v-for="app in apps" :key="app" class="w-full h-full">
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
    </base-card>
  </div>
</template>

<style scoped lang="postcss"></style>
