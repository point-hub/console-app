<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { onMounted, ref, watch } from 'vue'

import { useToastStore } from '@/stores/toast.store'

import type { IWebRestriction } from '../types'
import WebRestrictionExample from './web-restrictions-example.vue'

const { toastRef } = useToastStore()
const updateIndex = ref(-1)
const webRestrictionInput = ref<string>('')
const webRestrictionPlaceholder = ref<string>('')
const webRestrictionInputRef = ref()
const webRestrictions = defineModel<IWebRestriction[]>('webRestrictions', { required: true })
const searchText = ref<string>('')
const filtered = ref()
const submitType = ref<'add' | 'update'>('add')

onMounted(() => {
  filtered.value = webRestrictions.value
})

watch(webRestrictions.value, () => {
  filtered.value = webRestrictions.value
})

const onSearch = () => {
  filtered.value = webRestrictions.value.filter((el: IWebRestriction) => {
    return el.url.includes(searchText.value)
  })
}

const onSave = () => {
  for (const webRestriction of webRestrictions.value) {
    if (webRestriction.url === webRestrictionInput.value) {
      toastRef.toast(`URL "${webRestriction.url}" is exists`, { color: 'danger' })
      return
    }
  }

  if (!webRestrictionInput.value) {
    toastRef.toast(`URL is required`, { color: 'danger' })
    return
  }

  submitType.value = 'add'

  if (updateIndex.value >= 0) {
    // update collection
    webRestrictions.value[updateIndex.value].url = webRestrictionInput.value
    updateIndex.value = -1
  } else {
    // add new collection
    webRestrictions.value.push({
      id: uuidv4(),
      url: webRestrictionInput.value
    })
  }

  // reset input text
  webRestrictionInput.value = ''

  // reset search text
  searchText.value = ''
}

const onUpdate = (webRestriction: IWebRestriction) => {
  submitType.value = 'update'
  webRestrictionPlaceholder.value = webRestriction.url
  updateIndex.value = webRestrictions.value.indexOf(webRestriction)
  webRestrictionInput.value = webRestriction.url
  webRestrictionInputRef.value.inputRef.focus()
}

const onCancel = () => {
  submitType.value = 'add'
  updateIndex.value = -1
  webRestrictionInput.value = ''
}

const onDelete = (webRestriction: IWebRestriction) => {
  for (const [index, iterator] of webRestrictions.value.entries()) {
    if (iterator.id === webRestriction.id) {
      submitType.value = 'add'
      searchText.value = ''
      updateIndex.value = -1
      webRestrictionInput.value = ''
      webRestrictionInputRef.value.inputRef.focus()
      webRestrictions.value.splice(index, 1)
      break
    }
  }
}
</script>

<template>
  <base-card>
    <template #header>Website restrictions</template>
    <p>
      Restrict key usage requests to the specified websites. Here are some examples of URLs that you
      can allow to set up a website:
    </p>
    <div class="flex flex-wrap gap-10 mt-5">
      <div>
        <WebRestrictionExample></WebRestrictionExample>
      </div>
      <div class="flex-1">
        <base-table v-if="webRestrictions.length">
          <thead>
            <tr>
              <th>
                <base-input
                  ref="searchRef"
                  border="none"
                  placeholder="Search"
                  v-model="searchText"
                  @keyup="onSearch()"
                  class="font-light"
                >
                  <template #prefix>
                    <base-icon icon="i-far-magnifying-glass mr-1" />
                  </template>
                </base-input>
              </th>
              <th class="w-1"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="webRestriction in filtered" :key="webRestriction.id">
              <td>{{ webRestriction.url }}</td>
              <td>
                <div class="flex">
                  <base-button size="sm" v-tooltip="'edit'" @click="onUpdate(webRestriction)">
                    <base-icon icon="i-fad-pencil"></base-icon>
                  </base-button>
                  <base-button size="sm" v-tooltip="'delete'" @click="onDelete(webRestriction)">
                    <base-icon icon="i-fad-trash"></base-icon>
                  </base-button>
                </div>
              </td>
            </tr>
          </tbody>
        </base-table>
        <form class="flex flex-col gap-4 mt-5" @submit.prevent="onSave">
          <base-input
            ref="webRestrictionInputRef"
            type="url"
            required
            v-model="webRestrictionInput"
            label="Website URL"
          >
            <template #suffix>
              <div class="flex gap-1">
                <base-button type="submit" color="primary" variant="filled" size="xs">
                  {{ submitType === 'add' ? 'add' : 'update' }}
                </base-button>
                <base-button
                  v-if="submitType === 'update'"
                  @click="onCancel()"
                  type="button"
                  color="danger"
                  variant="filled"
                  size="xs"
                >
                  cancel
                </base-button>
              </div>
            </template>
          </base-input>
        </form>
      </div>
    </div>
  </base-card>
</template>

<style scoped lang="postcss"></style>
