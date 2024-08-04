import { computed, ref } from 'vue'

import { useEmailValidation } from './validation'

interface IForm {
  name: string
  email: string
  username: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
  errors: {
    [key: string]: string[]
    name: string[]
    email: string[]
    username: string[]
    password: string[]
    confirmPassword: string[]
    acceptTerms: string[]
  }
}

export function useForm() {
  const emailValidation = useEmailValidation()

  const data = ref<IForm>({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    acceptTerms: true,
    errors: {
      name: [],
      email: [],
      username: [],
      password: [],
      confirmPassword: [],
      acceptTerms: []
    }
  })

  const isPasswordConfirmed = computed(() => {
    return (
      data.value.password.length > 0 &&
      data.value.confirmPassword.length > 0 &&
      data.value.errors.password.length === 0
    )
  })

  const confirmPasswordValidation = () => {
    data.value.errors.confirmPassword = []
    if (data.value.confirmPassword.length === 0) {
      return
    }
    if (data.value.password !== data.value.confirmPassword) {
      data.value.errors.confirmPassword.push('Password not match')
    }
  }

  const passwordValidation = () => {
    data.value.errors.password = []
    confirmPasswordValidation()
    if (data.value.password.length === 0) {
      return
    }
    if (data.value.password.length < 8) {
      data.value.errors.password.push('Use at least 8 characters')
    }
    if (!emailValidation.containsUppercase(data.value.password)) {
      data.value.errors.password.push('Contain at least one uppercase letter')
    }
    if (!emailValidation.containsLowercase(data.value.password)) {
      data.value.errors.password.push('Contain at least one lowercase letter')
    }
    if (!emailValidation.containsNumber(data.value.password)) {
      data.value.errors.password.push('Contain at least one numeric character')
    }
    if (!emailValidation.containsSpecialChars(data.value.password)) {
      data.value.errors.password.push('Contain at least one special character')
    }
  }

  const reset = () => {
    data.value = {
      name: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      errors: {
        name: [],
        email: [],
        username: [],
        password: [],
        confirmPassword: [],
        acceptTerms: []
      }
    }
  }

  return { data, reset, isPasswordConfirmed, confirmPasswordValidation, passwordValidation }
}
