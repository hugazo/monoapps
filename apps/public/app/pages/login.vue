<template>
  <ion-page>
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
              v-model="email"
              label="Email"
              type="email"
              placeholder="user@company"
            />
            <ion-input
              v-model="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
            />
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script async setup lang="ts">
const email = ref('');
const password = ref('');

// TODO: Implement login logic
</script>
