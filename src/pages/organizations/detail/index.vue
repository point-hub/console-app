<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import axios from '@/axios'
import { useToastStore } from '@/stores/toast.store'

import CardIpAddressRestrictions from '../components/card-ip-address-restrictions.vue'
import CardWebRestrictions from '../components/card-web-restrictions.vue'
import DeleteModal from '../components/delete-modal.vue'
import type { IIpAddressRestriction, IWebRestriction } from '../types'
import CardOrganizations from './card-organizations.vue'
import CardBreadcrumbs from './card-breadcrumbs.vue'
import { useForm } from './form'

const route = useRoute()
const router = useRouter()
const { toastRef } = useToastStore()
const deleteModalRef = ref()

const form = reactive(useForm())

const formId = ref()
const prefixOrganization = ref()
const apiKeyResponse = ref()
const webRestrictions = ref<IWebRestriction[]>([])
const ipAddressRestrictions = ref<IIpAddressRestriction[]>([])

onMounted(async () => {
  apiKeyResponse.value = (await axios.get(`/v1/organizations/${route.params.id}`)).data
  formId.value = apiKeyResponse.value._id
  form.data.name = apiKeyResponse.value.name
  prefixOrganization.value = apiKeyResponse.value.prefix_api_key

  for (const iterator of apiKeyResponse.value.web_restrictions ?? []) {
    webRestrictions.value.push({
      id: uuidv4(),
      url: iterator
    })
  }

  for (const iterator of apiKeyResponse.value.ip_address_restrictions ?? []) {
    ipAddressRestrictions.value.push({
      id: uuidv4(),
      address: iterator
    })
  }
})

const generatedOrganization = ref()
const onUpdate = async () => {
  // convert web restrictions array
  form.data.web_restrictions = webRestrictions.value.map(function (item) {
    return item['url']
  })

  // convert ip address restrictions array
  form.data.ip_address_restrictions = ipAddressRestrictions.value.map(function (item) {
    return item['address']
  })

  const response = await axios.patch(`/v1/organizations/${route.params.id}`, form.data)
  if (response.status === 200) {
    toastRef.toast('Update success')
    router.push('/credentials/organizations')
  }
}

const showOrganizationModal = ref(false)
const toggleOrganizationModal = (value: boolean) => {
  let newValue = !showOrganizationModal.value
  if (value === true) newValue = true
  if (value === false) newValue = false
  showOrganizationModal.value = newValue
}

const onCloseRegeneratedModal = () => {
  toggleOrganizationModal(false)
}

const tooltip = ref('copy')
const onCopyOrganization = () => {
  navigator.clipboard.writeText(generatedOrganization.value)
  tooltip.value = 'copied!'
}

// regenerate modal logic
const onDeleted = async () => {
  router.push('/credentials/organizations')
}

const onRegenerated = (apiKey: string) => {
  generatedOrganization.value = apiKey
  toggleOrganizationModal(true)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <card-breadcrumbs :id="route.params.id.toString()" />

    <card-organizations
      v-model:name="form.data.name"
      v-model:prefixOrganization="prefixOrganization"
      :form-id="route.params.id.toString()"
      @regenerated="onRegenerated"
    />

    <card-web-restrictions v-model:webRestrictions="webRestrictions" />

    <card-ip-address-restrictions v-model:ipAddressRestrictions="ipAddressRestrictions" />

    <base-card>
      <div class="flex gap-2">
        <base-button color="primary" @click="onUpdate()">Update</base-button>
        <base-button
          color="danger"
          @click="
            deleteModalRef.toggleModal(true, {
              id: route.params.id.toString(),
              name: form.data.name
            })
          "
        >
          Delete
        </base-button>
      </div>
    </base-card>

    <!-- success confirmation, and inform user to save the api key -->
    <base-modal :is-open="showOrganizationModal" @on-close="onCloseRegeneratedModal()">
      <div class="max-h-90vh overflow-auto p-4">
        <h2 class="py-4 text-2xl font-bold">Organization updated</h2>
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

    <delete-modal ref="deleteModalRef" @deleted="onDeleted" />
  </div>
</template>
