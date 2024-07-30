<script setup lang="ts">
import { AxiosError } from 'axios'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import axios from '@/axios'
import { useToastStore } from '@/stores/toast.store'

import type { IIpAddressRestriction, IWebRestriction } from '../types'
import CardBreadcrumbs from './card-breadcrumbs.vue'
import { useForm } from './form'

const router = useRouter()
const { toastRef } = useToastStore()
const form = reactive(useForm())

const webRestrictions = ref<IWebRestriction[]>([])
const ipAddressRestrictions = ref<IIpAddressRestriction[]>([])

const showOrganizationModal = ref(false)
const toggleOrganizationModal = (value: boolean) => {
  let newValue = !showOrganizationModal.value
  if (value === true) newValue = true
  if (value === false) newValue = false
  showOrganizationModal.value = newValue
}

const generatedOrganization = ref()
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
    const response = await axios.post('/v1/organizations', form.data)
    if (response.status === 201) {
      generatedOrganization.value = response.data.api_key
      toastRef.toast('Create success')
      toggleOrganizationModal(true)
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
  toggleOrganizationModal(false)
  router.push('/credentials/organizations')
}

const tooltip = ref('copy')
const onCopyOrganization = () => {
  navigator.clipboard.writeText(generatedOrganization.value)
  tooltip.value = 'copied!'
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <card-breadcrumbs />

    <base-card>
      <template #header>API Keys</template>
      <p>
        API key is a unique code that serves to provide login access and link code from one
        developer to another. As already explained, it is beneficial in the authentication process,
        notably when an API will be run by developers.
      </p>

      <div class="flex flex-col gap-4 mt-5">
        <base-input required v-model="form.data.name" label="Name" :errors="errors?.name" />
      </div>
    </base-card>

    <base-card>
      <div class="flex gap-2">
        <base-button color="primary" @click="onSave()">Save & Generate Key</base-button>
        <router-link to="/credentials/organizations">
          <base-button color="danger">Cancel</base-button>
        </router-link>
      </div>
    </base-card>

    <!-- success confirmation, and inform user to save the api key -->
    <base-modal :is-open="showOrganizationModal" @on-close="onCloseCreatedModal()">
      <div class="max-h-90vh overflow-auto p-4">
        <h2 class="py-4 text-2xl font-bold">Organization created</h2>
        <div class="space-y-8">
          <p>Make sure to copy your Organization now. You won't be able to see it again!</p>
          <div class="flex flex-col gap-2">
            <span class="font-semibold">Your Organization</span>
            <div class="w-full border border-black flex items-center gap-2 py-2">
              <base-button size="sm" v-tooltip="tooltip" @click="onCopyOrganization">
                <base-icon icon="i-far-copy"></base-icon>
              </base-button>
              <div>{{ generatedOrganization }}</div>
            </div>
          </div>
          <div class="flex gap-2">
            <base-button color="primary" size="sm" @click="toggleOrganizationModal(false)">
              Close
            </base-button>
          </div>
        </div>
      </div>
    </base-modal>
  </div>
</template>

<style scoped lang="postcss"></style>
