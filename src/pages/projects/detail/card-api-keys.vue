<script setup lang="ts">
import { ref } from 'vue'

import axios from '@/axios'

const formId = defineModel('formId')
const name = defineModel('name')
const prefixProject = defineModel('prefixProject')
const emit = defineEmits(['regenerated'])

// regenerate modal logic
const showRegenerateModalInfo = ref(false)
const toggleRegenerateModalInfo = (value: boolean) => {
  let newValue = !showRegenerateModalInfo.value
  if (value === true) newValue = true
  if (value === false) newValue = false
  showRegenerateModalInfo.value = newValue
}

const onRegenerateLoading = ref(false)
const onRegenerate = async () => {
  // prevent calling twice use loading state
  if (onRegenerateLoading.value) return
  // start loading state
  onRegenerateLoading.value = true
  // start api call
  const response = await axios.patch(`/v1/projects/${formId.value}/regenerate`)
  if (response.status === 200) {
    emit('regenerated', response.data.api_key)
    prefixProject.value = response.data.prefix_api_key
    toggleRegenerateModalInfo(false)
  }
  // stop loading state
  onRegenerateLoading.value = false
}
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
      <base-input required v-model="name" label="Name" />
      <base-form label="Project">
        <div class="flex flex-wrap gap-4 w-full justify-between">
          <p>{{ prefixProject }}******************************</p>
          <base-button color="primary" size="sm" @click="toggleRegenerateModalInfo(true)">
            Regenerate
          </base-button>
          <base-modal
            :is-open="showRegenerateModalInfo"
            @on-close="toggleRegenerateModalInfo(false)"
          >
            <div class="max-h-90vh overflow-auto p-4">
              <h2 class="py-4 text-2xl font-bold">Regenerate Project</h2>
              <div class="space-y-8">
                <p>
                  Are you sure you want to regenerate this Project? Any applications or scripts
                  using this Project will no longer be able to access the Auth API. You cannot undo
                  this action.
                </p>
                <div class="flex gap-2">
                  <base-button
                    color="primary"
                    size="sm"
                    @click="onRegenerate()"
                    :disabled="onRegenerateLoading"
                  >
                    I Understand, Regenerate this Project.
                  </base-button>
                  <base-button
                    color="secondary"
                    size="sm"
                    @click="toggleRegenerateModalInfo(false)"
                  >
                    Cancel
                  </base-button>
                </div>
              </div>
            </div>
          </base-modal>
        </div>
      </base-form>
    </div>
  </base-card>
</template>

<style scoped lang="postcss"></style>
