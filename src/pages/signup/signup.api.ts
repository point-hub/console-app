import { AxiosError } from 'axios'

import axios from '@/axios'
import { useToastStore } from '@/stores/toast.store'

const { toastRef } = useToastStore()

export function useSignupApi() {
  const send = async (data: any, errors: any) => {
    try {
      const response = await axios.post('/v1/auth/signup', {
        username: data.username,
        password: data.password,
        remember_me: data.rememberMe
      })
      console.log('submit', response.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        const formErrors = error?.response?.data?.errors
        if (formErrors) {
          for (const key in formErrors) {
            errors[key] = formErrors[key]
          }
        } else {
          toastRef.toast(error.response?.data.message, { color: 'danger' })
        }
      }
    }
  }

  return { send }
}
