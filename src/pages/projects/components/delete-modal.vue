<script setup lang="ts">
import { ref } from 'vue'

import axios from '@/axios'
import { useToastStore } from '@/stores/toast.store'

const { toastRef } = useToastStore()

const id = defineModel('id')
const name = defineModel('name')
const emit = defineEmits(['deleted'])

// regenerate modal logic
interface IData {
  id: string
  name: string
}
const showModal = ref(false)
const toggleModal = (state?: boolean, data?: IData) => {
  if (data) {
    id.value = data.id
    name.value = data.name
  }
  let newValue = !showModal.value
  if (state === true) newValue = true
  if (state === false) newValue = false
  showModal.value = newValue
}

const loadingState = ref(false)
const onDelete = async () => {
  // prevent calling twice use loading state
  if (loadingState.value) return
  // start loading state
  loadingState.value = true
  // start api call
  const response = await axios.delete(`/v1/projects/${id.value}`)
  if (response.status === 200) {
    emit('deleted')
    toastRef.toast(`Delete API key "${name.value}" success`)
    toggleModal(false)
  }
  // stop loading state
  loadingState.value = false
}

defineExpose({
  showModal,
  toggleModal,
  id,
  name,
  loadingState
})
</script>

<template>
  <base-modal :is-open="showModal" @on-close="toggleModal(false)">
    <div class="max-h-90vh overflow-auto p-4">
      <h2 class="py-4 text-2xl font-bold">Delete Project</h2>
      <div class="space-y-8">
        <p>
          Are you sure you want to delete this Project? Any applications or scripts using this API
          Key will no longer be able to access the Auth API. You cannot undo this action.
        </p>
        <div class="flex gap-2">
          <base-button color="danger" size="sm" @click="onDelete()" :disabled="loadingState">
            I Understand, Delete this Project.
          </base-button>
          <base-button color="secondary" size="sm" @click="toggleModal(false)">
            Cancel
          </base-button>
        </div>
      </div>
    </div>
  </base-modal>
</template>
