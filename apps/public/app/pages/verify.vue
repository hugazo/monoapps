<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Verify</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-grid class="flex flex-col h-full items-center justify-center">
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
        <ion-row>
          <ui-pin-input
            :disabled="loading"
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
const selectedFactor = ref(0);

const route = useRoute();
const { verify, state } = useMfa();

const handleFinishedPinInput = async (value: string) => {
  loading.value = true;
  try {
    const factor = state.factors ? state.factors[selectedFactor.value] : null;
    if (factor) {
      const result = await verify(value, factor.id);
      if (result?.data) {
        await navigateTo({
          path: getAuthRedirection(route),
        });
      }
    }
  }
  catch (error) {
    console.error('Error verifying PIN:', error);
    // Handle error (e.g., show a toast or alert)
  }
  finally {
    loading.value = false;
  }
};

definePageMeta({
  allowNonEnrolled: true,
});
</script>
