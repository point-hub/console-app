import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface IAuth {
  name?: string
  projectId?: string
}

export const useAuthStore = defineStore('auth-store', () => {
  const name = ref()
  const projectId = ref()

  const update = (auth: IAuth) => {
    if (auth.name) name.value = auth.name
    if (auth.projectId) projectId.value = auth.projectId
  }

  return { name, projectId, update }
})
