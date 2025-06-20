<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-grid class="flex flex-col h-full items-center justify-center">
        <ion-row>
          <ion-col class="text-center">
            <h1 class="text-3xl font-bold">
              Welcome Back
            </h1>
            <p class="text-sm text-gray-500">
              Please login to your account
            </p>
          </ion-col>
        </ion-row>
        <ion-row class="w-full max-w-lg">
          <ion-col>
            <ion-input
              v-model="loginForm.data.value.email"
              :disabled="loginForm.isSubmitting.value"
              label="Email"
              type="email"
              placeholder="user@company"
            />
            <ion-input
              v-model="loginForm.data.value.password"
              :disabled="loginForm.isSubmitting.value"
              label="Password"
              type="password"
              placeholder="Enter your password"
              @keyup.enter.prevent="handleLogin"
            />
            <ion-button
              class="mt-4"
              shape="round"
              expand="full"
              @click="handleLogin"
            >
              Login
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script async setup lang="ts">
import useSession from '../composables/useAuth';

const {
  loginForm,
  handleLogin,
} = useSession();
</script>
