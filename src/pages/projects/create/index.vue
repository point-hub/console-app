<script setup lang="ts">
import { AxiosError } from 'axios'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import axios from '@/axios'
import { useToastStore } from '@/stores/toast.store'

import CardIpAddressRestrictions from '../components/card-ip-address-restrictions.vue'
import CardWebRestrictions from '../components/card-web-restrictions.vue'
import type { IIpAddressRestriction, IWebRestriction } from '../types'
import CardProjects from './card-projects.vue'
import CardBreadcrumbs from './card-breadcrumbs.vue'
import { useForm } from './form'

const router = useRouter()
const { toastRef } = useToastStore()
const form = reactive(useForm())

const webRestrictions = ref<IWebRestriction[]>([])
const ipAddressRestrictions = ref<IIpAddressRestriction[]>([])

const showProjectModal = ref(false)
const toggleProjectModal = (value: boolean) => {
  let newValue = !showProjectModal.value
  if (value === true) newValue = true
  if (value === false) newValue = false
  showProjectModal.value = newValue
}

const generatedProject = ref()
const onSave = async () => {
  // convert web restrictions array
  form.data.web_restrictions = webRestrictions.value.map(function (item) {
    return item['url']
  })

  // convert ip address restrictions array
  form.data.ip_address_restrictions = ipAddressRestrictions.value.map(function (item) {
    return item['address']
  })

  try {
    const response = await axios.post('/v1/projects', form.data)
    if (response.status === 201) {
      generatedProject.value = response.data.api_key
      toastRef.toast('Create success')
      toggleProjectModal(true)
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const formErrors = error?.response?.data?.errors
      var listErrors: string[] = []
      if (formErrors) {
        for (const key in formErrors) {
          form.errors[key] = formErrors[key]
          listErrors.push(formErrors[key])
        }
      }
      toastRef.toast(error.response?.data.message, {
        lists: listErrors.flat(),
        color: 'danger'
      })
    }
  }
}

const onCloseCreatedModal = () => {
  toggleProjectModal(false)
  router.push('/credentials/projects')
}

const tooltip = ref('copy')
const onCopyProject = () => {
  navigator.clipboard.writeText(generatedProject.value)
  tooltip.value = 'copied!'
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <card-breadcrumbs />

    <card-projects v-model:name="form.data.name" :errors="form.errors" />

    <card-web-restrictions v-model:webRestrictions="webRestrictions" />

    <card-ip-address-restrictions v-model:ipAddressRestrictions="ipAddressRestrictions" />

    <base-card>
      <div class="flex gap-2">
        <base-button color="primary" @click="onSave()">Save & Generate Key</base-button>
        <router-link to="/credentials/projects">
          <base-button color="danger">Cancel</base-button>
        </router-link>
      </div>
    </base-card>

    <!-- success confirmation, and inform user to save the api key -->
    <base-modal :is-open="showProjectModal" @on-close="onCloseCreatedModal()">
      <div class="max-h-90vh overflow-auto p-4">
        <h2 class="py-4 text-2xl font-bold">Project created</h2>
        <div class="space-y-8">
          <p>Make sure to copy your Project now. You won't be able to see it again!</p>
          <div class="flex flex-col gap-2">
            <span class="font-semibold">Your Project</span>
            <div class="w-full border border-black flex items-center gap-2 py-2">
              <base-button size="sm" v-tooltip="tooltip" @click="onCopyProject">
                <base-icon icon="i-far-copy"></base-icon>
              </base-button>
              <div>{{ generatedProject }}</div>
            </div>
          </div>
          <div class="flex gap-2">
            <base-button color="primary" size="sm" @click="toggleProjectModal(false)">
              Close
            </base-button>
          </div>
        </div>
      </div>
    </base-modal>
  </div>
</template>

<style scoped lang="postcss"></style>
