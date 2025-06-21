<template>
  <ion-page>
    <ion-content>
      <ion-grid
        class="flex flex-col h-full items-center justify-center"
      >
        <ion-row class="ion-justify-content-center">
          <ion-col class="ion-text-center">
            <h1 class="text-2xl font-bold">
              Verify Your Identity
            </h1>
            <p class="text-sm text-gray-500">
              Please enter your PIN
            </p>
            <!-- <p v-if="factors.length > 1">
              There are multiple factors enrolled. Please select the one you want to use.
            </p>
            <p v-else>
              Just One Factor Enrolled.
            </p> -->
          </ion-col>
        </ion-row>
        <ion-row
          v-if="firstFactor"
          class="ion-justify-content-center"
        >
          <NuxtImg :src="state.firstFactor?.totp.qr_code" />
          <p class="text-sm text-gray-500">
            Please open your authenticator app and scan the code displayed.
          </p>
        </ion-row>
        <ion-row>
          <ui-pin-input
            :disabled="loading"
            placeholder="*"
            @finished-input="handleVerification"
          />
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import UiPinInput from '../components/pinInput.vue';
import useMfa from '../composables/useMfa';

const {
  loading,
  state,
  firstFactor,
  handleVerification,
  initializeFactors,
} = useMfa();

await initializeFactors();
</script>
