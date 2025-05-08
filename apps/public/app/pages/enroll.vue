<template>
  <ion-page>
    <ion-content>
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col class="ion-text-center">
            <h1 class="text-2xl font-bold">
              Enroll
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
const loading = ref(false);

const route = useRoute();
const { state } = useSession();
const { enroll, updateFirstFactor } = useMfa();

await updateFirstFactor();

const handleFinishedPinInput = async (value: string) => {
  loading.value = true;
  try {
    const result = await enroll(value);
    if (result?.data) {
      await navigateTo({
        path: getAuthRedirection(route),
      });
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

definePageMeta({
  allowNonEnrolled: true,
});
</script>
