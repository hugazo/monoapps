<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Enroll</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-grid class="flex flex-col h-full items-center justify-center">
        <ion-row class="ion-justify-content-center">
          <ion-col class="ion-text-center">
            <h1 class="text-2xl font-bold">
              Enroll Your 2FA Factor
            </h1>
            <p class="text-sm text-gray-500">
              Please enter your PIN
            </p>
          </ion-col>
        </ion-row>
        <ion-row class="ion-justify-content-center">
          <NuxtImg :src="state.firstFactor?.data?.totp.qr_code" />
        </ion-row>
        <ion-row>
          <ui-pin-input
            :disabled="loading"
            :send-after-finished="false"
            :send-after-paste="false"
            placeholder="*"
            @finished-input="handleFinishedPinInput"
          />
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import UiPinInput from '../components/pinInput.vue';
import useSession from '../composables/useAuth';
import useMfa from '../composables/useMfa';
import { ref } from '#imports';

const loading = ref(false);

const { state, loggedInRedirect } = useSession();
const { enroll, updateFirstFactor } = useMfa();

await updateFirstFactor();

const handleFinishedPinInput = async (value: string) => {
  loading.value = true;
  try {
    const result = await enroll(value);
    if (result?.data) {
      loggedInRedirect();
    }
  }
  catch (error) {
    // TODO: Handle error properly
    console.error('Error verifying PIN:', error);
  }
  finally {
    loading.value = false;
  }
};

// definePageMeta({
//   allowNonEnrolled: true,
// });
</script>
