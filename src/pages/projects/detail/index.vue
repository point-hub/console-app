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
import CardProjects from './card-projects.vue'
import CardBreadcrumbs from './card-breadcrumbs.vue'
import { useForm } from './form'

const route = useRoute()
const router = useRouter()
const { toastRef } = useToastStore()
const deleteModalRef = ref()

const form = reactive(useForm())

const formId = ref()
const prefixProject = ref()
const apiKeyResponse = ref()
const webRestrictions = ref<IWebRestriction[]>([])
const ipAddressRestrictions = ref<IIpAddressRestriction[]>([])

onMounted(async () => {
  apiKeyResponse.value = (await axios.get(`/v1/projects/${route.params.id}`)).data
  formId.value = apiKeyResponse.value._id
  form.data.name = apiKeyResponse.value.name
  prefixProject.value = apiKeyResponse.value.prefix_api_key

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

const generatedProject = ref()
const onUpdate = async () => {
  // convert web restrictions array
  form.data.web_restrictions = webRestrictions.value.map(function (item) {
    return item['url']
  })

  // convert ip address restrictions array
  form.data.ip_address_restrictions = ipAddressRestrictions.value.map(function (item) {
    return item['address']
  })

  const response = await axios.patch(`/v1/projects/${route.params.id}`, form.data)
  if (response.status === 200) {
    toastRef.toast('Update success')
    router.push('/credentials/projects')
  }
}

const showProjectModal = ref(false)
const toggleProjectModal = (value: boolean) => {
  let newValue = !showProjectModal.value
  if (value === true) newValue = true
  if (value === false) newValue = false
  showProjectModal.value = newValue
}

const onCloseRegeneratedModal = () => {
  toggleProjectModal(false)
}

const tooltip = ref('copy')
const onCopyProject = () => {
  navigator.clipboard.writeText(generatedProject.value)
  tooltip.value = 'copied!'
}

// regenerate modal logic
const onDeleted = async () => {
  router.push('/credentials/projects')
}

const onRegenerated = (apiKey: string) => {
  generatedProject.value = apiKey
  toggleProjectModal(true)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <card-breadcrumbs :id="route.params.id.toString()" />

    <card-projects
      v-model:name="form.data.name"
      v-model:prefixProject="prefixProject"
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
    <base-modal :is-open="showProjectModal" @on-close="onCloseRegeneratedModal()">
      <div class="max-h-90vh overflow-auto p-4">
        <h2 class="py-4 text-2xl font-bold">Project updated</h2>
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

    <delete-modal ref="deleteModalRef" @deleted="onDeleted" />
  </div>
</template>
