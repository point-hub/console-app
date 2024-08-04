<script setup lang="ts">
import { BaseButton, BaseCard, BaseCheckbox, BaseInput } from '@point-hub/papp'
import { AxiosError } from 'axios'
import { reactive } from 'vue'

import axios from '@/axios'
import { useToastStore } from '@/stores/toast.store'

import { useForm } from './form'
import { usePassword } from './password'

const { toastRef } = useToastStore()
const form = reactive(useForm())
const password = reactive(usePassword())

const onEmailChange = async () => {
  try {
    form.data.errors.email = []
    const response = await axios.post('/v1/auth/existing-email', form.data)
    if (response.data.exists === true) {
      form.data.errors.email = ['Email is exists']
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errors = error?.response?.data?.errors
      if (errors) {
        for (const key in errors) {
          form.data.errors[key] = errors[key]
        }
      }
    }
  }
}

const onSubmit = async () => {
  if (form.data.errors.password.length !== 0) {
    return toastRef.toast('Please use strong password', { color: 'danger' })
  }
  if (!form.isPasswordConfirmed) {
    return toastRef.toast('Password confirmation not match', { color: 'danger' })
  }
  if (!form.data.acceptTerms) {
    return toastRef.toast('Please accept terms & privacy', { color: 'danger' })
  }

  try {
    const response = await axios.post('/v1/auth/signup', form.data)
    if (response.status === 201) {
      // form.reset()
      toastRef.toast('Signup Success', { color: 'success' })
    }
  } catch (error: any) {
    const errors = error?.response?.data?.errors
    if (errors) {
      for (const key in errors) {
        form.data.errors[key] = errors[key]
      }
    }
    return toastRef.toast(error?.response?.data?.message, { color: 'danger' })
  }
}
</script>

<template>
  <component :is="BaseCard" class="max-w-xl">
    <form @submit.prevent="onSubmit" class="flex flex-col gap-8">
      <div class="-mt-4">
        <h3 class="font-semibold">Sign up to Pointhub Console</h3>
      </div>
      <div class="flex flex-col gap-4">
        <component
          :is="BaseInput"
          required
          label="Name"
          autofocus
          layout="vertical"
          v-model="form.data.name"
          :errors="form.data.errors.name"
        />
        <component
          :is="BaseInput"
          required
          label="Email"
          layout="vertical"
          v-model="form.data.email"
          :errors="form.data.errors.email"
          @change="onEmailChange"
        />
        <component
          :is="BaseInput"
          required
          label="Username"
          layout="vertical"
          v-model="form.data.username"
          :errors="form.data.errors.username"
          :helpers="['You can use this username for signin']"
        />
        <component
          :is="BaseInput"
          required
          label="Password"
          layout="vertical"
          :type="password.type"
          v-model="form.data.password"
          @keyup="form.passwordValidation()"
          :errors="form.data.errors.password"
        >
          <template #suffix>
            <BaseButton @click="password.toggle" variant="text" color="secondary">
              <BaseIcon icon="i-far-eye" />
            </BaseButton>
          </template>
        </component>
        <component
          :is="BaseInput"
          required
          label="Confirm Password"
          layout="vertical"
          :type="password.type"
          v-model="form.data.confirmPassword"
          @keyup="form.confirmPasswordValidation()"
          :errors="form.data.errors.confirmPassword"
        >
          <template #suffix>
            <BaseButton @click="password.toggle" variant="text" color="secondary">
              <BaseIcon icon="i-far-eye" />
            </BaseButton>
          </template>
        </component>
        <div class="flex items-center">
          <component :is="BaseCheckbox" v-model="form.data.acceptTerms" />
          <p>
            Accept <a href="https://pointhub.net/privacy" target="_blank">Privacy</a> &
            <a href="https://pointhub.net/terms" target="_blank">Terms</a>
          </p>
        </div>
      </div>
      <component :is="BaseButton" type="submit" color="primary">Sign Up</component>
    </form>
  </component>
</template>
