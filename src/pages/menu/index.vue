<script setup lang="ts">
import AppMenu from '@/components/app-menu.vue'

const breadcrumbs = [
  {
    name: 'Menu'
  }
]

const menus = [
  {
    name: 'Home',
    path: '/home',
    icon: 'i-far-house'
  },
  {
    name: 'Organization',
    path: '/organizations',
    icon: 'i-far-building-user'
  }
]
</script>

<template>
  <app-menu :breadcrumbs="breadcrumbs" :menus="menus" />
</template>
