<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { onMounted, ref, watch } from 'vue'

import { useToastStore } from '@/stores/toast.store'

import type { IIpAddressRestriction } from '../types'

const { toastRef } = useToastStore()
const updateIndex = ref(-1)
const ipAddressInput = ref<string>('')
const ipAddressPlaceholder = ref<string>('')
const ipAddressInputRef = ref()
const ipAddressRestrictions = defineModel<IIpAddressRestriction[]>('ipAddressRestrictions', {
  required: true
})
const searchText = ref<string>('')
const filtered = ref()
const submitType = ref<'add' | 'update'>('add')

onMounted(() => {
  filtered.value = ipAddressRestrictions.value
})

watch(ipAddressRestrictions.value, () => {
  filtered.value = ipAddressRestrictions.value
})

const onSearch = () => {
  filtered.value = ipAddressRestrictions.value.filter((el: IIpAddressRestriction) => {
    return el.address.includes(searchText.value)
  })
}

const onSave = () => {
  for (const ipAddressRestriction of ipAddressRestrictions.value) {
    if (ipAddressRestriction.address === ipAddressInput.value) {
      toastRef.toast(`IP address "${ipAddressRestriction.address}" is exists`, { color: 'danger' })
      return
    }
  }

  if (!ipAddressInput.value) {
    toastRef.toast(`URL is required`, { color: 'danger' })
    return
  }

  submitType.value = 'add'

  if (updateIndex.value >= 0) {
    // update collection
    ipAddressRestrictions.value[updateIndex.value].address = ipAddressInput.value
    updateIndex.value = -1
  } else {
    // add new collection
    ipAddressRestrictions.value.push({
      id: uuidv4(),
      address: ipAddressInput.value
    })
  }

  // reset input text
  ipAddressInput.value = ''

  // reset search text
  searchText.value = ''
}

const onUpdate = (ipAddressRestriction: IIpAddressRestriction) => {
  submitType.value = 'update'
  ipAddressPlaceholder.value = ipAddressRestriction.address
  updateIndex.value = ipAddressRestrictions.value.indexOf(ipAddressRestriction)
  ipAddressInput.value = ipAddressRestriction.address
  ipAddressInputRef.value.inputRef.focus()
}

const onCancel = () => {
  submitType.value = 'add'
  updateIndex.value = -1
  ipAddressInput.value = ''
}

const onDelete = (ipAddressRestriction: IIpAddressRestriction) => {
  for (const [index, iterator] of ipAddressRestrictions.value.entries()) {
    if (iterator.id === ipAddressRestriction.id) {
      submitType.value = 'add'
      searchText.value = ''
      updateIndex.value = -1
      ipAddressInput.value = ''
      ipAddressInputRef.value.inputRef.focus()
      ipAddressRestrictions.value.splice(index, 1)
      break
    }
  }
}
</script>

<template>
  <base-card>
    <template #header>IP address restrictions</template>
    <p>
      Specify one or more IP addresses of the callers that are allowed to use your API key. Format
      as an IPv4. Examples: 192.168.0.1
    </p>
    <base-table v-if="ipAddressRestrictions.length">
      <thead>
        <tr>
          <th>
            <base-input
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
        <tr v-for="ipAddressRestriction in filtered" :key="ipAddressRestriction">
          <td>{{ ipAddressRestriction.address }}</td>
          <td>
            <div class="flex">
              <base-button size="sm" v-tooltip="'edit'" @click="onUpdate(ipAddressRestriction)">
                <base-icon icon="i-fad-pencil"></base-icon>
              </base-button>
              <base-button size="sm" v-tooltip="'delete'" @click="onDelete(ipAddressRestriction)">
                <base-icon icon="i-fad-trash"></base-icon>
              </base-button>
            </div>
          </td>
        </tr>
      </tbody>
    </base-table>
    <form class="flex flex-col gap-4 mt-5" @submit.prevent="onSave">
      <base-input v-model="ipAddressInput" ref="ipAddressInputRef" required label="IP Address">
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
  </base-card>
</template>

<style scoped lang="postcss"></style>
